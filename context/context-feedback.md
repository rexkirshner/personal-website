# AI Context System - Feedback Log

**Version**: 5.0.1 (update testing from 5.0.0)
**Project**: Rex Kirshner Personal Website
**Testing Date**: 2026-01-14

---

## Purpose

This file captures bugs, issues, unclear instructions, and improvement suggestions during QA testing. Feedback goes directly to ACS developers.

---

## Feedback Entries

<!-- Add entries below in reverse chronological order -->

### 2026-01-14 - /update-context-system: CRITICAL Bug Fixed - Installer Now Downloads All Components

**Severity:** N/A (Positive - Bug Fix Verified)

**What worked:** The v5.0.0 CRITICAL bug where installer was missing agents/, schemas/, skills/, and hooks/ directories has been FIXED in v5.0.1. The installer now successfully downloads all components:
- 12 agents in `.claude/agents/`
- 7 schemas in `.claude/schemas/`
- 7 skills in `.claude/skills/`
- 1 hook in `.claude/hooks/`

**Why this matters:** This was the most critical bug in v5.0.0. Users no longer need manual workarounds.

---

### 2026-01-14 - /update-context-system: CRITICAL Bug Fixed - awk macOS Compatibility

**Severity:** N/A (Positive - Bug Fix Verified)

**What worked:** The v5.0.0 CRITICAL bug in `scripts/export-sessions-json.sh` where GNU awk syntax was used has been FIXED. The script now uses POSIX-compatible awk:

Before (broken on macOS):
```awk
match($0, /Session ([0-9]+)/, session_num)  # GNU extension
```

After (works everywhere):
```awk
if (match($0, /Session [0-9]+/)) {
  temp = substr($0, RSTART, RLENGTH)  # POSIX-compatible
  ...
}
```

**Why this matters:** JSON export now works on macOS (BSD awk) and Linux (GNU awk).

---

### 2026-01-14 - /update-context-system: validate-context.sh Correctly Checks for Obsolete Commands

**Severity:** N/A (Correction of earlier misunderstanding)

**What happened:** Earlier entry incorrectly reported that line 326's `quick-save-context.md` was a bug. Upon closer inspection, this is actually **correct behavior** - the script checks for OBSOLETE commands that should NOT exist:

```bash
# Check for obsolete commands (should NOT exist in v1.8.0)
OBSOLETE_COMMANDS=(
  ".claude/commands/init-context-full.md"
  ".claude/commands/quick-save-context.md"  # <-- This is correct!
)

for cmd in "${OBSOLETE_COMMANDS[@]}"; do
  if [ -f "$BASE_DIR/$cmd" ]; then
    echo "⚠️  OBSOLETE command found: $cmd (should be removed)"
    ((WARNINGS++))
  fi
done
```

This warns users who upgraded from older versions but still have obsolete command files lingering.

**Apologies for the confusion in the earlier entry.**

---

### 2026-01-14 - /update-context-system: Version Mismatch Auto-Fix Works Well

**Severity:** N/A (Positive)

**What worked:** The installer detected that VERSION file (5.0.1) didn't match context/.context-config.json (5.0.0) and automatically fixed it:
```
⚠️  Version mismatch detected (VERSION=5.0.1, config=5.0.0)
✅ Fixed version sync
```

**Why this matters:** Prevents confusing version inconsistencies.

---

### 2026-01-14 - /update-context-system: Confusing "Next Steps" Message During Updates

**Severity:** LOW (UX)

**What happened:** After the installer completes during an UPDATE (not fresh install), it shows:
```
Next steps:
   1. Run /init-context to initialize your project
   ...
```

This is confusing because we're updating an already-initialized project, not initializing a new one.

**Expected behavior:** Installer should detect update vs fresh install and show appropriate next steps:
- Fresh install: "Run /init-context to initialize your project"
- Update: "Your project is updated. Review CHANGELOG for new features."

---

### 2026-01-14 - /update-context-system: ACS_UPDATING Export Won't Persist Across Bash Calls

**Severity:** LOW (Technical design)

**What happened:** Step 0 of the command sets `export ACS_UPDATING=true` to suppress update notices during the update. However, since each Bash tool call is a separate shell process, this environment variable won't persist to later steps.

```bash
# Step 0
export ACS_UPDATING=true  # Set in shell 1

# Step 1 (different shell process)
# ACS_UPDATING is not set here
```

**Impact:** If any later step checks this variable, it won't be set. Currently doesn't cause issues because nothing checks it, but the design is incorrect.

**Suggestion:** Either:
1. Source common-functions.sh in each step and set the variable there
2. Use a temp file flag instead: `touch /tmp/.acs_updating`
3. Remove this if nothing actually checks it

---

### 2026-01-14 - /update-context-system: Backup Creation Works Well

**Severity:** N/A (Positive)

**What worked:** The installer creates timestamped backups before updating:
```
📦 Backing up existing installation...
   ✅ Backup created: .claude-backup-20260114-165458
```

**Why this matters:** Safe rollback path if anything goes wrong.

---

### 2026-01-14 - /update-context-system: Verification Step is Thorough

**Severity:** N/A (Positive)

**What worked:** The installer verifies 21 critical files after download:
- VERSION, scripts, commands, templates, agents, schemas, skills, hooks

This catches incomplete installations early.

---

### 2026-01-14 - /update-context-system: Command File Still Shows v5.0.0

**Severity:** LOW (Outdated metadata)

**What happened:** The `/update-context-system` command file ends with:
```
**Version:** 5.0.0
```

But we just updated TO v5.0.1. The command file's version should be updated to match.

**Impact:** Minor confusion - command says 5.0.0 but system is 5.0.1.

---

### 2026-01-14 - /validate-context: FIXED - quick-save-context.md False Positive Gone

**Severity:** N/A (Positive - Bug Fix Verified)

**What worked:** The v5.0.0 bug where validate-context.sh checked for old command name `quick-save-context.md` has been FIXED in v5.0.1. The script now correctly checks for v5.x command names only.

**Evidence:** Ran /validate-context - no false positive error about missing quick-save-context.md.

---

### 2026-01-14 - /validate-context: BUG - Exit Code 0 Despite Errors

**Severity:** MEDIUM (Incorrect behavior)

**What happened:** The validation script reported "1 error(s) found" but exited with code 0:
```
❌ 1 error(s) found

Please fix errors before proceeding.
...
Exit code: 0
```

**Expected behavior:** Should exit with code 2 when errors are found (as documented in the command file).

**Impact:** Automated scripts that check exit codes won't detect validation failures.

**Root cause:** The script increments error counter but doesn't use it to set exit code at the end.

---

### 2026-01-14 - /validate-context: New v5.0.0 Components Check is Helpful

**Severity:** N/A (Positive)

**What worked:** The validation script now checks for v5.0.0 components:
```
🏗️  Checking v5.0.0 components...
  ✅ .claude/agents (12 agent files)
  ✅ .claude/schemas (7 schema files)
  ✅ .claude/skills (7 skill directories)
  ✅ .claude/hooks (1 hook files)
```

**Why this matters:** Catches incomplete installations where agents/schemas/skills/hooks are missing.

---

### 2026-01-14 - /validate-context: Git Push Protocol Example Has Hardcoded Session Number

**Severity:** LOW (Documentation issue)

**What happened:** Step 2.5 in the command file has bash code that checks "Session 18" which is hardcoded:
```bash
if grep -A 10 "^## Session 18" context/SESSIONS.md | grep -q "Pushed: YES"; then
```

The AI must manually adapt this to check actual session numbers, but the example doesn't make this clear.

**Suggestion:** Either:
1. Add comment "# Replace 18 with actual session numbers"
2. Or provide a loop example that dynamically finds last 3 sessions

---

### 2026-01-14 - /export-context: CRITICAL BUG - export-sessions-json.sh Produces Invalid JSON

**Severity:** CRITICAL (Data corruption)

**What happened:** Running `./scripts/export-sessions-json.sh` produces invalid JSON with multiple issues:

1. **Session count wrong:** Script uses `grep -c "^## Session"` which incorrectly counts:
   - "## Session Index" (header section)
   - "## Session Template" (documentation section)
   - Template example `## Session [N] | ...`

   Result: Reports 8 sessions when only 5 actual sessions exist (0-4).

2. **Code block not skipped:** The awk parser doesn't skip content inside markdown code blocks (` ``` `). When SESSIONS.md contains a template example:
   ```markdown
   ## Session Template

   ```markdown
   ## Session [N] | [YYYY-MM-DD] | [Phase Name]

   **Duration:** [X]h | **Focus:** [Brief] | **Status:** Complete/In Progress
   ```
   ```

   The `**Duration:**` line inside the code block gets parsed and appended to the previous session's JSON, producing:
   ```json
   {
     "sessionNumber": 2,
     "status": "Complete"
     "duration": "[X]h",        // <-- garbage from template
     "focus": "[Brief]",         // <-- garbage from template
     "status": "Complete/In Progress"  // <-- duplicate key!
   }
   ```

3. **Date format mismatch:** Session 0 has date `2024-10` but regex requires `[0-9]{4}-[0-9]{2}-[0-9]{2}`. Session 0 is completely skipped from output.

**Evidence:**
```bash
$ ./scripts/export-sessions-json.sh
❌ Invalid JSON generated
   File: context/.sessions-data.json

$ jq . context/.sessions-data.json
parse error: Expected ',' or '}' at line 25, column 5
```

**Root causes in `scripts/export-sessions-json.sh`:**

1. Line 48 - Wrong session count regex:
   ```bash
   TOTAL_SESSIONS=$(grep -c "^## Session" ...)  # Counts all "## Session" lines
   # Should be:
   TOTAL_SESSIONS=$(grep -c "^## Session [0-9]" ...)  # Only actual sessions
   ```

2. Awk script (lines 87-178) - No code block detection:
   - Needs to track state: `in_code_block = 0/1`
   - Skip all pattern matching when inside code block
   - Toggle on lines starting with ` ``` `

3. Awk script date regex (line 94) - Too strict:
   ```awk
   /^## Session [0-9]+ \| [0-9]{4}-[0-9]{2}-[0-9]{2}/  # Requires full YYYY-MM-DD
   # Should allow YYYY-MM or YYYY-MM-DD:
   /^## Session [0-9]+ \| [0-9]{4}-[0-9]{2}/
   ```

**Impact:** /export-context command fails completely. JSON export is unusable for multi-agent workflows.

---

### 2026-01-14 - /export-context: Session Count Fix is Simple

**Severity:** N/A (Suggested fix)

**Simple fix for session count:**
```bash
# Before (line 48)
TOTAL_SESSIONS=$(grep -c "^## Session" "$CONTEXT_DIR/SESSIONS.md" 2>/dev/null || echo "0")

# After
TOTAL_SESSIONS=$(grep -c "^## Session [0-9]" "$CONTEXT_DIR/SESSIONS.md" 2>/dev/null || echo "0")
```

This single character change (`[0-9]`) filters out "Session Index", "Session Template", and example headers.

---

