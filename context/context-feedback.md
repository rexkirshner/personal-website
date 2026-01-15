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

### 2026-01-14 - /update-context-system: validate-context.sh Partial Fix - Still Has Old Command Name

**Severity:** MEDIUM (Partial fix)

**What happened:** The v5.0.0 bug where `scripts/validate-context.sh` checked for old command names was PARTIALLY fixed:
- Line 303: `save-context.md` → `save.md` (FIXED)
- Line 326: Still checks for `quick-save-context.md` which doesn't exist in v5.x

```bash
$ grep -n "quick-save" scripts/validate-context.sh
326:  ".claude/commands/quick-save-context.md"
```

**Impact:** Validation will still produce false positive error for missing `quick-save-context.md`.

**Fix required:** Remove or update line 326 to check for a valid v5.x command name.

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

