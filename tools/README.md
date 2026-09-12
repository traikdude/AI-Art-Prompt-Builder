# Creative Tools Smoke Tests

This directory contains smoke tests for integrating with professional creative software.

## Blender Smoke Test

**File:** `tools/blender_smoke.py`

**How to run:**
```bash
"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" --background --python tools/blender_smoke.py
```

**What success looks like:**
- Prints `Blender 5.2.1` (or current version)
- Creates a scene with a camera and cube
- Animates the camera on a dolly move over 48 frames
- Renders frame 1 to `tools/out/render.png` at 640×360 using Eevee
- Prints the output path and file size in bytes

**Output location:** `tools/out/render.png`

**Expected output:**
```
Blender 5.2.1
Output: C:\Users\traik\AppsScript\AiArtPromptBuilder\tools\out\render.png
File size: NNNN bytes
```

---

## DaVinci Resolve Smoke Test

**File:** `tools/davinci_smoke.py`

**How to run:**
```bash
python tools/davinci_smoke.py
```

**What success looks like (if Resolve is installed and running):**
- Prints product name: `DaVinci Resolve` or `DaVinci Resolve Studio`
- Prints version number (e.g., `21.1`)
- Prints current project name (or "no project open")
- Prints timeline count in the current project
- Prints media pool clip count

**Expected output:**
```
Product: DaVinci Resolve
Version: 21.1
Project: no project open
Timelines: 0
Media pool clips: 0
```

**If Resolve is not installed or not running:**
- Prints a single diagnostic line
- Exits with code 3 (not a traceback)

**Example failure output:**
```
DaVinci Resolve not installed or RESOLVE_SCRIPT_API not set
```

---

## Environment Setup

### Blender 5.2

**Installed at:** `C:\Program Files\Blender Foundation\Blender 5.2\blender.exe`

Blender is available on this machine and ready for testing. The script uses Blender's bundled Python (`bpy` module).

### DaVinci Resolve

**Status:** Awaiting installation on this machine.

When installed, Resolve exposes its Python scripting API at:
```
%PROGRAMDATA%\Blackmagic Design\DaVinci Resolve\Support\Developer\Scripting\Modules
```

Or via environment variables:
- `RESOLVE_SCRIPT_API`
- `RESOLVE_SCRIPT_LIB`

---

## Testing Notes

- Both scripts are under 80 lines and include type hints where applicable.
- No secrets are printed.
- Blender renders to `tools/out/` (created on first run).
- DaVinci Resolve gracefully exits with code 3 if not installed or running (no tracebacks).
