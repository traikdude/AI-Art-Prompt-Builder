#!/usr/bin/env python3
"""
Driver: ask the live Prompt Builder API for a video prompt, then render a Blender previz of it.

  python tools/previz_from_api.py "character.Outfit=Assassin" "scene.Environment=Abandoned Fairy Court" \
      "camera.Shot Type=Aerial Shot" "video.Camera Move=Crane Up" "video.Duration=5s" \
      "video.Aspect Ratio + FPS=16:9 @ 24fps" "video.Motion Intensity=Moderate"

Env: PROMPT_BUILDER_API (default = the deployed exec URL), BLENDER_EXE (default = Blender 5.2 install).
Writes tools/out/<stamp>_video.json and tools/out/previz_<shot>.mp4, prints both paths, exits non-zero on failure.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import time
import urllib.parse
import urllib.request

API = os.environ.get(
    "PROMPT_BUILDER_API",
    "https://script.google.com/macros/s/AKfycbyCjig1ociubkgrGw5P814n3aX1pQvzM4N5erySJWTJijL2oQW9ZfBZDUvwohLxHmyjNw/exec",
)
BLENDER = os.environ.get("BLENDER_EXE", r"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe")
HERE = os.path.dirname(os.path.abspath(__file__))


def fetch_video_json(selections: list[str]) -> dict:
    params = {"action": "prompt"}
    for item in selections:
        key, _, value = item.partition("=")
        if not value:
            raise SystemExit(f"bad selection (need key=value): {item!r}")
        params[key] = value
    url = API + "?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=120) as resp:  # noqa: S310 (fixed https host)
        body = json.load(resp)
    if not body.get("ok"):
        raise SystemExit(f"API error: {body.get('error')}")
    video = (body.get("data") or {}).get("video")
    if not video:
        raise SystemExit("API returned no data.video; include at least one video.* selection")
    return {"prompt": body["data"]["prompt"], "text": video["text"], "json": video["json"]}


def main(argv: list[str]) -> int:
    if not argv:
        print(__doc__)
        return 2
    if not os.path.isfile(BLENDER):
        print(f"Blender not found at {BLENDER}; set BLENDER_EXE")
        return 3
    result = fetch_video_json(argv)
    out_dir = os.path.join(HERE, "out")
    os.makedirs(out_dir, exist_ok=True)
    stamp = time.strftime("%Y%m%d-%H%M%S")
    spec_path = os.path.join(out_dir, f"{stamp}_video.json")
    with open(spec_path, "w", encoding="utf-8") as fh:
        json.dump(result["json"], fh, indent=2)
    print("PROMPT:", result["prompt"])
    print("VIDEO :", result["text"])
    print("SPEC  :", spec_path)

    cmd = [BLENDER, "--background", "--python", os.path.join(HERE, "blender_previz.py"), "--", "--json", spec_path]
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=900)
    for line in proc.stdout.splitlines():
        if line.startswith(("PREVIZ", "NOTE", "ERROR")):
            print(line)
    produced = any(line.startswith("PREVIZ OUTPUT:") for line in proc.stdout.splitlines())
    if proc.returncode != 0 or not produced:
        # Blender exits 0 even when the Python script raises, so the output line is the real postcondition
        tail = (proc.stdout + proc.stderr)[-2500:]
        print("PREVIZ FAILED (no output produced). Blender tail:")
        print(tail)
        return proc.returncode or 4
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
