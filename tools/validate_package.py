"""Compatibility entrypoint. Current validation is dependency-free Node.js."""
from pathlib import Path
import subprocess
import sys

if __name__ == "__main__":
    try:
        result = subprocess.run(["node", str(Path(__file__).with_suffix(".mjs"))])
        sys.exit(result.returncode)
    except FileNotFoundError:
        print("Node.js 22+ is required for package validation.", file=sys.stderr)
        sys.exit(1)
