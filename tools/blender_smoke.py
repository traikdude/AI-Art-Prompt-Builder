#!/usr/bin/env python3
"""
Blender smoke test — run inside Blender with --background --python.
Creates a simple scene, animates a camera dolly, and renders frame 1.
Must be run as: blender --background --python tools/blender_smoke.py
"""

import sys
import os


def main():
    try:
        import bpy
    except ImportError:
        print("Error: bpy module not found. Run this script inside Blender:")
        print('  blender --background --python tools/blender_smoke.py')
        sys.exit(1)

    print(f"Blender {bpy.app.version_string}")

    # Clear default scene
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False, confirm=False)

    # Create camera
    bpy.ops.object.camera_add(location=(5, 0, 0))
    camera = bpy.context.active_object
    camera.name = "Camera"
    bpy.context.scene.camera = camera

    # Keyframe camera position at frame 1
    camera.location = (5, 0, 0)
    camera.keyframe_insert(data_path="location", frame=1)

    # Keyframe camera position at frame 48
    camera.location = (0, 0, 0)
    camera.keyframe_insert(data_path="location", frame=48)

    # Create cube
    bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0))
    cube = bpy.context.active_object
    cube.name = "Cube"

    # Set render engine to Eevee (fast)
    bpy.context.scene.render.engine = 'BLENDER_EEVEE'

    # Set output format
    out_dir = os.path.join(os.path.dirname(__file__), "out")
    os.makedirs(out_dir, exist_ok=True)

    output_path = os.path.join(out_dir, "render.png")
    bpy.context.scene.render.filepath = output_path
    bpy.context.scene.render.image_settings.file_format = 'PNG'
    bpy.context.scene.render.resolution_x = 640
    bpy.context.scene.render.resolution_y = 360
    bpy.context.scene.frame_set(1)

    # Render frame 1
    bpy.ops.render.render(write_still=True)

    # Check output
    if os.path.exists(output_path):
        file_size = os.path.getsize(output_path)
        print(f"Output: {output_path}")
        print(f"File size: {file_size} bytes")
    else:
        print(f"Error: Render failed, output not found at {output_path}")
        sys.exit(1)


if __name__ == "__main__":
    main()
