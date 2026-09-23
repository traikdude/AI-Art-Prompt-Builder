#!/usr/bin/env python3
"""
AI Art Prompt Builder — Universal NotebookLM Source & Asset Synchronizer
========================================================================
Synchronizes local research notes, art theory monographs, vocabulary guides,
and prompt recipes into the Google Apps Script '🧠 NotebookLM_Sync' tab and
the '📅 Production_Queue' scheduling pipeline.

Architecture:
  Local Markdown / RAG Notes / Text files
        ↓ (sync_notebooklm_art_sources.py)
  Google Apps Script Web App API (?action=ingest_notebooklm)
        ↓
  Spreadsheet Tab: '🧠 NotebookLM_Sync' & '📅 Production_Queue'

Usage Examples:
  # 1. Ingest explicit research sources
  python scripts/sync_notebooklm_art_sources.py --sources "Atmospheric Light Scattering" "Surrealist Juxtapositions"

  # 2. Ingest markdown or text files
  python scripts/sync_notebooklm_art_sources.py --file docs/art-theory/chiaroscuro.md

  # 3. Scan a directory of research documents
  python scripts/sync_notebooklm_art_sources.py --dir docs/

  # 4. List all active synchronized sources
  python scripts/sync_notebooklm_art_sources.py --list

  # 5. Set NotebookLM Notebook ID / URL
  python scripts/sync_notebooklm_art_sources.py --set-notebook "https://notebooklm.google.com/notebook/your-notebook-id"

  # 6. Enqueue a prompt production task
  python scripts/sync_notebooklm_art_sources.py --enqueue "Cyberpunk Geisha" --engine "Midjourney v6" --prompt "cinematic close-up, neon rain"
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional

DEFAULT_WEBAPP_URL = os.getenv(
    "AI_ART_WEBAPP_URL",
    "https://script.google.com/macros/s/AKfycbyCjig1ociubkgrGw5P814n3aX1pQvzM4N5erySJWTJijL2oQW9ZfBZDUvwohLxHmyjNw/exec"
)
API_TOKEN = os.getenv("PROMPT_API_TOKEN", "")


def send_api_request(payload: Dict[str, Any], webapp_url: str = DEFAULT_WEBAPP_URL, token: str = API_TOKEN) -> Dict[str, Any]:
    """Posts a JSON action payload to the Google Apps Script Web App API."""
    if token and "token" not in payload:
        payload["token"] = token

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        webapp_url,
        data=data,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read().decode("utf-8")
            return json.loads(content)
    except urllib.error.HTTPError as he:
        err_body = he.read().decode("utf-8")
        return {"ok": False, "error": f"HTTP {he.code}: {err_body}"}
    except Exception as ex:
        return {"ok": False, "error": str(ex)}


def fetch_api_get(action: str, webapp_url: str = DEFAULT_WEBAPP_URL, token: str = API_TOKEN) -> Dict[str, Any]:
    """Sends a GET query to the Google Apps Script Web App API."""
    url = f"{webapp_url}?action={action}"
    if token:
        url += f"&token={token}"
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read().decode("utf-8")
            return json.loads(content)
    except Exception as ex:
        return {"ok": False, "error": str(ex)}


def parse_markdown_source(file_path: Path) -> Dict[str, Any]:
    """Extracts metadata, title, and summary from a local markdown document."""
    text = file_path.read_text(encoding="utf-8", errors="replace").strip()
    lines = text.splitlines()

    title = file_path.stem.replace("-", " ").replace("_", " ").title()
    for line in lines:
        if line.startswith("# "):
            title = line[2:].strip()
            break

    # Clean summary preview (first 300 non-header characters)
    clean_lines = [l for l in lines if not l.startswith("#") and l.strip()]
    summary = " ".join(clean_lines)[:350]
    if len(" ".join(clean_lines)) > 350:
        summary += "..."

    word_count = len(text.split())
    source_key = "SRC-" + re.sub(r"[^A-Za-z0-9]", "-", file_path.stem).upper()[:24]

    return {
        "key": source_key,
        "title": title,
        "documentType": "Markdown / Research",
        "summary": summary,
        "wordCount": word_count,
        "status": "SYNCED"
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Synchronize NotebookLM knowledge sources and production tasks with AI Art Prompt Builder."
    )
    parser.add_argument("--sources", nargs="+", help="One or more text titles/concepts to register as knowledge sources.")
    parser.add_argument("--file", help="Path to a markdown or text file to parse and synchronize.")
    parser.add_argument("--dir", help="Directory of markdown/text files to recursively parse and ingest.")
    parser.add_argument("--list", action="store_true", help="List all currently tracked NotebookLM sync sources.")
    parser.add_argument("--set-notebook", help="Set the canonical NotebookLM Notebook ID or full URL in Apps Script.")
    parser.add_argument("--get-notebook", action="store_true", help="Read the currently configured NotebookLM Notebook ID.")
    parser.add_argument("--enqueue", help="Concept / title to add to the Production Queue.")
    parser.add_argument("--engine", default="Midjourney v6", help="Target generative engine (default: Midjourney v6).")
    parser.add_argument("--ratio", default="16:9 (Landscape)", help="Aspect ratio for production queue item.")
    parser.add_argument("--prompt", default="", help="Prompt string for production queue item.")
    parser.add_argument("--notes", default="Added via CLI", help="Notes or tags for production queue item.")
    parser.add_argument("--url", default=DEFAULT_WEBAPP_URL, help="Override Google Apps Script Web App URL.")
    parser.add_argument("--token", default=API_TOKEN, help="Optional API token.")

    args = parser.parse_args()

    # --- Mode 1: Get Notebook ID ---
    if args.get_notebook:
        res = fetch_api_get("get_notebooklm_id", args.url, args.token)
        if res.get("ok"):
            nid = res.get("data", {}).get("notebookId") or "None (Not configured yet)"
            print(f"🧠 Current NotebookLM Notebook ID: {nid}")
            return 0
        else:
            print(f"❌ Failed to fetch Notebook ID: {res.get('error')}")
            return 1

    # --- Mode 2: Set Notebook ID ---
    if args.set_notebook:
        nid_input = args.set_notebook.strip()
        match = re.search(r"notebook/([a-zA-Z0-9_-]+)", nid_input)
        if match:
            nid_input = match.group(1)

        payload = {"action": "set_notebooklm_id", "notebookId": nid_input}
        res = send_api_request(payload, args.url, args.token)
        if res.get("ok"):
            print(f"✅ Successfully persisted NotebookLM Notebook ID: {nid_input}")
            return 0
        else:
            print(f"❌ Failed to save Notebook ID: {res.get('error')}")
            return 1

    # --- Mode 3: List Active Sync Sources ---
    if args.list:
        res = fetch_api_get("notebooklm", args.url, args.token)
        if res.get("ok"):
            data = res.get("data", {})
            items = data.get("items", [])
            print(f"\n🧠 Active NotebookLM Sync Sources ({len(items)} registered):")
            print("=" * 75)
            for it in items:
                key = it.get("Source Key", "N/A")
                title = it.get("Source Title", "Untitled")
                doc_type = it.get("Document Type", "")
                status = it.get("Sync Status", "")
                words = it.get("Estimated Word Count", "0")
                print(f"• [{key}] {title} ({doc_type}) — Status: {status} ({words} words)")
            print("=" * 75)
            return 0
        else:
            print(f"❌ Failed to list sources: {res.get('error')}")
            return 1

    # --- Mode 4: Enqueue Prompt Production Task ---
    if args.enqueue:
        item = {
            "concept": args.enqueue,
            "engine": args.engine,
            "ratio": args.ratio,
            "prompt": args.prompt,
            "notes": args.notes,
            "status": "QUEUED"
        }
        payload = {"action": "enqueue_production", "item": item}
        print(f"📅 Enqueuing task '{args.enqueue}' into Production Queue...")
        res = send_api_request(payload, args.url, args.token)
        if res.get("ok"):
            qid = res.get("data", {}).get("queueId")
            row = res.get("data", {}).get("row")
            print(f"✅ Queued successfully! Queue ID: {qid} (Row {row} in '📅 Production_Queue')")
            return 0
        else:
            print(f"❌ Failed to enqueue task: {res.get('error')}")
            return 1

    # --- Mode 5: Ingest Sources (from arguments, file, or directory) ---
    sources_to_ingest: List[Dict[str, Any]] = []

    if args.sources:
        for s in args.sources:
            slug = re.sub(r"[^A-Za-z0-9]", "-", s).upper()[:20]
            sources_to_ingest.append({
                "key": f"SRC-CLI-{slug}",
                "title": s,
                "documentType": "Concept / Prompt Reference",
                "summary": f"Prompt source reference registered via CLI for '{s}'",
                "status": "READY_FOR_SYNC",
                "wordCount": len(s.split())
            })

    if args.file:
        fpath = Path(args.file)
        if not fpath.is_file():
            print(f"❌ Specified file not found: {args.file}")
            return 1
        sources_to_ingest.append(parse_markdown_source(fpath))

    if args.dir:
        dpath = Path(args.dir)
        if not dpath.is_dir():
            print(f"❌ Specified directory not found: {args.dir}")
            return 1
        for p in sorted(dpath.rglob("*.md")):
            sources_to_ingest.append(parse_markdown_source(p))

    if not sources_to_ingest:
        print("ℹ️ No action specified. Use --sources, --file, --dir, --list, --get-notebook, --set-notebook, or --enqueue.")
        parser.print_help()
        return 0

    print(f"📡 Submitting {len(sources_to_ingest)} source(s) to '🧠 NotebookLM_Sync'...")
    payload = {"action": "ingest_notebooklm", "sources": sources_to_ingest}
    res = send_api_request(payload, args.url, args.token)

    if res.get("ok"):
        data = res.get("data", {})
        added = data.get("added", 0)
        updated = data.get("updated", 0)
        total = data.get("total", 0)
        print(f"\n🎉 Ingestion Succeeded!")
        print(f"  • Added: {added}")
        print(f"  • Updated: {updated}")
        print(f"  • Total Active Sources: {total}")
        for s in sources_to_ingest:
            print(f"    ✓ [{s['key']}] {s['title']}")
        return 0
    else:
        print(f"\n❌ Ingestion Failed: {res.get('error')}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
