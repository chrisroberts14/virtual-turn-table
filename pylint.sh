#!/bin/bash

SCRIPT_DIR="$(dirname "$0")"

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # On Linux
    "$SCRIPT_DIR/.venv/bin/pylint" "$@"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # On Windows (Git Bash or Cygwin)
    "$SCRIPT_DIR/.venv/Scripts/pylint.exe" "$@"
else
    echo "Unsupported OS: $OSTYPE"
    exit 1
fi
