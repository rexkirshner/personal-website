# AI Context System - Feedback Log

**Version**: 4.0.2
**Project**: Rex Kirshner Personal Website

---

## Purpose

This file helps improve the AI Context System for everyone. Your feedback matters!

**Please document:**
- Bugs - Errors, unexpected behavior, crashes
- Improvements - Ideas to make CCS better
- Questions - Confusion, unclear documentation
- Feature Requests - New capabilities you'd like
- Praise - What's working well (we need this too!)

---

## Feedback Entries

### 2026-01-07 - Installation Process - Feedback

**What happened**: Installed ACS v4.0.2 via curl script on a mature project (personal website with existing CLAUDE.md, README.md, docs/, tasks/).

**What went well**:
- Curl install script worked flawlessly
- All 22 slash commands installed correctly
- Templates, scripts, reference files all in place
- VERSION file created

**Severity**: N/A (praise)

**Environment**:
- OS: macOS 14.x (Darwin 24.6.0)
- Claude Code: Opus 4.5
- ACS: 4.0.2

---

### 2026-01-07 - /init-context - Improvement Needed

**What happened**: User requested `/init-context`. Step 0.1 correctly detected 2+ documentation files (README.md, docs/ directory) and suggested switching to `/migrate-context`.

**Expected behavior**: Automatic detection and routing worked correctly.

**What could be better**:

1. **The decision to switch required user confirmation.** The command correctly identified that `/migrate-context` was more appropriate, but the user had to manually confirm the switch. Consider:
   - Auto-switching when detection is clear (2+ docs)
   - Or providing clearer guidance about the difference

2. **After switching to /migrate-context, I had to re-read the entire command file.** The context from /init-context didn't carry over. Consider:
   - Having /init-context auto-invoke /migrate-context when appropriate
   - Or having a shared "maturity detection" step that routes to the right command automatically

**Suggestion**: Create a single entry point `/setup-context` that auto-detects project maturity and routes to the appropriate flow (init vs migrate) without user needing to know the difference.

**Severity**: Moderate (workaround exists - just run the right command)

---

### 2026-01-07 - /migrate-context - Legacy Task File Handling

**What happened**: Project had `tasks/todo.md` (3705 bytes) - a legacy task tracking file from pre-ACS work. The /migrate-context command detected it and asked what to do.

**The problem**: The command offered three generic options:
1. Preserve legacy task files in context/tasks/ for reference
2. Skip (content should be migrated to STATUS.md)
3. [Delete wasn't explicitly offered but implied]

**What actually needed to happen**:
The file contained a **completed performance optimization plan** with:
- Historical decisions (why defer gallery, why use thumbnails)
- Before/after metrics
- Specific file changes with line numbers
- Root cause analysis

This wasn't current task state (STATUS.md) - it was **historical session work and decisions** that needed to be:
1. Analyzed to extract valuable information
2. Migrated to DECISIONS.md (the performance optimization rationale became D006)
3. Migrated to SESSIONS.md (became Session 0 - pre-ACS historical work)
4. Archived (not deleted, not kept in active location)

**What we did**:
1. Read the file to understand contents
2. Extracted decisions → Added D006 to DECISIONS.md
3. Extracted session history → Added Session 0 to SESSIONS.md
4. Archived original → Moved to .archive/tasks/todo.md

**Suggestion**: Enhance /migrate-context to:
1. **Analyze legacy file contents** before asking what to do
2. **Suggest appropriate destinations** based on content type:
   - If contains completed tasks with history → SESSIONS.md
   - If contains decision rationale → DECISIONS.md
   - If contains current tasks → STATUS.md
   - If contains architectural info → ARCHITECTURE.md or CLAUDE.md
3. **Offer guided migration** rather than just preserve/skip/delete
4. **Always archive** rather than delete (preserve history)

**Severity**: Moderate (required manual intervention to handle correctly)

---

### 2026-01-07 - Project with Existing CLAUDE.md - Guidance Needed

**What happened**: Project already had a comprehensive CLAUDE.md (19KB) that serves as the primary project reference. This created uncertainty about how ACS should integrate.

**Questions that arose**:
1. Should CLAUDE.md be moved to context/?
2. Should CONTEXT.md duplicate or reference CLAUDE.md content?
3. What's the relationship between them?

**What we decided** (became D005):
- Keep CLAUDE.md at project root (auto-loaded by Claude Code)
- ACS supplements it with session state (STATUS.md, SESSIONS.md)
- CONTEXT.md stays lightweight, references CLAUDE.md
- No duplication

**Suggestion**: Add explicit guidance in /init-context and /migrate-context for projects with existing comprehensive CLAUDE.md:

```
Detected existing CLAUDE.md (19KB) at project root.

CLAUDE.md is auto-loaded by Claude Code and should stay in root.
ACS will supplement it with:
- context/STATUS.md - Current state
- context/SESSIONS.md - Session history
- context/DECISIONS.md - Decision log

Your CLAUDE.md will remain the primary project reference.
Continue? [Y/n]
```

**Severity**: Moderate (had to figure out the right approach)

---

### 2026-01-07 - Multiple .claude Directories Detection - Good Feature

**What happened**: Step 0.5 detected multiple .claude directories (one in parent /coding/ folder, others in sibling projects).

**Expected behavior**: Warn about potential conflicts.

**Actual behavior**: Correctly warned, but the detection was too broad - it found sibling projects' .claude folders which aren't conflicts.

**Suggestion**: Refine detection to only warn about:
1. .claude in DIRECT parent directories (actual conflict)
2. NOT sibling directories at same level (not conflicts)

Current find command searches `..` which includes siblings.

**Severity**: Minor (false positive warnings, but no real issue)

---

### 2026-01-07 - Overall Experience - Praise

**What went well**:

1. **Install script is solid** - One curl command, everything in place
2. **Maturity detection works** - Correctly identified mature vs new project
3. **Template quality is high** - Well-structured, comprehensive
4. **Documentation is thorough** - Commands are well-documented
5. **Flexibility** - System adapted to project with existing comprehensive CLAUDE.md

**Best parts**:
- The two-tier save approach (/save vs /save-full) is smart
- DECISIONS.md with structured format is valuable for AI context
- Session history with TL;DR requirement is useful
- Config file (.context-config.json) is comprehensive

**Overall**: Strong system. Main gaps are in handling edge cases during migration (legacy files, existing docs). The "happy path" for new projects is likely smoother.

---

## Template for Future Entries

```markdown
### YYYY-MM-DD - [Command/Feature] - [Category]

**What happened**: [Description]

**Expected behavior**: [What you thought would happen]

**Actual behavior**: [What actually happened]

**Suggestion**: [Your idea for improvement]

**Severity**: [Critical / Moderate / Minor]
```

---

*Your feedback will be reviewed when you run `/update-context-system` or manually share it with the maintainers.*
