# AI Context System - Feedback Log

**Version**: 5.0.0 (upgrade testing)
**Project**: Rex Kirshner Personal Website
**Upgrade Path**: 4.2.1 → 5.0.0 (major version)
**Testing Date**: 2026-01-14

---

## Purpose

This file captures bugs, issues, unclear instructions, and improvement suggestions during the v5.0.0 upgrade. Feedback goes directly to ACS developers.

---

## Feedback Entries

<!-- Add entries below in reverse chronological order -->

### 2026-01-14 - /review-context: Command Length is Overwhelming

**Severity:** MEDIUM (UX)

**What happened:** The `/review-context` command prompt is ~600 lines of markdown. While comprehensive, it's difficult for an AI to parse and execute perfectly. Many steps reference bash scripts that may not exist or have different behavior.

**Specific issues:**
1. Step 1.7 "Documentation Health Check" references `check_documentation_health` and `format_documentation_health` functions that don't exist in `scripts/common-functions.sh`
2. Step 0 loads `scripts/common-functions.sh` but the script may not have all referenced functions
3. The command mixes bash code blocks with prose instructions, making it unclear what's executable vs. descriptive

**Impact:** AI may skip steps or execute them incorrectly due to information overload.

**Suggestion:** Consider:
1. Splitting into smaller focused commands (e.g., `/review-staleness`, `/review-consistency`)
2. Or providing a "quick mode" vs "full mode" option
3. Or moving executable bash into actual scripts that the AI can just run

---

### 2026-01-14 - /review-context: Version Check Worked Well

**Severity:** N/A (Positive)

**What worked:** Step 1.5 version check correctly identified we're on v5.0.0 (latest) and skipped the update prompt. The curl command with fallback logic worked correctly.

**Output:**
```
Current version: 5.0.0
Latest version: 5.0.0
UP_TO_DATE|5.0.0
```

---

### 2026-01-14 - /review-context: Staleness Check is Useful

**Severity:** N/A (Positive)

**What worked:** The staleness analysis with color-coded output (green/yellow/red) is immediately useful. It correctly identified:
- Recent files as current (6-7 days)
- CONTEXT.md as "getting stale" (8 days)
- DEPLOYMENT.md as stale (105 days)

This gives actionable insight at a glance.

---

### 2026-01-14 - /review-context: Git Workflow Reminder is Redundant

**Severity:** LOW (UX)

**What happened:** Step 9 "Session Start: Git Workflow Reminder" provides a copy-paste prompt for git workflow rules. However, these rules are already in CLAUDE.md and were already stated in the user's initial prompt.

**Impact:** Unnecessary duplication. The prompt at the end feels like boilerplate.

**Suggestion:** Remove this section or make it conditional (only show if not already configured in .context-config.json or CLAUDE.md).

---

### 2026-01-14 - /review-context: Cross-Document Consistency Note Confusing

**Severity:** LOW (Clarity)

**What happened:** The consistency check notes that CONTEXT.md and STATUS.md have different "Last Updated" dates and adds:
```
Note: Different dates are normal. CONTEXT.md is static, STATUS.md is dynamic.
```

**Observation:** This is helpful, but the check itself then becomes somewhat pointless if different dates are "normal." It would be more useful to check if STATUS.md is newer than SESSIONS.md latest entry (actual inconsistency) rather than comparing static vs dynamic docs.

---

### 2026-01-14 - WORKAROUND: Manually Downloaded Missing v5.0.0 Components

**Severity:** N/A (Resolution)

**What we did:** After discovering the installer bug, we manually downloaded all missing v5.0.0 components from GitHub:

```bash
# 1. Create directories
mkdir -p .claude/agents .claude/schemas .claude/hooks
mkdir -p .claude/skills/export .claude/skills/init .claude/skills/review
mkdir -p .claude/skills/save-full .claude/skills/save .claude/skills/update .claude/skills/validate

# 2. Download agents (12 files)
cd .claude/agents
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/agents/accessibility-reviewer.md"
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/agents/audit-compare.md"
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/agents/code-reviewer.md"
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/agents/codebase-scanner.md"
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/agents/database-reviewer.md"
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/agents/infrastructure-reviewer.md"
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/agents/performance-reviewer.md"
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/agents/security-reviewer.md"
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/agents/seo-reviewer.md"
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/agents/synthesis-agent.md"
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/agents/test-coverage-reviewer.md"
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/agents/type-safety-reviewer.md"
cd ../..

# 3. Download schemas (7 files)
cd .claude/schemas
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/schemas/agent-contract.json"
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/schemas/audit-finding.json"
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/schemas/audit-report.json"
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/schemas/context-health.json"
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/schemas/handoff-package.json"
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/schemas/session-entry.json"
curl -sLO "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/schemas/settings.json"
cd ../..

# 4. Download skills (7 directories with SKILL.md each)
curl -sL "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/skills/export/SKILL.md" -o ".claude/skills/export/SKILL.md"
curl -sL "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/skills/init/SKILL.md" -o ".claude/skills/init/SKILL.md"
curl -sL "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/skills/review/SKILL.md" -o ".claude/skills/review/SKILL.md"
curl -sL "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/skills/save-full/SKILL.md" -o ".claude/skills/save-full/SKILL.md"
curl -sL "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/skills/save/SKILL.md" -o ".claude/skills/save/SKILL.md"
curl -sL "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/skills/update/SKILL.md" -o ".claude/skills/update/SKILL.md"
curl -sL "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/skills/validate/SKILL.md" -o ".claude/skills/validate/SKILL.md"

# 5. Download hooks (1 file)
curl -sL "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/.claude/hooks/session-start.sh" -o ".claude/hooks/session-start.sh"
```

**Verification:**
```
.claude/agents/    - 12 files (47KB total)
.claude/schemas/   - 7 files (18KB total)
.claude/skills/    - 7 directories with SKILL.md each
.claude/hooks/     - 1 file (session-start.sh)
```

**Result:** v5.0.0 is now complete. The new agent-based code review system should be functional.

**Note for ACS devs:** This workaround can serve as the template for fixing install.sh. Add download sections for these 4 directories.

---

### 2026-01-14 - CRITICAL: Installer Does Not Download v5.0.0 Agent System

**Severity:** CRITICAL (Blocker)

**What happened:** Upgraded from v4.2.1 to v5.0.0. The new `/code-review` command documentation describes an agent-based architecture with specialist reviewers in `.claude/agents/`, but the installer did not download any of these files.

**Expected behavior:** Installer should download all components of the v5.0.0 release, including:
- `.claude/agents/` (12 files: code-reviewer.md, codebase-scanner.md, security-reviewer.md, etc.)
- `.claude/schemas/` (7 files: audit-report.json, agent-contract.json, etc.)
- `.claude/skills/` (7 directories)
- `.claude/hooks/` (1 file: session-start.sh)

**Actual behavior:** Installer only downloads commands, templates, scripts, and config. The new directories exist on GitHub but are not included in the install.sh download list.

**Evidence:**
```bash
# GitHub shows these exist:
curl -sL "https://api.github.com/repos/rexkirshner/ai-context-system/contents/.claude/agents" | grep '"name"'
# Returns 12 agent files

# But local installation is missing:
ls .claude/agents/
# "No such file or directory"
```

**Impact:** The new code-review system is completely non-functional. Running `/code-review` will fail because it tries to invoke `code-reviewer` agent which doesn't exist.

**Fix required:** Update `install.sh` to include download sections for:
1. `.claude/agents/*.md`
2. `.claude/schemas/*.json`
3. `.claude/skills/` (recursive)
4. `.claude/hooks/*.sh`

---

### 2026-01-14 - HIGH: code-review.md Documents Non-Existent System

**Severity:** HIGH

**What happened:** The updated `.claude/commands/code-review.md` (v5.0.0) describes an elaborate agent-based system that doesn't exist on disk after installation.

**Documentation claims:**
- "This command invokes the `code-reviewer` agent"
- "Run codebase-scanner - Analyze project structure"
- "Discover specialist agents - Find all `*-reviewer.md` files in `.claude/agents/`"
- Lists 8 specialist agents with applicability rules

**Reality:** None of these files exist. The old v4.2.1 code-review.md (preserved in backup) was a functional orchestrator that called existing `/code-review-*` commands. The new v5.0.0 version references a completely different architecture that wasn't installed.

**Suggestion:** Either:
1. Fix installer to download agents (preferred)
2. Or revert code-review.md to v4.2.1 version until agents are properly distributed

---

### 2026-01-14 - MEDIUM: ACS_UPDATING Notice Still Appears During Update

**Severity:** MEDIUM

**What happened:** The /update-context-system command instructions say to set `export ACS_UPDATING=true` to suppress update notices. However, the notice still appeared.

**Root cause:** The instructions have wrong order of operations:
```bash
# Step 0 in update-context-system.md says:
source scripts/common-functions.sh  # <-- Notice displays HERE during source
export ACS_UPDATING=true            # <-- Too late, already displayed
```

**Expected:** Export should happen BEFORE sourcing, or common-functions.sh should check at display time, not source time.

**Actual output:**
```
✅ Loaded common-functions.sh
✅ Set ACS_UPDATING=true

💡 Update available: v4.2.1 → v5.0.0
   Run /update-context-system to upgrade
```

**Fix suggestion:** Either:
1. Change instruction order: `export ACS_UPDATING=true` BEFORE `source common-functions.sh`
2. Or modify common-functions.sh to defer notice until first command execution (lazy check)

---

### 2026-01-14 - MEDIUM: No "What's New in v5.0.0" Summary

**Severity:** MEDIUM (UX)

**What happened:** After upgrade completes, there's no summary of what changed in v5.0.0. User sees generic completion message but has no idea what's new or different.

**Expected:** Major version upgrades should highlight key changes:
```
What's New in v5.0.0:
- Agent-based code review architecture (8 specialist reviewers)
- Structured JSON schemas for audit reports
- Skills system for modular commands
- Session hooks for automation
```

**Actual:** Generic message with link to changelog (which may or may not be updated).

**Suggestion:** Add version-specific release notes to installer output for major version bumps.

---

### 2026-01-14 - LOW: Installer Verification Incomplete

**Severity:** LOW

**What happened:** The installer's "Verifying installation..." step checks for these files:
- VERSION
- scripts/common-functions.sh
- .claude/commands/init-context.md, save.md, save-full.md, code-review.md
- templates/*.template.md
- scripts/*.sh

**Missing checks:** Does not verify:
- .claude/agents/ directory (critical for v5.0.0)
- .claude/schemas/ directory
- .claude/skills/ directory
- .claude/hooks/ directory

**Suggestion:** Add verification for all v5.0.0 components so installer fails clearly if download is incomplete.

---

### 2026-01-14 - LOW: Accumulating Backup Directories

**Severity:** LOW (Housekeeping)

**What happened:** Each upgrade creates a `.claude-backup-TIMESTAMP/` directory. After several upgrades:
```
.claude-backup-20260108-081639/
.claude-backup-20260108-155327/
.claude-backup-20260114-075356/
```

**Observation:** No guidance on when/if to clean these up. They accumulate indefinitely.

**Suggestion:** Either:
1. Add cleanup guidance after successful upgrade: "Previous backups can be removed: rm -rf .claude-backup-*"
2. Or auto-cleanup backups older than N days (with warning)
3. Or add to .gitignore if not already (they are gitignored, but this should be explicit)

---

### 2026-01-14 - INFO: Feedback File Handling Worked Correctly

**Severity:** N/A (Positive observation)

**What happened:** We pre-created a fresh `context/context-feedback.md` before upgrade. The installer's Step 2.5 feedback handling:
1. Checked for user entries matching `## YYYY-MM-DD` pattern
2. Found none (our file had no entries yet)
3. Did NOT overwrite our file with template

**Result:** Our pre-created file was preserved, which is the correct behavior. The logic properly distinguishes between "empty template" and "user-created file with no entries yet."

---

### 2026-01-14 - INFO: Version Sync Auto-Fix Worked

**Severity:** N/A (Positive observation)

**What happened:** Installer detected version mismatch between VERSION file (5.0.0) and context/.context-config.json (4.2.1) and auto-fixed it:
```
⚠️  Version mismatch detected (VERSION=5.0.0, config=4.2.1)
✅ Fixed version sync
```

**Result:** Both files now show 5.0.0. Good automated handling.

---

### 2026-01-14 - SUMMARY: v5.0.0 Upgrade Assessment

**Overall:** FIXED - Critical components manually downloaded

**What the installer did correctly:**
- Basic file downloads (commands, templates, scripts)
- Version sync
- Backup creation
- Feedback file preservation

**What the installer missed (we fixed manually):**
- `.claude/agents/` - 12 specialist reviewer agents
- `.claude/schemas/` - 7 JSON schemas for structured data
- `.claude/skills/` - 7 skill directories
- `.claude/hooks/` - 1 session hook script

**Current status:** v5.0.0 is now COMPLETE after manual intervention. The new agent-based code review system should be functional.

**Recommendation for ACS devs:** Update install.sh to download the missing directories. The workaround entry above provides the exact curl commands needed.

**Environment:**
- OS: macOS Darwin 24.6.0
- Claude Code: Opus 4.5
- Project: Personal website (Astro static site)
- Upgrade path: 4.2.1 → 5.0.0

