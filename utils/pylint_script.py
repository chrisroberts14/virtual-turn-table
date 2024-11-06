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
        cmd = (".venv/bin/pylint", *sys.argv[1:])
    return subprocess.call(cmd)


if __name__ == "__main__":
    sys.exit(main())
