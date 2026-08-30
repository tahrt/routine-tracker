{
  "path": "daily routine/ROUTINE-V2-PLAN.md",
  "text": "# Routine Planning Layer V1 — Product & Implementation Plan\n\nLast updated: 2026-08-30\n\n## 0. Release target\n\n**Target release: 2026-09-07**\n\nThis is a deliberately small, additive release. The goal is to make Routine useful as an **execution system for real priorities**, not to rebuild it into a project-management app.\n\nIf the plan expands beyond roughly 1 week / about 8–12 focused implementation hours, stop and re-scope instead of silently moving the release.\n\n---\n\n## 1. Why we are changing Routine\n\nRoutine already does habit tracking well:\n\n- Today / Week routine tracking\n- stable habit identity and streak history\n- editable weekly templates\n- honest historical day snapshots\n- Learning Paths and progress\n- Insights / Momentum\n- safe PWA updates\n- local backup/import\n\nThe missing layer is **planning**.\n\nToday the app mostly answers:\n\n> “What recurring things are scheduled today?”\n\nIt does not yet answer:\n\n> “Given my goals, deadlines, available time, and current pipeline, what is the most important thing I should do today?”\n\nThat creates a gap between real-life priorities and the routine schedule.\n\n### Core product direction\n\n```text\nLIFE PRIORITIES\n      ↓\n90-DAY GOALS\n      ↓\nACTIVE PROJECT / JOB SEARCH / LEARNING\n      ↓\nWEEK PLAN\n      ↓\nTODAY\n      ↓\nDONE / MISSED\n      ↓\nREPLAN + WEEKLY REVIEW\n```\n\nRoutine becomes the **execution layer**.\n\nProject repos, progress files, job descriptions, and learning curricula remain their own sources of detail. Routine should store only the minimum planning state needed to decide what to do now.\n\n---\n\n## 2. Current planning assumptions\n\nThese are the working assumptions for the first real usage cycle.\n\n### North Star\n\n**Get a good job**\n\nWorking 90-day outcome target:\n\n- target date: **2026-11-30**\n- outcome: accepted job offer that meets career-fit criteria\n\nJob Search is the default highest-priority flexible work unless a nearer hard deadline or interview requires otherwise.\n\n### Active portfolio\n\n```text\nNORTH STAR\nJob Search\n\nPRIMARY PROJECT\nContent Production Automation\n\nNEXT\nOpenReply\n\nSUPPORT\nLearning\n\nMAINTENANCE / PARKED\nOther projects unless explicitly reactivated\n```\n\nImportant rule:\n\n> Important does not mean Active Today.\n\nA project can be important and still remain queued.\n\n### Capacity model\n\nUse **90-minute Focus Blocks** as the main planning unit.\n\n```text\nNormal weekday     2 blocks\nLow-capacity day   1 block\nDay off / weekend  3 blocks\n```\n\nCurrent weekly rhythm:\n\n```text\nMon   2 blocks\nTue   2 blocks\nWed   1 block\nThu   2 blocks\nFri   1 block\nSat   3 blocks\nSun   3 blocks\n\nTotal planned capacity: 14 blocks / 21 hours\n```\n\nDo not schedule all available clock time. Keep buffer for fatigue, commuting, interruptions, admin, and recovery.\n\nA low-capacity day is **not a failed day**. The plan must compare performance with planned capacity for that day type.\n\n---\n\n## 3. Product principles\n\n### 3.1 Preserve the existing Routine\n\nPlanning is additive.\n\nDo **not** replace or rewrite:\n\n- day snapshot history\n- habit ids\n- streak semantics\n- rest / skipped / untracked semantics\n- editable weekly templates\n- Learning progress\n- backup/import behavior\n- safe PWA update behavior\n\nHistorical records must remain honest.\n\n### 3.2 Habit and progress are different concepts\n\n```text\nHabit\n= Did I consistently do this kind of activity?\n\nPlan\n= Did I move the current goal toward its finish line?\n```\n\nExample:\n\n- `personal` habit can remain the stable historical activity.\n- Today’s plan can resolve that habit into a concrete action such as “Close current project milestone”.\n\nCompleting a planning action may satisfy a linked habit, but project progress must never rewrite the meaning of historical habit streaks.\n\n### 3.3 Schedule becomes rhythm, not dictator\n\nThe weekly routine template remains useful for fixed life rhythm:\n\n- work\n- gym\n- relationship / personal time\n- sleep / wind down\n- preferred working windows\n\nFlexible work such as Job Search, Projects, and Learning should be selected from the current Week Plan using:\n\n```text\npriority\n+ deadline\n+ due next action\n+ remaining weekly commitment\n+ today's capacity\n```\n\n### 3.4 Deadline does not silently slide\n\nIf a milestone misses its deadline:\n\n- do not automatically move the deadline\n- do not blindly carry every missed task into tomorrow\n- surface the risk\n- require an explicit replan decision\n\nPossible decisions:\n\n- cut scope\n- extend deadline\n- pause / park\n- replace milestone\n- continue unchanged with an explicit reason\n\n### 3.5 Local/private by default\n\nThe app is deployed from a public repository, but personal planning data is private runtime data.\n\nDo not hard-code in source:\n\n- application notes\n- interview feedback\n- salary information\n- private company notes\n- personal planning history\n\nV1 stores personal planning state in local storage and includes it in export/import backups.\n\n---\n\n## 4. Planning data model — V1 contract\n\nKeep the model intentionally small.\n\n### 4.1 Goal / Workstream\n\n```ts\ntype WorkstreamType =\n  | 'career'\n  | 'project'\n  | 'learning';\n\ntype WorkstreamStatus =\n  | 'active'\n  | 'queued'\n  | 'maintenance'\n  | 'parked'\n  | 'done';\n\ninterface Workstream {\n  id: string;\n  type: WorkstreamType;\n  title: string;\n\n  outcome: {\n    goal: string;\n    priority: 'north-star' | 'primary' | 'support' | 'next';\n  };\n\n  plan: {\n    deadline: string | null;       // YYYY-MM-DD\n    definitionOfDone: string[];\n  };\n\n  execution: {\n    status: WorkstreamStatus;\n    milestone: string | null;\n    weeklyCommitment: string | null;\n    nextAction: string | null;\n  };\n\n  linkedHabitId?: string | null;\n}\n```\n\nDo not add percent complete in V1.\n\nFor knowledge work, “73% complete” is usually less useful than:\n\n- days remaining\n- finish line\n- current milestone\n- next action\n- weekly commitment\n\n### 4.2 Capacity profile\n\n```ts\ninterface CapacityProfile {\n  weekday: number;            // 0–6\n  focusBlocks: number;\n  label: string;\n}\n```\n\nInitial default planning profile:\n\n- normal weekday: 2 blocks\n- low-capacity weekday: 1 block\n- weekend/day off: 3 blocks\n\nCapacity must be editable later; the seed is not permanent truth.\n\n### 4.3 Week Plan\n\n```ts\ninterface WeekPlan {\n  id: string;                 // e.g. 2026-W36\n  startsOn: string;           // Monday YYYY-MM-DD\n\n  commitments: Array<{\n    workstreamId: string;\n    targetBlocks: number;\n    outcome: string;\n  }>;\n\n  review?: {\n    completedAt: string;\n    wins: string;\n    misses: string;\n    bottleneck: string;\n    adjustment: string;\n  };\n}\n```\n\nThe Week Plan allocates finite capacity before Today tasks are selected.\n\n### 4.4 Planned Action\n\n```ts\ntype PlannedActionStatus =\n  | 'planned'\n  | 'done'\n  | 'deferred'\n  | 'cancelled';\n\ninterface PlannedAction {\n  id: string;\n  date: string;\n  workstreamId: string;\n\n  title: string;\n  focusBlocks: number;\n  due?: string | null;\n\n  linkedHabitId?: string | null;\n  applicationId?: string | null;\n\n  status: PlannedActionStatus;\n}\n```\n\nV1 should normally show only **1–2 important flexible actions** on a weekday, not a large backlog.\n\n---\n\n## 5. Job Application Tracker — V1\n\nApplication Tracking is a core part of the Job Search workstream, not a separate side project.\n\n### 5.1 Application contract\n\n```ts\ntype ApplicationStage =\n  | 'saved'\n  | 'preparing'\n  | 'applied'\n  | 'screening'\n  | 'interview'\n  | 'final'\n  | 'offer'\n  | 'rejected'\n  | 'withdrawn';\n\ninterface JobApplication {\n  id: string;\n\n  company: string;\n  role: string;\n  jobUrl?: string;\n\n  fitScore?: number;          // 1–5\n  fitReason?: string;\n\n  stage: ApplicationStage;\n\n  savedAt?: string;\n  appliedAt?: string;\n  nextEventAt?: string;\n\n  nextAction?: string;\n  nextActionDue?: string;\n\n  notes?: string;\n}\n```\n\n### 5.2 Pipeline\n\n```text\nSaved\n  ↓\nPreparing\n  ↓\nApplied\n  ↓\nScreening\n  ↓\nInterview\n  ↓\nFinal\n  ↓\nOffer\n\nTerminal:\nRejected / Withdrawn\n```\n\n### 5.3 Planner behavior\n\nThe tracker must not be only a database.\n\nIts `nextAction` feeds the Week / Today planner.\n\nExample:\n\n```text\nApplication A\nStage: Interview\nNext action: Prepare interview\nDue: tomorrow\n```\n\nThis should usually outrank:\n\n```text\nApply to one more Saved role\n```\n\nbecause an existing conversion opportunity is closer to the outcome.\n\n### 5.4 V1 metrics\n\nKeep metrics simple:\n\n- count by stage\n- applications submitted this week\n- active interviews\n- offers\n- applications needing attention\n\nDeep funnel analytics can come after real data exists.\n\n---\n\n## 6. Today Planner — V1 behavior\n\nThe Today page should continue to show the life routine, but add a planning layer for flexible work.\n\n### Today hierarchy\n\n```text\nTODAY\n\nCapacity\n2 Focus Blocks\n\nMUST WIN\nJob Search\n→ Submit / prepare highest-value application\n\nNEXT\nPrimary Project\n→ Current milestone action\n\nROUTINE\nGym\nWork\n...\n```\n\nDo not show every active workstream every day.\n\n### Selection rules\n\nFor flexible planning, rank candidate actions approximately by:\n\n1. fixed event / interview / hard due date\n2. hard project deadline risk\n3. North Star weekly target risk\n4. active primary project milestone\n5. learning/support work\n6. queued or parked work should not surface\n\n### Linking to habits\n\nA planned action can link to a stable habit:\n\n```text\nPrepare job application\n→ linkedHabitId: jobsearch\n\nClose project milestone\n→ linkedHabitId: personal\n\nComplete learning lesson\n→ linkedHabitId: learning\n```\n\nWhen appropriate, completing the action can satisfy the linked habit for that day, but this must integrate with the existing day snapshot model rather than bypassing it.\n\n---\n\n## 7. Replan rules — V1\n\nV1 should be deterministic and understandable.\n\nDo not use AI for ordinary daily carry-over.\n\n### 7.1 When an action is missed\n\nDo not blindly duplicate it tomorrow.\n\nAt the next planning pass:\n\n1. check whether the action is still relevant\n2. check deadline / event urgency\n3. check remaining week capacity\n4. choose:\n   - defer\n   - replace\n   - cancel\n   - escalate for explicit replan\n\n### 7.2 Weekly commitment risk\n\nExample:\n\n```text\nJob Search target: 5 application actions\nCompleted: 1\nDays left: 2\n\n→ At risk\n```\n\nThe planner may prioritize Job Search on remaining flexible blocks.\n\n### 7.3 Interview override\n\nWhen an interview appears:\n\n```text\ninterview prep ↑\nnew applications ↓\nlearning may defer\n```\n\nDo not blindly protect top-of-funnel quotas at the expense of a live interview.\n\n### 7.4 Deadline miss\n\nA missed project deadline must create an explicit review state:\n\n```text\nDeadline missed\n\nChoose:\n- cut scope\n- extend\n- park\n- redefine finish line\n```\n\nNo automatic sliding deadline.\n\n---\n\n## 8. Weekly Review — V1\n\nSunday / week-end review should answer only what changes next week.\n\nShow:\n\n- planned blocks vs completed blocks\n- commitments completed / missed\n- application pipeline movement\n- deadline risks\n- most common deferral\n- one bottleneck\n- one adjustment for next week\n\nAvoid turning Weekly Review into journaling homework.\n\nSuggested output:\n\n```text\nWEEK REVIEW\n\nCapacity planned: 14 blocks\nCompleted: 10\n\nJob Search\n4 / 6 blocks\n2 applications submitted\n1 interview active\n\nProject\n4 / 4 blocks\nmilestone closed\n\nLearning\n2 / 2 blocks\n\nBottleneck\nWeekday evening energy\n\nAdjustment\nMove hardest Job Search work to weekend mornings\n```\n\n---\n\n## 9. Navigation / UI direction\n\nDo not add many top-level tabs.\n\nKeep the current navigation:\n\n```text\nToday\nLearn\nInsights\nMore\n```\n\nPlanning should primarily live inside Today / Week, with management pages reachable from there or More.\n\n### Proposed Today additions\n\n- current 90-day goal summary\n- today capacity\n- 1 Must Win action\n- optional second planned action\n- current deadline / risk indicator\n- existing routine checklist below\n\n### Proposed Week additions\n\n- weekly capacity\n- workstream allocation\n- commitment progress\n- planned actions by day\n- Weekly Review entry\n\n### Job Search management\n\nAdd a dedicated Job Search / Applications view reachable from the Job Search card.\n\nShow:\n\n- pipeline counts\n- Needs Attention\n- application list\n- add/edit application\n- stage movement\n- next action / due date\n\n---\n\n## 10. Storage & migration plan\n\nCurrent schema is **v4**.\n\nPlanning V1 will require a new migration. Do not reset storage.\n\nLikely V5 additions:\n\n```text\nworkstreams\ncapacityProfiles\nweekPlans\nplannedActions\njobApplications\n```\n\nRequirements:\n\n- preserve all existing `rt:day:*` history\n- preserve habits and template versions\n- preserve `rt:learning:progress`\n- include new planning data in export/import\n- migration test v4 → v5\n- pre-migration backup remains mandatory\n- safe PWA update path remains unchanged\n\nBefore implementation, confirm whether these collections should live in one planning blob or separate localStorage keys. Prefer separate keys if it reduces write coupling and keeps the existing day store stable.\n\n---\n\n## 11. Implementation phases\n\n### Phase 0 — Architecture audit & scope freeze\n**Estimate: 1–2h**\n\nDeliverables:\n\n- map current store / app / dashboard integration points\n- choose V5 storage layout\n- confirm migration strategy\n- confirm action ↔ habit linking behavior\n- write tests for new types/store rules before UI work where practical\n\nDone when:\n\n- no ambiguity about where planning state lives\n- no existing historical invariant needs to be weakened\n\n### Phase 1 — Planning foundation\n**Estimate: 2–3h**\n\nBuild:\n\n- Workstream model\n- Capacity Profile\n- Week Plan\n- Planned Actions\n- V4 → V5 migration\n- local storage persistence\n- export/import support\n- tests\n\nDone when:\n\n- planning data survives reload\n- existing v4 data migrates without history changes\n- backups round-trip new data\n\n### Phase 2 — Week + Today planning UI\n**Estimate: 2–3h**\n\nBuild:\n\n- Today capacity\n- Must Win / Next planned action\n- workstream context\n- Week capacity/allocation view\n- complete/defer/cancel action behavior\n- linked-habit integration\n\nDone when:\n\n- app can answer “what should I do now?”\n- no more than planned daily capacity surfaces\n- completing planning work preserves correct habit history\n\n### Phase 3 — Application Tracker\n**Estimate: 2–3h**\n\nBuild:\n\n- application CRUD\n- stages\n- fit score\n- next action / due date\n- Needs Attention\n- pipeline counts\n- feed application actions into planner\n\nDone when:\n\n- a real application can move from Saved → Applied → Interview → Offer/Rejected\n- due next action can surface in Today\n\n### Phase 4 — Replan + Weekly Review\n**Estimate: 1–2h**\n\nBuild:\n\n- simple risk indicators\n- missed-action resolution\n- weekly commitment status\n- weekly review summary\n- next-week adjustment\n\nDone when:\n\n- missed work does not stack endlessly\n- deadline misses do not silently slide\n- next week can be created from explicit review decisions\n\n### Phase 5 — Verification & release\n**Estimate: 1–2h**\n\nRequired:\n\n- full test suite\n- TypeScript/build\n- migration tests\n- export/import test\n- PWA update regression\n- manual iPhone-size smoke test\n- verify existing user data remains intact\n\nThen deploy through the existing safe update flow.\n\n---\n\n## 12. V1 Definition of Done\n\nPlanning Layer V1 is **DONE** when the installed Routine app can:\n\n1. show the active 90-day goal\n2. know today's planned Focus Block capacity\n3. show only 1–2 high-value flexible actions for today\n4. represent an active project with deadline, finish line, milestone, and next action\n5. track job applications through the core pipeline\n6. surface an application's due next action into Today\n7. link planned actions to existing habits without corrupting streak/history semantics\n8. handle missed actions without endlessly stacking them\n9. flag a missed deadline for explicit replan instead of silently moving it\n10. run a short Weekly Review and create the next Week Plan\n11. migrate existing v4 data safely\n12. export/import the new planning state\n13. pass the full existing test suite plus new planning tests\n14. update the existing iPhone Home Screen app without deleting/re-adding it\n\nIf all 14 are true, **ship**.\n\n---\n\n## 13. Explicit non-goals for this release\n\nDo not add these before Planning V1 ships:\n\n- AI-generated daily plans\n- AI auto-reprioritization\n- automatic repo / `progress.md` syncing\n- GitHub integration\n- Google Calendar integration\n- server backend\n- Supabase / multi-device sync\n- automatic job discovery\n- resume builder\n- deep job funnel analytics\n- salary analytics\n- reminders / push notifications\n- project backlog manager\n- Jira / Notion-style subtask trees\n- arbitrary progress percentages\n- broad redesign of Learn / Insights\n- rewrite of existing habit engine\n\nThese can be reconsidered only after real usage shows a clear need.\n\n---\n\n## 14. First real usage cycle\n\nThe first week is not only “using the app”; it is a product test.\n\nTrack:\n\n- planned Focus Blocks\n- completed Focus Blocks\n- most deferred workstream\n- whether 90 minutes is the right block size\n- whether Today shows too much / too little\n- whether application next actions are useful\n- whether low-capacity days feel fair\n- whether weekly review changes the next week meaningfully\n\nAfter 1–2 weeks, review real behavior before adding intelligence.\n\nThe question is not:\n\n> “What feature would be cool next?”\n\nThe question is:\n\n> “What repeatedly failed in the real planning loop?”\n\n---\n\n## 15. Current first-week planning example\n\nThis is an initial working example, not a permanent template.\n\n```text\nMon\n- Job Search\n- Primary Project\n\nTue\n- Primary Project\n- Job Search\n\nWed — low capacity\n- Highest-risk action only\n\nThu\n- Job Search\n- Job Search / Project based on current state\n\nFri — low capacity\n- Highest-value Job Search action\n\nSat\n- Job Search\n- Job Search / Portfolio\n- Project or Learning\n\nSun\n- Job Search\n- Learning\n- Weekly Review\n```\n\nThe app should eventually derive a schedule like this from capacity + commitments rather than hard-coding the example.\n\n---\n\n## 16. Decision rules after release\n\nAfter 1–2 weeks of real usage:\n\n### If the planner feels useful and lightweight\nContinue with small improvements based on usage.\n\n### If the planner is ignored\nDo not add more features. Reduce friction and fields.\n\n### If planning works but manual entry is the bottleneck\nThen evaluate integrations / AI assistance.\n\n### If job applications dominate real usage\nImprove Job Search first.\n\n### If project deadlines dominate real usage\nImprove project milestone / replan behavior first.\n\nThe real user behavior decides V2.1 scope.\n",
**Status: IN PROGRESS — foundation written, verification pending**  
  "sha256": "a411cb3dd842da418a48d487ee950656f78ae3b7eca5d900b5b2be875572dc1a",
  "truncated": false
}

---

## 17. Phase 0 architecture audit — CLOSED 2026-08-30

Phase 0 was completed against the current implementation before feature coding.

### 17.1 Existing architecture we will preserve

Current app structure is already suitable for an additive planning layer:

- `src/app.ts` is the orchestration layer: app state, rendering, and `data-action` event wiring.
- `src/views/dashboard.ts` renders Today as a pure HTML view from passed state.
- `src/views/week.ts` renders historical routine performance and should stay the source of truth for past-day routine tracking.
- `src/store/index.ts` exposes one Store interface to the app.
- `src/store/localStore.ts` already separates high-churn data into localStorage keys and assembles a complete export object.
- `src/store/migrations.ts` already provides versioned, pre-migration-backed schema upgrades.
- Day history is frozen in `DayRecord.tasks`; habit statistics are computed only from those snapshots.
- Learning curriculum and personal learning completion are already separated.

No existing historical invariant needs to be weakened for Planning V1.

### 17.2 V5 storage decision

**Decision: separate runtime localStorage keys, one nested planning object in export/import.**

Runtime keys:

```text
rt:planning:workstreams
rt:planning:capacity
rt:planning:weeks
rt:planning:actions
rt:job:applications
```

Existing keys remain unchanged:

```text
rt:meta
rt:habits
rt:templates
rt:learning:progress
rt:day:YYYY-MM-DD
rt:index
```

Reason:

- a checkbox on an old routine day must not rewrite planning state
- editing one job application must not serialize all historical days
- Week Plan changes should not touch application storage
- export/import can still remain one complete backup

Export shape will add:

```ts
interface PlanningData {
  workstreams: Record<string, Workstream>;
  capacityProfiles: CapacityProfile[];
  weekPlans: Record<string, WeekPlan>;
  plannedActions: Record<string, PlannedAction>;
  jobApplications: Record<string, JobApplication>;
}

interface RootData {
  // existing v4 fields...
  planning: PlanningData;
}
```

The runtime may use separate keys, while `collect()` / `writeRoot()` collapse/explode them through `RootData.planning`.

### 17.3 V4 → V5 migration decision

V5 migration is additive only.

```text
v4
days / habits / templates / learningProgress

      ↓ migrate

v5
all v4 fields byte-equivalent
+
planning: {
  workstreams: {},
  capacityProfiles: [...default capacity],
  weekPlans: {},
  plannedActions: {},
  jobApplications: {}
}
```

Rules:

- never rewrite `days`
- never regenerate template versions
- never rename or recreate habit ids
- never change Learning completion
- preserve the existing pre-migration backup behavior
- import of old v1–v4 backups must migrate through to v5
- export/import must round-trip all planning data

The initial capacity seed may mirror the current weekly rhythm, but real Workstreams and Job Applications are runtime user data and must not be seeded with private application details.

### 17.4 Action ↔ habit decision

Planning completion and habit completion remain **two different records**.

```text
PlannedAction.status
= execution-plan truth

DayTask.done
= habit/routine history truth
```

A Planned Action may have `linkedHabitId`, but Planning V1 must not bypass the existing DayRecord snapshot model.

Safe V1 behavior:

1. Marking a Planned Action done always updates the action itself.
2. If today's routine contains **exactly one core DayTask** with the same `linkedHabitId`, the UI may offer / apply the same completion to that existing DayTask through the normal DayRecord write path.
3. If there is no matching scheduled habit task, Planning completion does not invent one.
4. If more than one core task maps to the habit, do not auto-complete all of them.
5. Historical dates are never rewritten from later project state.
6. Reopening a planning action must not silently erase habit history; routine completion can be corrected explicitly in the existing checklist if needed.

This deliberately favors honest history over aggressive automation.

### 17.5 Today planner source-of-truth decision

V1 Today planning uses a pure deterministic selector in a new library module, likely:

`src/lib/planning.ts`

Inputs:

```text
date
capacity profile
active workstreams
current Week Plan
planned actions
job applications
```

Output:

```text
capacity
Must Win
optional Next action
warnings / risk
```

Rules:

- persisted `PlannedAction` entries are the primary execution truth
- an Application `nextAction` with a due date can become a Today candidate
- `Workstream.execution.nextAction` is context/fallback, not an infinite auto-generated backlog
- queued / parked / done workstreams do not surface
- selector never creates or silently carries tasks while rendering

This keeps planning explainable and testable.

### 17.6 Missed-action decision

A missed action remains attached to its original date/status until the user or planner explicitly resolves it.

Do **not** copy it automatically to tomorrow.

Resolution choices:

```text
defer → create/update an explicitly dated future action
replace → cancel old action and create replacement
cancel → terminal cancelled
replan → surface deadline/commitment risk
```

This avoids duplicated carry-over chains.

### 17.7 Week view integration decision

Do not replace the current Week history skyline.

Week becomes two conceptual sections:

```text
WEEK PLAN
capacity / commitments / planned flexible actions

ROUTINE HISTORY
existing Mon–Sun completion skyline
```

The existing historical chart and its rest/untracked semantics remain unchanged.

### 17.8 Today UI integration decision

When planning data exists, Today hierarchy becomes:

```text
Hero / date

PLAN FOR TODAY
capacity
Must Win
optional Next
deadline / risk

ROUTINE
existing routine progress
existing checklist

LEARNING
existing Continue Learning entry where relevant
```

The old routine `UP NEXT` must not compete visually with the planning Must Win. It should be treated as **Routine Next** once Planning V1 is active.

### 17.9 Application Tracker integration decision

Applications stay inside the Job Search domain but use their own runtime key.

A due/overdue application next action can surface as a Today candidate.

Priority behavior:

```text
scheduled interview / urgent application action
    > generic new application work
```

Application stage changes do not automatically count as Focus Blocks. Only execution actions count toward Week Plan completion.

### 17.10 Expected implementation touch points

Likely files:

```text
src/types.ts
src/store/migrations.ts
src/store/localStore.ts
src/lib/planning.ts              NEW
src/views/planning.ts            NEW or split as needed
src/views/applications.ts        NEW
src/views/dashboard.ts
src/views/week.ts
src/app.ts
src/redesign.css
test/migrations.test.ts
test/store.test.ts
test/planning.test.ts            NEW
test/app.test.ts
test/views.test.ts
```

Do not introduce a framework or backend for this work.

### 17.11 Test gates before UI expansion

Foundation tests must prove:

- v4 → v5 preserves existing routine and learning data
- planning collections persist independently
- planning data survives export/import
- old backups still migrate
- capacity lookup is deterministic
- Today selector never exceeds available Focus Blocks
- queued/parked work does not surface
- due interview/application work can outrank generic work
- missed actions are not auto-carried
- linked planning actions do not invent/overwrite historical habit tasks

### 17.12 Phase 0 conclusion

**Phase 0 = DONE.**

Architecture is additive and compatible with the current app.

Next implementation slice:

> **Phase 1 — Planning foundation**

First measurable target:

1. add V5 types
2. add v4 → v5 migration
3. add separate planning storage keys + Store methods
4. include planning in export/import
5. add foundation tests
6. stop before UI if migration/storage invariants are not green

Phase 1 is done only when existing history is preserved and the new planning state survives reload + backup round-trip.

Verification result (2026-08-30):

- `npm test` — 9/9 files, **136/136 tests passed**
- `npm run build` — TypeScript + Vite + service-worker build passed
- V4 → V5 migration coverage passed
- Planning export/import round-trip coverage passed

**Phase 1 = DONE. Next: Phase 2 — Week + Today planning UI.**
