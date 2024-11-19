"""
Generate a JSON representation of the current project's directory structure.
Excludes common development-related directories and files like .git, node_modules,
cache directories, and build artifacts.
"""
import os
import json
from pathlib import Path

def should_ignore(name):
    """Check if a file or directory should be ignored."""
    ignore_patterns = {
        # Directories
        '.git', '__pycache__', 'node_modules', 'dist', 'build',
        'venv', 'env', '.env', '.venv', 'target',
        # Files
        '.DS_Store', '*.pyc', '*.pyo', '*.pyd', '.Python',
        '*.so', '*.egg', '*.egg-info', '*.coverage',
        # Cache directories
        '.pytest_cache', '.mypy_cache', '.ruff_cache', '.coverage',
        # IDE directories
        '.idea', '.vscode', '.vs', '*.swp', '*.swo'
    }

    return any(
        name == pattern or
        (pattern.startswith('*.') and name.endswith(pattern[1:])) or
        name.startswith('.')
        for pattern in ignore_patterns
    )

def scan_directory(path):
    """Recursively scan directory and return structure as dictionary."""
    if isinstance(path, str):
        path = Path(path)

    result = {}

    try:
        for item in path.iterdir():
            if should_ignore(item.name):
                continue

            if item.is_file():
                result[item.name] = None
            elif item.is_dir():
                subdir = scan_directory(item)
                if subdir:  # Only add non-empty directories
                    result[item.name] = subdir
    except PermissionError:
        return None

    return result

def generate_structure(directory='.'):
    """Generate project structure as JSON."""
    structure = {os.path.basename(os.path.abspath(directory)): scan_directory(directory)}
    return json.dumps(structure, indent=2)

if __name__ == '__main__':
    print(generate_structure())
