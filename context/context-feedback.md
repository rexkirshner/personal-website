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

### 2026-01-14 - /save: Skill Is Appropriately Minimal

**Severity:** N/A (Positive)

**What worked:** The /save skill does exactly what it should - updates only STATUS.md. The clear guardrails about NOT modifying SESSIONS.md, DECISIONS.md, or CONTEXT.md are helpful.

**Why this matters:** Quick session saves should be fast and low-friction. This skill achieves that goal.

---

### 2026-01-14 - /save: Good Resume Point Format Guidance

**Severity:** N/A (Positive)

**What worked:** The requirement for resume points to "Start with action verb" and "Include location" is excellent guidance. Examples like `Continue implementing auth middleware in src/middleware/auth.ts` vs. bad example `Work on auth` make expectations clear.

**Why this matters:** Specific resume points enable seamless session continuity.

---

### 2026-01-14 - /save: Template Expects Non-Existent Markers

**Severity:** MEDIUM (Template mismatch)

**What happened:** The skill template says to "Replace content between markers" with `<!-- BEGIN AUTO:QUICK_REFERENCE -->` and `<!-- END AUTO:QUICK_REFERENCE -->` markers. However, the actual STATUS.md file created by /init-context does NOT have these markers.

**Expected behavior:** Either:
1. /init-context should create STATUS.md with these markers, OR
2. /save skill should not reference markers that don't exist

**Workaround:** Ignored the markers and updated the Quick Reference section directly.

**Suggestion:** Add these markers to STATUS.md template or remove marker references from /save skill.

---

### 2026-01-14 - /save: Quick Reference Format Mismatch

**Severity:** LOW (Minor inconsistency)

**What happened:** The skill shows a minimal Quick Reference format:
```markdown
**Project:** [name] | **Phase:** [phase] | **Health:** --/100
**Focus:** [current focus - max 60 chars]
**Resume:** [resume point with verb + location]
```

But the actual STATUS.md has a much more expanded format with URLs, Tech Stack, Commands section, Documentation Health breakdown, etc.

**Impact:** Not clear whether /save should compress to the minimal format or preserve the expanded format. I preserved the expanded format.

**Suggestion:** Either update the skill to match reality OR provide guidance on when to use minimal vs. expanded format.

---

### 2026-01-14 - /save: Health Score Not Implemented

**Severity:** LOW (Feature gap)

**What happened:** The skill template shows `**Health:** --/100` but there's no implementation for calculating or displaying a health score in STATUS.md.

**Current state:** STATUS.md uses "Documentation Health: 🟢 Excellent" with qualitative indicators, not a numeric score.

**Suggestion:** Either implement the numeric health score or remove from template.

---

### 2026-01-14 - /validate-context: CRITICAL - Script Has Outdated Command Names

**Severity:** CRITICAL (False positive error)

**What happened:** The validation script `scripts/validate-context.sh` (reports v3.6.0) checks for old command names:
```
Looking for: save-context.md
Actually exists: save.md

Looking for: quick-save-context.md
Does not exist in v5.0.0
```

**Impact:** Script reports 1 error and exits with code 2, even though all files are correctly present. This is a FALSE POSITIVE that will confuse users.

**Root cause:** The installer updated `.claude/commands/` to v5.0.0 names but didn't update `scripts/validate-context.sh` to match.

**Fix required:** Update `scripts/validate-context.sh` line ~67 to check for new command names:
- `save-context.md` → `save.md`
- `quick-save-context.md` → (remove, doesn't exist in v5.0.0)

---

### 2026-01-14 - /validate-context: Script Has Executable Implementation

**Severity:** N/A (Positive)

**What worked:** Unlike /code-review which is pure specification, /validate-context has an actual executable script (`scripts/validate-context.sh`). This is much better because:
- Consistent execution across sessions
- No AI interpretation variance
- Faster execution
- Reliable exit codes

This is the RIGHT pattern. Other commands should follow this model.

---

### 2026-01-14 - /validate-context: Command Instructions Are Mostly Redundant

**Severity:** MEDIUM (Bloat)

**What happened:** The `/validate-context` command file is ~400 lines, but Step 1 just says "run `./scripts/validate-context.sh`". Steps 2.5, 2.7, 2.8 provide detailed bash code that partially duplicates what the script already does.

**Impact:**
- AI might execute both the script AND the inline bash, doing redundant work
- Inconsistency between script logic and inline bash
- Harder to maintain (two places to update)

**Suggestion:** Simplify command to:
1. Run `./scripts/validate-context.sh`
2. Interpret exit code
3. Display summary
4. Provide recommendations

Remove the inline bash that duplicates script functionality. If additional checks are needed, add them to the script.

---

### 2026-01-14 - /validate-context: Git Push Protocol Audit is Manual

**Severity:** LOW (Implementation gap)

**What happened:** Step 2.5 "Git Push Protocol Validation" has inline bash code but this isn't in the actual script. The script doesn't check git push compliance.

**Impact:** The audit only runs if AI executes the inline bash manually. Inconsistent with "just run the script" philosophy.

**Suggestion:** Either:
1. Add git protocol audit to `validate-context.sh`, OR
2. Remove from command instructions (it's already checked during /review-context)

---

### 2026-01-14 - /validate-context: Staleness Check Works Well

**Severity:** N/A (Positive)

**What worked:** The staleness check with configurable thresholds from `.context-config.json` is useful. Color-coded output (green/yellow/red) is immediately clear. Thresholds for different file types makes sense (STATUS.md needs frequent updates, CONTEXT.md doesn't).

---

### 2026-01-14 - /validate-context: Organization Check is Helpful

**Severity:** N/A (Positive)

**What worked:** The file organization check (Step 2.8) that looks for loose files in root and documentation in src/ is a good quality check. The 100-point scoring system gives clear feedback.

---

### 2026-01-14 - /save-full: Successfully Created Session Entry

**Severity:** N/A (Positive)

**What happened:** Successfully executed /save-full to create Session 4 entry in SESSIONS.md and update STATUS.md. The skill instructions were clear and concise.

**Result:** Session 4 documented with TL;DR, accomplishments, files, mental models, and next steps.

---

### 2026-01-14 - /save-full: Skill is Much Leaner Than Existing Sessions

**Severity:** MEDIUM (Inconsistency)

**What happened:** The /save-full skill template shows a minimal structure:
- TL;DR, Accomplishments, Decisions, Files Changed, Mental Models, Next Steps, Git

But existing sessions in SESSIONS.md have many more sections:
- TL;DR, Accomplishments, Problem Solved, Decisions, Files (NEW/MOD/DEL format), Mental Models, Gotchas discovered, Work In Progress, TodoWrite State, Next Session, Git Operations, Tests & Build

**Impact:** Following the skill template produces entries that look different from existing sessions. I followed existing session format for consistency.

**Suggestion:** Either:
1. Update skill template to match actual expected format, OR
2. Simplify existing sessions to match template, OR
3. Document that template is minimal and users can expand

---

### 2026-01-14 - /save-full: BEGIN/END Markers Not Used in Practice

**Severity:** LOW (Documentation mismatch)

**What happened:** The skill output format shows:
```
<!-- BEGIN SESSION [N] -->
...
<!-- END SESSION [N] -->
```

But examining SESSIONS.md, no existing sessions use these markers. Sessions are delimited by `---` separators.

**Impact:** Minor - I followed existing format without markers.

**Suggestion:** Remove markers from template OR add them to existing sessions.

---

### 2026-01-14 - /save-full: No Details on Quick Reference Update

**Severity:** MEDIUM (Incomplete instructions)

**What happened:** Step 6 says "Update Quick Reference" and "Also update STATUS.md Quick Reference block (same as /save)."

But the skill doesn't specify:
- Which fields to update in Quick Reference
- How to update "Current Focus", "Last Session", "Documentation Health"
- Whether to update Active Tasks, Recent Accomplishments, Next Session sections

**Impact:** I had to infer what needed updating by reading the current STATUS.md structure.

**Suggestion:** Add explicit field list: "Update these STATUS.md fields: Last Updated, Current Focus, Last Session, Documentation Health session count, Active Tasks, Recent Accomplishments, Git Status, Next Session, footer"

---

### 2026-01-14 - /save-full: TL;DR Length Limit May Be Too Restrictive

**Severity:** LOW (UX)

**What happened:** Skill specifies TL;DR should be 50-300 characters. My Session 4 TL;DR was 333 characters - slightly over limit.

For a comprehensive QA session with multiple accomplishments (upgrade, bug discovery, workaround, testing 2 commands, generating reports, documenting 19 feedback entries), 300 chars is tight.

**Observation:** The existing Session 2 TL;DR is also quite long (appears to exceed 300 chars).

**Suggestion:** Consider increasing limit to 400 chars, or making it a soft guideline rather than hard requirement.

---

### 2026-01-14 - /save-full: Skill is Appropriately Concise

**Severity:** N/A (Positive)

**What worked:** Unlike /review-context (600+ lines), /save-full skill is concise (~100 lines). The execution steps are clear and numbered. The verification checklist is helpful.

This is a good model for other skills.

---

### 2026-01-14 - /code-review: Successfully Completed Full Agent-Based Review

**Severity:** N/A (Positive)

**What happened:** Successfully ran /code-review using the new v5.0.0 agent-based architecture. The system worked as designed:
- Codebase scanner created context cache
- Discovered 8 specialist agents, selected 6 based on applicability rules
- Ran 6 specialists in parallel using Task tool
- Generated audit-01.json and audit-01.md reports

**Result:** Grade A with 8 low-severity findings. The agent system is functional after manual component download.

---

### 2026-01-14 - /code-review: CRITICAL - No Execution Instructions in Command

**Severity:** CRITICAL (Usability)

**What happened:** The `/code-review` command file describes WHAT the agent system does but not HOW to execute it. Compare:

- `/review-context`: Has detailed "Execution Steps" with Step 0, Step 1, etc., specific bash commands, and clear instructions
- `/code-review`: Says "This command invokes the `code-reviewer` agent" but provides no execution steps

**Impact:** An AI must:
1. Realize it needs to read `.claude/agents/code-reviewer.md`
2. Understand the orchestrator workflow
3. Implement the scanning, discovery, selection, and execution logic itself
4. Know to use Task tool for parallel specialist execution

**Expected:** The command file should either:
1. Include execution steps like other commands, OR
2. Clearly state "Read and follow `.claude/agents/code-reviewer.md` for execution"

**Current behavior forces AI to figure out the execution model independently.**

---

### 2026-01-14 - /code-review: Agents are Specifications, Not Executable Code

**Severity:** MEDIUM (Architecture clarity)

**What happened:** The "agent" files in `.claude/agents/` are specification documents that describe:
- What patterns to search for
- What constitutes a finding
- How to format output

They are NOT executable code. The AI must implement all the logic itself:
- Scanning files
- Matching patterns
- Verifying mitigations
- Formatting AuditFinding objects

**Observation:** This is an interesting design choice. Each AI execution may produce different results based on how it interprets the spec.

**Suggestion:** Document this clearly - "Agents are specifications that the AI implements at runtime" - so users understand the model.

---

### 2026-01-14 - /code-review: Scanner Agent Requires Manual Cache Implementation

**Severity:** MEDIUM (Implementation burden)

**What happened:** The codebase-scanner.md describes the output schema but the AI must:
1. Create `.claude/cache/` directory
2. Implement project type detection
3. Build the JSON structure manually
4. Write to `codebase-context.json`

The scanner spec describes 7 detection methods (hasTests, hasCI, hasDatabase, etc.) that the AI must implement.

**Impact:** Complex implementation burden on AI. Different AIs may implement detection differently, leading to inconsistent agent selection.

**Suggestion:** Consider providing a bash script or TypeScript that actually generates the cache, rather than relying on AI interpretation of the spec.

---

### 2026-01-14 - /code-review: Parallel Specialist Execution Worked Well

**Severity:** N/A (Positive)

**What worked:** Using the Task tool with 6 parallel agent prompts worked correctly:
- All 6 specialists ran concurrently
- Each returned structured findings
- Results were properly synthesized

The parallel execution pattern is effective and efficient.

---

### 2026-01-14 - /code-review: Agent Contract System is Elegant

**Severity:** N/A (Positive)

**What worked:** The self-declaring agent contract system is well-designed:
- Each agent declares its applicability via JSON contract
- Selection algorithm is clear (always → presets → requires conditions)
- Adding new specialists = creating one file (no central registry)

This is a good architecture for extensibility.

---

### 2026-01-14 - /code-review: Missing Synthesis Agent Usage

**Severity:** LOW (Incomplete implementation)

**What happened:** The code-reviewer.md says to "Run synthesis-agent" for deduplication and grade calculation. I read the synthesis-agent.md but implemented the logic myself rather than launching another Task.

**Observation:** The synthesis agent could have been invoked as another Task, but the orchestrator doesn't clearly indicate whether synthesis should be a separate agent invocation or inline logic.

**Suggestion:** Clarify whether synthesis-agent should be invoked via Task tool or implemented inline.

---

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

