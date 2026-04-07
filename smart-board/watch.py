#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Smart Board - Auto File Watcher & Verification

Watches project files for changes and automatically runs verification.
Useful for continuous development with real-time checks.

Usage:
    python3 watch.py

Watches:
    - src/ folder (code changes)
    - docs/ folder (documentation)
    - *.cjs files (backend changes)
    - *.json files (config changes)
"""

import os
import sys
import subprocess
import time
from pathlib import Path
from datetime import datetime

try:
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler
except ImportError:
    print("[ERROR] watchdog module not installed")
    print("Install with: pip install watchdog")
    sys.exit(1)


class VerificationHandler(FileSystemEventHandler):
    """Handle file changes and run verification"""

    def __init__(self):
        self.last_run = 0
        self.cooldown = 3  # Seconds between verification runs

    def on_modified(self, event):
        """Run on file modification"""
        if event.is_directory:
            return

        # Check if file should trigger verification
        if self._should_verify(event.src_path):
            self._run_verification()

    def on_created(self, event):
        """Run on file creation"""
        if event.is_directory:
            return

        if self._should_verify(event.src_path):
            self._run_verification()

    def _should_verify(self, file_path):
        """Check if file change should trigger verification"""
        file_path = file_path.lower()

        # Extensions to watch
        watched_extensions = {'.tsx', '.ts', '.cjs', '.md', '.json'}

        # Ignore patterns
        ignore_patterns = {'node_modules', '.git', '.vite', '__pycache__'}

        # Check if file should be watched
        if any(pattern in file_path for pattern in ignore_patterns):
            return False

        if any(file_path.endswith(ext) for ext in watched_extensions):
            return True

        return False

    def _run_verification(self):
        """Run verification with cooldown"""
        now = time.time()

        # Cooldown check - prevent too frequent runs
        if now - self.last_run < self.cooldown:
            return

        self.last_run = now

        print("")
        print("=" * 80)
        print(f"[WATCH] File change detected - Running verification ({datetime.now().strftime('%H:%M:%S')})")
        print("=" * 80)
        print("")

        # Run verification script
        try:
            result = subprocess.run(
                [sys.executable, "verify.py"],
                cwd=os.path.dirname(os.path.abspath(__file__))
            )

            if result.returncode == 0:
                print("")
                print("[WATCH] ✅ Verification passed - Ready to commit")
                print("")
            else:
                print("")
                print("[WATCH] ❌ Verification failed - Fix errors above")
                print("")
        except Exception as e:
            print(f"[WATCH] Error running verification: {e}")


def main():
    """Start file watcher"""
    print("")
    print("=" * 80)
    print("[WATCH] Smart Board - Auto File Watcher & Verification")
    print("=" * 80)
    print("")
    print("[WATCH] Monitoring for changes in:")
    print("  - src/ (source code)")
    print("  - docs/ (documentation)")
    print("  - *.cjs files (backend)")
    print("  - *.md files (docs)")
    print("  - *.json files (config)")
    print("")
    print("[WATCH] Press Ctrl+C to stop")
    print("")

    # Get project root
    project_root = os.path.dirname(os.path.abspath(__file__))

    # Create observer
    event_handler = VerificationHandler()
    observer = Observer()

    # Watch directories
    watch_dirs = [
        os.path.join(project_root, "src"),
        os.path.join(project_root, "docs"),
        project_root,  # Root for *.cjs, *.md, *.json
    ]

    for watch_dir in watch_dirs:
        if os.path.exists(watch_dir):
            observer.schedule(event_handler, watch_dir, recursive=True)
            print(f"[WATCH] Watching: {watch_dir}")

    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("")
        print("[WATCH] Stopped")
        print("")

    observer.join()


if __name__ == "__main__":
    main()
