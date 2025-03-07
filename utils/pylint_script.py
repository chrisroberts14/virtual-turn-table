#!/usr/bin/env python3
"""Pylint script for cross-platform development."""

import subprocess
import sys


def main():
    """
    Run pylint.

    :return:
    """
    if sys.platform == "win32":
        cmd = (r".venv\Scripts\pylint.exe", *sys.argv[1:])
    else:
        # Add the path to the vtt file to the path
        sys.path.append("~/Desktop/TYP/virtual-turn-table")
        cmd = (".venv/bin/pylint", *sys.argv[1:])
    return subprocess.call(cmd)


if __name__ == "__main__":
    sys.exit(main())
