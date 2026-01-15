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

### 2026-01-15 - /code-review: Skill Loads Instructions But Doesn't Execute

**Severity:** MEDIUM (UX/Design issue)

**What happened:** When running `/code-review`, the skill system loads the command instructions into context, but doesn't actually:
1. Run the codebase scanner
2. Discover agents
3. Execute the review
4. Generate reports

The AI must manually interpret and execute all steps. This is different from a traditional CLI command that would execute automatically.

**Expected behavior:** Either:
1. The skill should auto-execute (preferred for CLI-like commands)
2. OR the documentation should clearly state "This loads instructions - you must follow them manually"

**Impact:** Confusing user experience. User types `/code-review` expecting a code review, but nothing happens until AI interprets the instructions.

**Suggestion:** Add prominent note at top of skill: "This skill loads instructions. The AI will now execute these steps..."

---

### 2026-01-15 - /code-review: Codebase Scanner Cache Stale Detection Works

**Severity:** N/A (Positive)

**What worked:** The cache validity check correctly identified that:
- Cached commit `5c5b347...` didn't match current HEAD `8b8b3f5...`
- Uncommitted changes existed

This means the scanner knows when to rescan.

---

### 2026-01-15 - /code-review: Codebase Scanner Cache Has Incomplete Data

**Severity:** MEDIUM (Data quality)

**What happened:** The cached `codebase-context.json` had issues:

1. **linesScanned: 0** - All files showed 0 lines, which defeats the purpose of complexity analysis

2. **securityRelevant: []** - Empty array, but project has `scripts/*.js` with credential handling

3. **filesScanned: 13** - But `git ls-files` shows 57 scannable files

**Evidence:**
```json
{
  "metadata": { "filesScanned": 13, "linesScanned": 0 },
  "securityRelevant": [],
  "files": [{ "path": "src/components/...", "lines": 0, "complexity": "low" }]
}
```

**Impact:** Specialist agents may miss files or make incorrect complexity assessments.

**Root cause:** The scanner was likely run with incomplete implementation or the cache was manually created.

---

### 2026-01-15 - /code-review: Security Relevant File Detection Too Narrow

**Severity:** LOW (Pattern improvement)

**What happened:** The `securityRelevant` file list detection patterns don't catch:
- `scripts/*.js` - Contains R2 credential handling, file uploads
- `astro.config.mjs` - May contain security-relevant config

Current patterns focus on: `*auth*`, `*login*`, `*session*`, `*token*`, etc.

**Suggestion:** Add patterns:
- `scripts/*` (any script that handles data)
- `*.config.*` (configuration files)
- `*upload*`, `*download*` (file operations)

---

### 2026-01-15 - /code-review: Agent Discovery Works Correctly

**Severity:** N/A (Positive)

**What worked:** Agent discovery correctly:
- Found all 8 specialist agents
- Extracted JSON contracts from `## Agent Contract` sections
- Parsed id, prefix, and applicability.always fields
- Correctly identified that `code-reviewer.md` (orchestrator) has no contract

**Evidence:**
```
✅ accessibility-reviewer - ID: accessibility | Prefix: A11Y | Always: false
✅ security-reviewer - ID: security | Prefix: SEC | Always: true
...
```

---

### 2026-01-15 - /code-review: Security Agent Produces High-Quality Findings

**Severity:** N/A (Positive)

**What worked:** The security reviewer agent:
- Found 14 real issues (not just pattern matches)
- Correctly noted mitigation status for each finding
- Properly categorized severity levels
- Provided specific line numbers and code snippets
- Included remediation suggestions

The agent correctly found issues we hadn't addressed:
- PhotoGallery.astro innerHTML (line 363)
- ExpansionLightbox.astro SVG innerHTML (line 207)
- Missing CSP headers
- External CDN without SRI

---

### 2026-01-15 - /code-review: No Automated Report Generation

**Severity:** MEDIUM (Missing feature)

**What happened:** After the security agent completed its review, there was no automated:
1. Synthesis step (deduplication, grading)
2. Report file generation (`docs/audits/audit-NN.{md,json}`)
3. Summary display

The orchestrator documentation describes these steps, but they must be manually executed.

**Expected behavior:** The orchestrator should automatically:
1. Collect findings from all specialists
2. Run synthesis-agent
3. Generate and save report files
4. Display summary

**Impact:** User must manually interpret agent output and create reports.

---

### 2026-01-15 - /code-review: Agent Selection Logic Not Tested

**Severity:** LOW (Untested feature)

**What happened:** Due to manual execution, the auto-selection logic wasn't fully tested:
- Should select based on `applicability.always` and `requires` conditions
- Should match scanner output against conditions like `structure.hasUI: true`
- Should handle presets like `--prelaunch`, `--frontend`, etc.

The documentation describes the logic well, but there's no validation that it works correctly in practice.

**Suggestion:** Add a dry-run mode: `/code-review --dry-run` that shows which agents WOULD be selected without running them.

---

### 2026-01-15 - /code-review: Parallel Execution Not Demonstrated

**Severity:** LOW (Performance concern)

**What happened:** The orchestrator documentation says specialists should run in parallel using multiple Task tool calls. In manual execution, only one agent was run.

**Expected behavior:** For a full review, all selected agents should be launched simultaneously:
```
Task(security-reviewer) ─┬─→ SEC findings
Task(testing-reviewer)  ─┤
Task(seo-reviewer)      ─┤
Task(a11y-reviewer)     ─┴─→ All findings
```

**Impact:** Sequential execution would be much slower for full reviews.

**Suggestion:** Document the expected parallel execution pattern more explicitly.

---

