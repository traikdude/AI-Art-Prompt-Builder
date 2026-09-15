#!/usr/bin/env python3
"""
DaVinci Resolve smoke test — check installation and basic connectivity.
Exit 3 if Resolve is not installed or not running.
"""

import sys
import os


def main():
    # Try common Resolve script API paths on Windows
    script_api_paths = [
        os.path.expandvars(r"%PROGRAMDATA%\Blackmagic Design\DaVinci Resolve\Support\Developer\Scripting\Modules"),
        os.getenv("RESOLVE_SCRIPT_LIB"),
        os.getenv("RESOLVE_SCRIPT_API"),
    ]

    script_api_path = None
    for path in script_api_paths:
        if path and os.path.isdir(path):
            script_api_path = path
            break

    if not script_api_path:
        print("DaVinci Resolve not installed or RESOLVE_SCRIPT_API not set")
        sys.exit(3)

    # Add to path and try to import
    sys.path.insert(0, script_api_path)
    try:
        import DaVinciResolveScript as DVR
    except ImportError:
        print("DaVinci Resolve scripting module not found")
        sys.exit(3)

    # Connect to Resolve
    try:
        resolve = DVR.scriptapp("Resolve")
        if not resolve:
            print("DaVinci Resolve is not running or connection failed")
            sys.exit(3)
    except Exception as e:
        print(f"DaVinci Resolve connection error: {e}")
        sys.exit(3)

    # Query basic info
    try:
        product_name = resolve.GetProductName()
        version = resolve.GetVersion()
        project = resolve.GetProjectManager().GetCurrentProject()
        project_name = project.GetName() if project else "no project open"

        timeline_count = 0
        if project:
            timelines = project.GetTimelines()
            timeline_count = len(timelines) if timelines else 0

        media_pool = project.GetMediaPool() if project else None
        clip_count = 0
        if media_pool:
            root_folder = media_pool.GetRootFolder()
            if root_folder:
                clips = root_folder.GetClipList()
                clip_count = len(clips) if clips else 0

        print(f"Product: {product_name}")
        print(f"Version: {version}")
        print(f"Project: {project_name}")
        print(f"Timelines: {timeline_count}")
        print(f"Media pool clips: {clip_count}")
    except Exception as e:
        print(f"Error querying Resolve: {e}")
        sys.exit(3)


if __name__ == "__main__":
    main()
