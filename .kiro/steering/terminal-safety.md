# Terminal Safety Rules

## No inline scripts

NEVER run large blocks of inline Python, Node, or any other interpreter via `python -c`, `node -e`, or `bash -c` with multi-line content. This breaks the user's terminal.

ALWAYS write the code to a temporary file first, then execute that file. No exceptions.

### Bad (forbidden)
```bash
python -c "
import json
# ... many lines ...
print(result)
"
```

### Good (required)
```bash
# Write to a temp file, then run it
# Use fs_write to create /tmp/script.py, then:
python /tmp/script.py
```

This rule applies regardless of script length. Even short multi-line scripts should use a file.
