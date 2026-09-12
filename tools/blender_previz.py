#!/usr/bin/env python3
"""
Blender previz rig (Idea 4) — turns the Prompt Builder API's `video.json` into a short
grey-box animation so framing and camera motion can be checked BEFORE paying for a
Veo / Runway / Kling generation.

Run inside Blender:
  blender --background --python tools/blender_previz.py -- --json shot.json [--out tools/out/previz.mp4]
The JSON is the `data.video.json` object returned by  ?action=prompt&video.…  (see docs/VIDEO_DATA_MODEL.md):
  {shot, camera_move, duration_s, aspect, fps, motion_intensity, sequence_role, subject, scene}
Everything unknown falls back to a sane default and is reported, never silently dropped.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import sys

# ---- vocabulary → rig parameters --------------------------------------------------
# Shot Type → camera distance from the 2 m tall placeholder subject (metres) and lens (mm)
SHOT_DISTANCE = {
    "extreme wide shot": (18.0, 24), "wide shot / long shot": (10.0, 28), "wide shot": (10.0, 28),
    "establishing shot": (16.0, 24), "aerial shot": (14.0, 28), "medium shot": (4.5, 50),
    "over-the-shoulder shot": (3.0, 50), "close-up": (1.6, 85), "extreme close-up": (0.8, 100),
    "trunk shot": (2.5, 35), "money shot": (5.0, 50), "snorricam shot": (1.2, 24),
    "zolly shot / dolly zoom": (6.0, 35), "pivotal character shot": (4.0, 50), "split diopter shot": (4.0, 35),
}
DEFAULT_SHOT = (6.0, 40)

# Aspect → (width, height) at previz resolution
ASPECT_RES = {"16:9": (640, 360), "9:16": (360, 640), "1:1": (480, 480), "4:5": (432, 540), "21:9": (672, 288)}

# Motion Intensity → multiplier on move amplitude
INTENSITY = {"static/none": 0.0, "subtle": 0.4, "moderate": 1.0, "high": 1.8, "frenetic": 2.6,
             "slow motion": 0.5, "motion blur": 1.4, "freeze frame": 0.0}


def parse_args(argv: list[str]) -> argparse.Namespace:
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", required=True, help="path to video.json from the API")
    ap.add_argument("--out", default=None, help="output .mp4 path (default tools/out/previz_<shot>.mp4)")
    ap.add_argument("--max-seconds", type=float, default=4.0, help="cap previz length to keep renders cheap")
    return ap.parse_args(argv)


def norm(s: str | None) -> str:
    return (s or "").strip().lower()


def build_scene(bpy, spec: dict) -> dict:
    """Creates subject + ground + camera and keyframes the requested move. Returns resolved params."""
    scene = bpy.context.scene
    # Linear interpolation reads truer for a previz than eased curves (set before any keyframe;
    # Blender 5 slotted actions no longer expose action.fcurves directly)
    try:
        bpy.context.preferences.edit.keyframe_new_interpolation_type = "LINEAR"
    except Exception:  # noqa: BLE001 - preference missing on some builds; eased curves are acceptable
        pass
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False, confirm=False)

    # Ground and a 2 m tall placeholder "subject" (capsule-ish: cylinder + sphere head)
    bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, 0))
    bpy.ops.mesh.primitive_cylinder_add(radius=0.35, depth=1.6, location=(0, 0, 0.8))
    body = bpy.context.active_object
    body.name = "Subject"
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.25, location=(0, 0, 1.85))
    # A few scene blocks so wide shots have parallax
    for i, (x, y) in enumerate([(-6, 8), (7, 12), (-9, -6), (10, -9), (3, 20)]):
        bpy.ops.mesh.primitive_cube_add(size=2 + i, location=(x, y, (2 + i) / 2))
    bpy.ops.object.light_add(type="SUN", location=(5, -5, 10))
    bpy.context.active_object.data.energy = 3.0

    fps = int(spec.get("fps") or 24)
    duration = float(spec.get("duration_s") or 3.0)
    duration = min(duration, spec.get("_max_seconds", 4.0))
    frames = max(int(round(duration * fps)), 2)
    scene.frame_start, scene.frame_end = 1, frames
    scene.render.fps = fps

    dist, lens = SHOT_DISTANCE.get(norm(spec.get("shot")), DEFAULT_SHOT)
    amp = INTENSITY.get(norm(spec.get("motion_intensity")), 1.0)
    move = norm(spec.get("camera_move")) or "static"

    bpy.ops.object.camera_add(location=(0, -dist, 1.2))
    cam = bpy.context.active_object
    cam.name = "PrevizCamera"
    cam.data.lens = lens
    scene.camera = cam
    # Track-to keeps the subject framed through every move
    con = cam.constraints.new(type="TRACK_TO")
    con.target = body
    con.track_axis, con.up_axis = "TRACK_NEGATIVE_Z", "UP_Y"

    aerial = norm(spec.get("shot")) == "aerial shot"
    z0 = 1.2 if not aerial else dist * 0.8
    start = [0.0, -dist, z0]
    end = list(start)
    lens_end = lens
    d = dist * 0.35 * amp  # base travel

    if move == "dolly in":        end[1] += d
    elif move == "dolly out":     end[1] -= d
    elif move == "truck left":    end[0] -= d
    elif move == "truck right":   end[0] += d
    elif move == "crane up":      end[2] += d
    elif move == "crane down":    end[2] = max(0.3, end[2] - d)
    elif move == "pan left":      con.influence = 0.0; cam.rotation_euler = (math.radians(90), 0, 0)
    elif move == "pan right":     con.influence = 0.0; cam.rotation_euler = (math.radians(90), 0, 0)
    elif move == "tilt up":       con.influence = 0.0; cam.rotation_euler = (math.radians(90), 0, 0)
    elif move == "tilt down":     con.influence = 0.0; cam.rotation_euler = (math.radians(90), 0, 0)
    elif move == "zoom in":       lens_end = lens * (1 + 0.6 * amp)
    elif move == "zoom out":      lens_end = lens / (1 + 0.6 * amp)
    elif move == "handheld":      pass  # noise added below
    elif move in ("orbit/arc", "orbit", "arc"):
        pass  # handled per-frame below

    cam.location = start
    cam.keyframe_insert("location", frame=1)
    cam.data.lens = lens
    cam.data.keyframe_insert("lens", frame=1)

    if move in ("orbit/arc", "orbit", "arc"):
        sweep = math.radians(60 * amp)
        for f in range(1, frames + 1):
            t = (f - 1) / (frames - 1)
            a = -math.pi / 2 + sweep * (t - 0.5)
            cam.location = (dist * math.cos(a), dist * math.sin(a), z0)
            cam.keyframe_insert("location", frame=f)
    elif move == "handheld":
        import random
        random.seed(7)
        for f in range(1, frames + 1, max(1, fps // 6)):
            cam.location = (start[0] + random.uniform(-0.08, 0.08) * amp,
                            start[1] + random.uniform(-0.05, 0.05) * amp,
                            start[2] + random.uniform(-0.06, 0.06) * amp)
            cam.keyframe_insert("location", frame=f)
    elif move.startswith(("pan", "tilt")):
        rx, rz = math.radians(90), 0.0
        swing = math.radians(35 * amp)
        cam.rotation_euler = (rx, 0, rz)
        cam.keyframe_insert("rotation_euler", frame=1)
        if move == "pan left":    rz += swing
        elif move == "pan right": rz -= swing
        elif move == "tilt up":   rx += swing * 0.6
        elif move == "tilt down": rx -= swing * 0.6
        cam.rotation_euler = (rx, 0, rz)
        cam.keyframe_insert("rotation_euler", frame=frames)
    else:
        cam.location = end
        cam.keyframe_insert("location", frame=frames)
        cam.data.lens = lens_end
        cam.data.keyframe_insert("lens", frame=frames)

    return {"fps": fps, "duration_s": duration, "frames": frames, "shot": spec.get("shot") or "(default)",
            "distance_m": dist, "lens_mm": lens, "camera_move": move, "amplitude": amp}


def render(bpy, spec: dict, out_path: str) -> str:
    """Renders a PNG frame sequence (this Blender build has no FFmpeg output), then encodes MP4 via
    ffmpeg when available. Returns the MP4 path, or the frame directory when ffmpeg is absent."""
    import shutil
    import subprocess
    scene = bpy.context.scene
    w, h = ASPECT_RES.get((spec.get("aspect") or "16:9").strip(), ASPECT_RES["16:9"])
    r = scene.render
    r.engine = "BLENDER_EEVEE" if hasattr(bpy.types, "SceneEEVEE") else "BLENDER_WORKBENCH"
    r.resolution_x, r.resolution_y, r.resolution_percentage = w, h, 100
    frame_dir = out_path.rsplit(".", 1)[0] + "_frames"
    os.makedirs(frame_dir, exist_ok=True)
    r.image_settings.file_format = "PNG"
    r.filepath = os.path.join(frame_dir, "frame_")
    bpy.ops.render.render(animation=True, write_still=False)
    frames = sorted(f for f in os.listdir(frame_dir) if f.endswith(".png"))
    print(f"PREVIZ FRAMES: {len(frames)} in {frame_dir}")
    ffmpeg = os.environ.get("FFMPEG_EXE") or shutil.which("ffmpeg")
    if not ffmpeg:  # winget installs land outside PATH for non-login shells
        import glob
        hits = glob.glob(os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg*fmpeg-*infmpeg.exe"))
        ffmpeg = hits[0] if hits else None
    if not ffmpeg or not frames:
        print("NOTE: ffmpeg not on PATH; leaving PNG sequence (VLC can play it: File > Open, tick 'Image sequence')")
        return frame_dir
    cmd = [ffmpeg, "-y", "-loglevel", "error", "-framerate", str(scene.render.fps),
           "-i", os.path.join(frame_dir, "frame_%04d.png"), "-c:v", "libx264", "-pix_fmt", "yuv420p", out_path]
    subprocess.run(cmd, check=False)
    return out_path if os.path.isfile(out_path) else frame_dir


def main() -> None:
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    args = parse_args(argv)
    try:
        import bpy
    except ImportError:
        print("Run inside Blender: blender --background --python tools/blender_previz.py -- --json shot.json")
        sys.exit(1)

    with open(args.json, encoding="utf-8") as fh:
        spec = json.load(fh)
    spec["_max_seconds"] = args.max_seconds
    tools_dir = os.path.dirname(os.path.abspath(__file__))
    out_dir = os.path.join(tools_dir, "out")
    os.makedirs(out_dir, exist_ok=True)
    tag = norm(spec.get("shot")).replace(" ", "_").replace("/", "-") or "default"
    out_path = args.out or os.path.join(out_dir, f"previz_{tag}.mp4")

    resolved = build_scene(bpy, spec)
    print("PREVIZ PARAMS:", json.dumps(resolved))
    unknown = [k for k, v in (("shot", SHOT_DISTANCE), ("camera_move", None)) if k == "shot" and norm(spec.get(k)) not in v]
    if unknown:
        print("NOTE: unknown shot type, used default distance/lens:", spec.get("shot"))
    final = render(bpy, spec, out_path)
    # Blender may append frame ranges to the filename; resolve the real file
    if os.path.isfile(final):
        print(f"PREVIZ OUTPUT: {final} ({os.path.getsize(final)} bytes)")
    elif os.path.isdir(final) and os.listdir(final):
        print(f"PREVIZ OUTPUT: {final} (frame sequence, {len(os.listdir(final))} files)")
    else:
        print("ERROR: no output produced"); sys.exit(2)


if __name__ == "__main__":
    main()
