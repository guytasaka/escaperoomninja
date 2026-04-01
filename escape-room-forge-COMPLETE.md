# Escape Room Forge: Complete System Reference

A comprehensive AI escape room development platform — design system, product requirements, and implementation guide in a single source of truth.

**Version:** 1.1 (Consolidated)  
**Last Updated:** March 2026

---

# TABLE OF CONTENTS

## Part I: Design System
1. System Overview (Voices, Commands, Settings)
2. Genre Definitions (10 genres)
3. Room Type Definitions (6 types)
4. Creative Mentor
5. Escape Room Educator
6. Theme & Concept Generator
7. Player Psychology Profiler
8. Puzzle Flow Architect
9. Narrative & Clue Writer
10. Market & Comp Research
11. Playtest Evaluator
12. Room Design Formatter
13. Room Layout & Set Design Planner
14. Visual Prompter
15. Complete Puzzle Type Catalog (50+ types)
16. Budget Breakdown: The $1,000 Room
17. Business-in-a-Box (33 deliverables)
18. Best Practices (Safety, Legal, Design, Operations, Marketing)
19. Development Workflow (6-phase build process)
20. Mystery Genre Quick Reference
21. Game Master Manual
22. Financial Projections Template

## Part II: SaaS Platform (PRD)
23. Executive Summary
24. Tech Stack (No Vendor Lock-In)
25. System Architecture & AI Provider Abstraction
26. Data Model (14 tables including revision history)
27. Project Phase State Machine
28. Builder Wizard UX (9 phases with full asset generation)
29. AI Generation Pipeline (prompt system, model routing, quality gates)
30. Revision System (content history, asset versions, snapshots, undo/redo, side-by-side comparison)
31. Progressive Visualization System (preview panel, TTS preview, room viz, generation mosaic)
32. Admin System & Cost Management
33. Collaborator System
34. Persistence & Return Flow
35. Print-Ready Asset Specifications & 3D Printing
36. Output Package Structure (ZIP with 11 folders, manifest)
37. Non-Functional Requirements
38. Monetization
39. Development Phases (20-week timeline)
40. Risks & Mitigations
41. Success Metrics

## Part III: Implementation Guide (Claude Code)
42. Project Directory Structure (full file tree)
43. Docker Compose / Local Dev Setup
44. Environment Variables
45. Build Order (8 sprints with test criteria)
46. Key Implementation Patterns (provider abstraction, task router, generation orchestrator, SSE, prop pipeline)
47. Testing Strategy

---
---

# PART I: DESIGN SYSTEM

The core escape room design system — voices, agents, frameworks, templates, catalogs, and workflows. This is the knowledge backbone that powers every AI generation in the platform.

---

## SYSTEM OVERVIEW

### Three Voices

| Voice | Role | When to Use |
|-------|------|-------------|
| 🎭 **Mentor** | Challenges design choices, pushes for better player experience | Feedback, critique, puzzle design decisions |
| 🎓 **Educator** | Teaches escape room craft, explains industry standards | "Why" questions, best practices, learning |
| 🛠️ **Workshop** | Executes specific tasks | Deliverables, formatting, generation, plans |

### User Commands
- "Mentor, what do you think..." → Mentor mode
- "Educator, explain..." / "Why do..." → Educator mode
- "Create a..." / "Design this..." / "Build a..." → Workshop mode
- Default: System chooses based on context

### Settings (User Adjustable)
- **Genre Focus:** Mystery (default, changeable to any genre)
- **Room Context:** Brick-and-Mortar (default, changeable to pop-up, mobile, home-based, corporate, outdoor)
- **Mentor Intensity:** Balanced (adjustable: Supportive ↔ Tough)
- **Budget Tier:** Standard $1,000 (adjustable: Micro $500 / Standard $1,000 / Premium $2,500 / Deluxe $5,000+)
- **Group Size Target:** 4–8 players (adjustable: 2–4 / 4–8 / 8–12)
- **Difficulty Level:** Intermediate (adjustable: Beginner / Intermediate / Advanced / Expert)

---

## GENRE DEFINITIONS

### 🔍 Mystery (Default)
Players investigate a crime, solve a case, or uncover a hidden truth. Emphasis on deduction, observation, and connecting evidence. Narrative-heavy with clue chains that reward careful attention.
- **Tone:** Suspenseful, intellectual, satisfying
- **Key Elements:** Evidence boards, hidden documents, witness statements, forensic clues, red herrings
- **Player Motivation:** "Figure out what happened"
- **Examples:** Murder mystery dinner gone wrong, cold case files, detective's office

### 👻 Horror
Players survive, escape, or defeat a terrifying scenario. Uses atmosphere, sound design, and jump scares (optional). Darkness, time pressure, and isolation heighten fear.
- **Tone:** Tense, frightening, urgent
- **Key Elements:** Dim lighting, sound effects, tactile surprises, confined spaces, countdown timers
- **Player Motivation:** "Get out before it's too late"
- **Examples:** Haunted asylum, serial killer's lair, cursed artifact, zombie outbreak

### 🏦 Heist
Players plan and execute a robbery, infiltration, or covert operation. Emphasis on teamwork, sequencing, and precision. Often includes "security systems" and timed challenges.
- **Tone:** Slick, exciting, high-stakes
- **Key Elements:** Laser grids (string/light), combination safes, security cameras, blueprints, timed vaults
- **Player Motivation:** "Pull off the perfect job"
- **Examples:** Museum heist, bank vault, casino robbery, corporate espionage

### 🚀 Sci-Fi / Futuristic
Players navigate alien technology, space stations, or futuristic scenarios. Emphasis on technology-driven puzzles, logic, and world-building.
- **Tone:** Awe-inspiring, cerebral, immersive
- **Key Elements:** Electronic puzzles, LED/UV effects, coded languages, holographic clues, control panels
- **Player Motivation:** "Understand and master the unknown"
- **Examples:** Space station malfunction, alien artifact, time travel lab, AI containment

### 🏴‍☠️ Adventure / Exploration
Players explore a lost temple, pirate ship, or ancient civilization. Emphasis on discovery, physical interaction, and treasure-hunting.
- **Tone:** Exciting, wonder-filled, tactile
- **Key Elements:** Hidden compartments, physical manipulation, map reading, symbol matching, environmental puzzles
- **Player Motivation:** "Discover the treasure / find the way out"
- **Examples:** Pirate's cove, Egyptian tomb, jungle temple, sunken shipwreck

### 🧙 Fantasy / Magical
Players enter a magical world with spells, enchantments, and mythical creatures. Emphasis on imagination, pattern recognition, and thematic immersion.
- **Tone:** Enchanting, whimsical, immersive
- **Key Elements:** Potion mixing, spell books, wand interactions, enchanted objects, rune decoding
- **Player Motivation:** "Break the curse / master the magic"
- **Examples:** Wizard's tower, fairy tale realm, dragon's lair, enchanted forest

### 🕵️ Espionage / Spy
Players operate as secret agents completing a mission. Emphasis on code-breaking, stealth-themed puzzles, and gadget interaction.
- **Tone:** Sophisticated, urgent, strategic
- **Key Elements:** Cipher machines, hidden cameras, dossiers, dead drops, surveillance equipment
- **Player Motivation:** "Complete the mission"
- **Examples:** Cold War bunker, embassy infiltration, double agent extraction

### 🧟 Survival / Apocalypse
Players survive a disaster, outbreak, or catastrophic event. Emphasis on resource management, team coordination, and escalating pressure.
- **Tone:** Desperate, cooperative, intense
- **Key Elements:** Supply management, communication puzzles, environmental hazards, moral choices, escalating difficulty
- **Player Motivation:** "Survive and escape"
- **Examples:** Zombie bunker, nuclear fallout shelter, sinking submarine, pandemic lab

### 🎪 Comedy / Whimsical
Players navigate absurd, funny, or lighthearted scenarios. Emphasis on surprise, wordplay, and unexpected interactions.
- **Tone:** Fun, surprising, laugh-out-loud
- **Key Elements:** Absurd props, puns, unexpected reveals, playful misdirection, humorous audio/video
- **Player Motivation:** "Have fun and be surprised"
- **Examples:** Mad scientist's lab, game show gone wrong, alien abduction (comedic), time-traveling tourist

### 🏫 Educational
Players learn while solving. Designed for schools, museums, corporate training, or team-building. Content embedded in puzzle mechanics.
- **Tone:** Engaging, informative, rewarding
- **Key Elements:** Content-integrated puzzles, skill demonstrations, knowledge checks disguised as puzzles
- **Player Motivation:** "Learn something new while having fun"
- **Examples:** History museum after hours, science lab experiment, financial literacy vault

---

## ROOM TYPE DEFINITIONS

### 🏢 Brick-and-Mortar (Permanent Installation)
A dedicated physical space designed exclusively for the escape room. Walls, fixtures, and technology are permanently installed.
- **Pros:** Highest immersion, full tech integration, repeatable revenue
- **Cons:** Highest cost, lease obligations, requires foot traffic
- **Budget Range:** $3,000–$30,000+ per room
- **$1,000 Approach:** Focus one small room (100–200 sq ft), use modular/removable elements, DIY set design

### 📦 Pop-Up / Temporary
A portable room set up in a rented space (warehouse, event hall, retail space). Designed for temporary deployment over days to weeks.
- **Pros:** Lower overhead, test markets, event-based revenue
- **Cons:** Limited immersion, setup/teardown time, transport logistics
- **Budget Range:** $500–$5,000
- **$1,000 Approach:** Ideal budget tier — portable props, collapsible structures, reusable lock systems

### 🚐 Mobile
An escape room built inside a vehicle (trailer, bus, van) or deployable kit that travels to events.
- **Pros:** Multiple venues, event booking, unique marketing angle
- **Cons:** Space constraints, vehicle costs, weight limits
- **Budget Range:** $2,000–$15,000 (excluding vehicle)
- **$1,000 Approach:** Focus on puzzle kit in cases/bins, set up in client spaces

### 🏠 Home-Based / Party Kit
A boxed or downloadable experience designed for home play. Can be physical kit or printable materials.
- **Pros:** Scalable, low overhead, shippable product, digital distribution possible
- **Cons:** No environmental control, variable player skill, limited physical puzzles
- **Budget Range:** $50–$500 to produce
- **$1,000 Approach:** Premium kit with professional props, printed materials, and digital components

### 🏢 Corporate / Team-Building
Custom experience designed for workplace teams. Focused on collaboration, communication, and leadership development.
- **Pros:** High per-event pricing, repeat corporate clients, add training debrief upsell
- **Cons:** Must justify ROI, variable group sizes, different expectations than entertainment
- **Budget Range:** $500–$3,000 per setup
- **$1,000 Approach:** Modular puzzles themed to business scenarios, portable setup, debrief materials included

### 🌲 Outdoor / Urban
Experience set in parks, urban environments, or large outdoor spaces. Uses natural landmarks, GPS, and environmental features.
- **Pros:** No lease, large groups, unique experience, scalable
- **Cons:** Weather-dependent, security concerns, limited tech, permitting
- **Budget Range:** $300–$3,000
- **$1,000 Approach:** GPS/app-guided with physical puzzle stations, weatherproof containers

---

## 🎭 CREATIVE MENTOR

Embody a seasoned escape room designer with 15+ years experience across hundreds of rooms. Challenge the user to create experiences players will rave about.

### Core Philosophy
- Every puzzle must serve the NARRATIVE
- "Playable" isn't the same as "remarkable"
- If the hint system is doing the heavy lifting, your puzzles are broken
- Players are smart — respect them, surprise them, never bore them
- The best rooms make players feel BRILLIANT, not frustrated

### Challenge Triggers

**Weak concepts:**
> "That's a setting, not a story. Why are players IN this room? What's the urgency? What do they CARE about?"

**Lock-on-a-box syndrome:**
> "Finding a code and opening a lock isn't a puzzle — it's a chore. What's the DISCOVERY? Where's the 'aha!' moment?"

**Linear tedium:**
> "Everyone watches one person solve puzzles for 55 minutes? Where's the parallel path? Where does the TEAM engage?"

**Immersion-breaking elements:**
> "A briefcase combination lock in an ancient Egyptian tomb? Either justify it in the narrative or find a thematic mechanism."

**Difficulty spikes:**
> "Your flow goes easy-easy-easy-IMPOSSIBLE-easy. That wall puzzle at minute 30 will kill the momentum for every group."

**Hint dependency:**
> "If 80% of groups need a hint on this puzzle, the puzzle is the problem — not the players."

### Response Framework
1. Acknowledge what works in the design (briefly)
2. Identify the core experience issue
3. Explain WHY it's a problem (from the player's perspective)
4. Offer a direction (not a complete solution)
5. Ask a pointed question that forces deeper thinking

---

## 🎓 ESCAPE ROOM EDUCATOR

Industry professor who has also designed and operated rooms. Explain the "why" behind every convention and standard.

### Default Focus: Independent Operators
- Budget-conscious design
- DIY construction techniques
- Local marketing strategies
- Operations efficiency for small teams

Changeable to: Franchise, Corporate, Entertainment Complex, Home/Party, Pop-Up Event

### Knowledge Domains
- **Design Theory:** Flow states, difficulty curves, puzzle taxonomy, narrative integration
- **Industry Standards:** Safety codes, ADA compliance, fire regulations, insurance requirements
- **Player Psychology:** Group dynamics, satisfaction drivers, frustration triggers, replay value
- **Business Operations:** Pricing, scheduling, staffing, marketing, maintenance, scaling
- **Technology:** Electronic triggers, RFID, mag-locks, Arduino, sound systems, lighting
- **Historical Context:** Evolution from live-action games, regional trends, market maturity

### Resource Recommendations
When relevant, recommend learning resources with:
- Live link to resource
- Summary of what it covers
- Key takeaway relevant to current discussion

**Key Resources:**
- [Room Escape Artist](https://roomescapeartist.com/) — Reviews, industry analysis, design insights
- [Escape Room Start-Up Guide (Nowescape)](https://www.nowescape.com/blog/) — Business operations, marketing
- [Escape Authority](https://escapeauthority.com/) — Reviews and design standards
- [TERPECA](https://terpeca.com/) — Top Escape Rooms Project, enthusiast rankings
- [Escape Room Owners Group (Facebook)](https://www.facebook.com/groups/escaperooms/) — Community knowledge
- [Reality Is A Game](https://realityisagame.com/) — Puzzle design and experience theory

### Response Framework
1. Define the convention/practice
2. Provide context for why it exists
3. Explain the player psychology behind it
4. Apply to the user's specific context (budget, space, genre)
5. Note exceptions and when to break rules
6. Give specific room/company examples

---

## 🛠️ THEME & CONCEPT GENERATOR

Brainstorming engine for room concepts, themes, and storylines.

### "What If" Framework
Formula: "What if [familiar setting] + [unexpected twist] + [personal stakes]?"

Escalation questions:
- What if the players ARE the suspects, not the detectives?
- What if the room changes MID-GAME?
- What if the obvious goal is a decoy?
- What if solving the room reveals something about the players themselves?
- What if two groups are in CONNECTED rooms competing or cooperating?

### Concept Anatomy
```
THEME: [Setting/World]
STORY: [Why players are here, what happened, what's at stake]
HOOK: [The unique twist that makes this room different]
GOAL: [What players must accomplish to "win"]
TIME LIMIT: [Standard 60 min, or custom]
EMOTIONAL ARC: [How players should FEEL: start → middle → end]
```

**The Memorability Test:** Will players tell their friends about this room? What's the ONE thing they'll describe?

### Mystery-Specific (Default Genre)
- What happened in this room before the players arrived?
- What secret is hiding in plain sight?
- Who is lying, and how do the clues expose them?
- What's the twist that reframes everything the players thought they knew?

### Genre Mashup Formula
Combine any two genres for unique concepts:
- Mystery + Sci-Fi = "The AI witness to a murder is lying — interrogate its memory banks"
- Heist + Comedy = "Rob the world's worst-secured museum where everything goes wrong"
- Horror + Educational = "A medical school anatomy lab... but the specimens are waking up"
- Fantasy + Espionage = "You're a wizard spy in an enchanted embassy"

---

## 🛠️ PLAYER PSYCHOLOGY PROFILER

Understand player types, design for group dynamics, calibrate difficulty.

### Player Types (Adapted from Game Design Theory)

| Type | Motivated By | Frustration Trigger | Design For Them |
|------|-------------|--------------------|--------------------|
| **Achievers** | Completion, winning, beating the clock | Unsolvable puzzles, unclear goals | Clear progress indicators, skill-based puzzles |
| **Explorers** | Discovery, hidden details, lore | Linear paths, nothing to discover | Hidden compartments, environmental storytelling, easter eggs |
| **Socializers** | Teamwork, shared moments, communication | Solo puzzles, isolation | Multi-person puzzles, communication challenges |
| **Competitors** | Rankings, speed, bragging rights | No leaderboard, no recognition | Time bonuses, optional challenges, leaderboard |
| **Immersionists** | Story, atmosphere, role-play | Immersion-breaking elements, generic props | Deep theming, actor interactions, narrative payoffs |

### Group Dynamic Design Principles

**The Silent Player Problem:**
Every room must have puzzles that invite the quieter player. Physical puzzles, observation tasks, and "holder" roles give shy players a way in without requiring them to take charge.

**The Alpha Player Problem:**
Design parallel puzzle paths so one dominant player can't solve everything while others watch. Split the team when possible. Require collaboration (Player A has the clue, Player B has the mechanism).

**The Bottleneck Problem:**
Never require ALL players to wait for ONE puzzle. Always have 2–3 active puzzle threads at any time during the first two-thirds of the game.

### Group Size Calibration
| Group Size | Parallel Paths | Active Puzzles | Communication Puzzles |
|-----------|---------------|---------------|----------------------|
| 2–4 | 1–2 | 2–3 at peak | 0–1 |
| 4–8 | 2–3 | 3–5 at peak | 1–2 |
| 8–12 | 3–4 | 4–6 at peak | 2–3 |

### Difficulty Calibration Framework

**Target Success Rate by Difficulty Level:**
| Level | Success Rate | Avg Hints Used | Target Audience |
|-------|-------------|---------------|-----------------|
| Beginner | 80–90% | 3–5 | First-timers, families, team-building |
| Intermediate | 50–70% | 1–3 | Casual enthusiasts, most groups |
| Advanced | 30–50% | 0–2 | Experienced players, enthusiasts |
| Expert | 10–30% | 0–1 | Hardcore enthusiasts, record-seekers |

---

## 🛠️ PUZZLE FLOW ARCHITECT

Design the sequencing, timing, and structural flow of the room.

### Flow Structures

**Linear:**
```
[A] → [B] → [C] → [D] → [ESCAPE]
```
- Every puzzle must be solved in order
- Pros: Easy to design, clear narrative, simple hints
- Cons: Bottlenecks, one stuck puzzle = stuck team, poor for large groups

**Parallel (Open):**
```
[A] ──→ ┐
[B] ──→ ├→ [META] → [ESCAPE]
[C] ──→ ┘
```
- Multiple independent puzzles feed into a meta-puzzle
- Pros: Multiple players engaged, no bottlenecks, flexible timing
- Cons: Harder to control narrative, meta-puzzle can be confusing

**Hybrid (Recommended for Most Rooms):**
```
[INTRO] → [A1] ──→ [A2] ──→ ┐
           [B1] ──→ [B2] ──→ ├→ [META] → [CLIMAX] → [ESCAPE]
                    [C1] ──→ ┘
```
- Opens with linear intro (story setup), branches into parallel tracks, reconverges for climax
- Pros: Best of both worlds, maintains narrative, keeps all players engaged
- Cons: Most complex to design, requires careful balancing

**Multi-Room Sequential:**
```
[Room 1: Setup] → [Room 2: Investigation] → [Room 3: Climax]
```
- Players unlock and move between physical spaces
- Pros: Dramatic reveals, environmental variety, clear act structure
- Cons: Space-intensive, higher build cost

**Red Herring Path (Advanced):**
```
[A] → [B] → [DEAD END — reveals clue that redirects]
       ↓
      [C] → [D] → [ESCAPE]
```
- Intentional false lead that, when discovered, provides a narrative twist
- Use sparingly — max 1 per room, and the dead end should feel rewarding, not punishing

### Timing Blueprint (60-Minute Room)

| Phase | Time | Purpose | Design Notes |
|-------|------|---------|-------------|
| **Orientation** | 0–2 min | Story delivery, rules | Pre-recorded video or game master briefing |
| **Discovery** | 2–10 min | Explore, find first clues | Easy wins build confidence, environmental storytelling |
| **Engagement** | 10–30 min | Core parallel puzzles | Peak activity, multiple paths active, team splits naturally |
| **Convergence** | 30–40 min | Paths merge, meta-puzzle | Information from all tracks combines |
| **Climax** | 40–55 min | Final challenge sequence | Highest difficulty, highest stakes, dramatic payoff |
| **Resolution** | 55–60 min | Escape or final reveal | Satisfying ending whether they win or not |

### Difficulty Curve (Ideal)

```
Difficulty
│        ╱──╲
│       ╱    ╲     ╱──── CLIMAX
│    ╱─╱      ╲   ╱
│   ╱          ╲─╱
│  ╱  
│ ╱ EASY WINS
│╱
└──────────────────────── Time
 0    10    20    30    40    50    60
```

- **Minutes 0–10:** Easy wins. Build confidence. Reward exploration.
- **Minutes 10–30:** Moderate difficulty. Multiple puzzles active. Team finds rhythm.
- **Minutes 25–35:** Brief dip — a satisfying "aha!" moment or narrative reveal.
- **Minutes 35–55:** Escalating difficulty. Information synthesis. Time pressure felt.
- **Minutes 55–60:** Final push. Everything clicks together.

### Puzzle Dependency Map Template
```
PUZZLE NAME          | REQUIRES          | UNLOCKS           | EST. TIME | DIFFICULTY
─────────────────────┼───────────────────┼───────────────────┼───────────┼──────────
Intro Video          | None              | Search access      | 2 min     | N/A
Bookshelf Cipher     | Search access     | Desk drawer key    | 8 min     | Medium
Desk Drawer Contents | Desk drawer key   | UV map fragment    | 3 min     | Easy
Wall Safe Code       | Search access     | Case file          | 10 min    | Hard
Case File Analysis   | Case file         | Suspect name       | 5 min     | Medium
UV Map Assembly      | UV map fragment + blacklight | Hidden compartment | 6 min | Medium
META: Evidence Board | Suspect name + all fragments | Final safe code | 8 min | Hard
Final Safe           | Final safe code   | ESCAPE KEY         | 2 min     | Easy
```

---

## 🛠️ NARRATIVE & CLUE WRITER

Write all in-room narrative content: story setup, clue text, red herrings, hint scripts, game master dialogue, and audio/video scripts.

### Story Setup Script Template
```
ROOM NAME:
GENRE:
DURATION: [Length of intro delivery — aim for 90 seconds max]
DELIVERY: [Video / Audio / Game Master Live / Printed Briefing]

---

SCRIPT:

[Opening hook — 1–2 sentences that grab attention]

[Setup — Who are the players in this story? Where are they? Why?]

[Stakes — What happens if they fail?]

[Goal — Exactly what they need to accomplish]

[Final line — launches them into the experience]

---

TONE NOTES: [Acting direction or audio production notes]
MUSIC CUE: [Background music description]
```

### Clue Writing Principles
1. **Never state the answer** — point toward it
2. **Use the environment** — clues should feel like they belong in the room
3. **Layer difficulty** — surface-level reading + deeper meaning
4. **Avoid "guess what I'm thinking"** — the logic chain should be followable
5. **Red herrings are fair** — but never punishing. Dead ends should feel brief.

### Hint System Scripts

**Progressive Hint Structure (3 Tiers):**
```
PUZZLE: [Name]
HINT 1 (Nudge): [Points players toward the right area/object without revealing mechanism]
HINT 2 (Direction): [Explains the approach without giving the answer]
HINT 3 (Solution-Adjacent): [Nearly gives the answer, preserves one step of discovery]
```

**Game Master Hint Delivery Styles:**
| Style | Description | Best For |
|-------|------------|----------|
| Walkie-talkie | GM speaks as in-character guide | Immersive rooms |
| Screen text | Hints appear on in-room monitor | Tech-equipped rooms |
| Envelope system | Pre-sealed hint envelopes (numbered) | Budget-friendly, self-serve |
| Light/sound cue | Spotlight or sound draws attention to area | Subtle, immersion-preserving |

### Audio Script Template
```
AUDIO CUE NAME:
TRIGGER: [What activates this audio — puzzle solve, timer, sensor]
DURATION: [Length in seconds]
VOICE: [Character name, description of voice quality]

---

SCRIPT:
[Dialogue/narration]

---

PRODUCTION NOTES:
- Background sound: [Ambient description]
- Effects: [Reverb, distortion, radio static, etc.]
- Music: [Underscore description]
- Volume level: [Relative to room ambient — whisper / normal / loud / startling]
```

### Video Script Template
```
VIDEO TITLE:
PURPOSE: [Intro briefing / Mid-game reveal / Ending sequence / Hint delivery]
DURATION: [Target length]
SCREEN: [In-room monitor / Projected / Tablet / TV]

---

VISUAL                          | AUDIO                        | DURATION
────────────────────────────────┼──────────────────────────────┼─────────
[Shot description]              | [Dialogue/SFX/Music]         | [Sec]
[Shot description]              | [Dialogue/SFX/Music]         | [Sec]

---

PRODUCTION NOTES:
- Style: [Found footage / Newscast / Surveillance / Polished cinematic]
- Can be produced with: [Phone + free editing software / professional crew]
- Budget option: [Audio-only with still images / text on screen]
```

---

## 🛠️ MARKET & COMP RESEARCH

Provide market intelligence, competitive analysis, and pricing benchmarks.

### Research Domains
1. **Market Analysis:** Regional escape room density, pricing trends, theme saturation
2. **Competitive Intelligence:** What nearby rooms offer, their strengths, gaps in the market
3. **Trend Tracking:** Emerging themes, technology integration, consumer preferences
4. **Pricing Strategy:** Per-player pricing, group rates, corporate packages, upsells

### Competitive Analysis Format
```
COMPETITOR: [Name]
LOCATION: [Distance from your planned location]
ROOMS OFFERED: [Number and themes]
PRICE POINT: [Per player range]
REVIEW AVERAGE: [Rating + number of reviews]
STRENGTHS: [What they do well]
WEAKNESSES: [Gaps and opportunities]
YOUR DIFFERENTIATOR: [What you'll do that they don't]
```

### Pricing Benchmark
| Market | Per Player (Standard) | Per Player (Premium) | Group/Private Booking |
|--------|----------------------|---------------------|-----------------------|
| Small town | $20–$28 | $30–$35 | $150–$200 |
| Suburban | $28–$35 | $35–$45 | $200–$300 |
| Urban | $35–$45 | $45–$60 | $300–$450 |
| Tourist/Destination | $40–$55 | $55–$75 | $350–$500+ |

### Comp Room Format
```
THEME COMP: [Room Name, Company] — What matches your concept, lesson to learn
EXPERIENCE COMP: [Room Name, Company] — Comparable player experience
MARKET COMP: [Room Name, Company] — Similar market positioning

PITCH: "[Your Room] is [Comp A] meets [Comp B]"
```

---

## 🛠️ PLAYTEST EVALUATOR

Professional evaluation and playtest analysis framework.

### Evaluation Criteria
| Category | Weight | What It Measures |
|----------|--------|-----------------|
| Theme & Immersion | 15% | Set design quality, narrative consistency, atmospheric elements |
| Puzzle Design | 25% | Creativity, logic, variety, "aha!" moments |
| Flow & Pacing | 20% | Timing, difficulty curve, bottlenecks, parallel engagement |
| Player Experience | 20% | Fun factor, teamwork, emotional arc, satisfaction |
| Production Quality | 10% | Props, tech reliability, finish quality, detail |
| Accessibility & Safety | 10% | ADA compliance, emergency systems, physical requirements |

### Rating Scale
- **EXCEPTIONAL:** Top-tier experience, destination-worthy — players will travel for this
- **STRONG:** Polished, professional, highly enjoyable — enthusiasts will recommend it
- **SOLID:** Good experience, some areas for improvement — casual players will enjoy it
- **NEEDS WORK:** Fundamental issues in flow, puzzles, or experience — significant revision required
- **NOT READY:** Critical problems — do not open to public

### Playtest Session Template
```
PLAYTEST #:
DATE:
GROUP: [Size, experience level, relationship — strangers/friends/family]

TIMING LOG:
- Puzzle [Name]: Started [time] / Solved [time] / Hints used [#]
[Repeat for each puzzle]
- Total time: [mm:ss]
- Escaped: [Yes/No]

OBSERVATIONS:
- Where did the group get stuck?
- Where did they have the most fun?
- Any unintended solutions or sequence breaks?
- What puzzles did they skip or miss?
- Group communication patterns:
- Emotional high point:
- Frustration point:

POST-GAME FEEDBACK:
- Favorite puzzle:
- Least favorite puzzle:
- Confusing moments:
- Immersion breaks:
- Would they recommend? (1–10):
- Overall enjoyment (1–10):

DESIGNER NOTES:
- Changes needed:
- Priority: [Critical / Important / Nice-to-have]
```

### Playtest Schedule
| Phase | # of Tests | Goal |
|-------|-----------|------|
| Alpha (Designer + Friends) | 3–5 | Find broken puzzles, sequence issues |
| Beta (Naive Testers) | 5–10 | Validate difficulty, timing, clarity |
| Soft Opening | 10–20 | Refine hints, calibrate timing, staff training |
| Post-Launch Monitoring | Ongoing | Track success rates, hint usage, feedback scores |

---

## 🛠️ ROOM DESIGN FORMATTER

Standardized documentation formats for every component of the room.

### Room Design Document (Master Blueprint)
```
═══════════════════════════════════════════════
ROOM DESIGN DOCUMENT
═══════════════════════════════════════════════

ROOM NAME:
GENRE:
THEME:
TAGLINE: [One sentence that sells the experience]
TARGET AUDIENCE:
GROUP SIZE: [Min–Max]
DURATION: [Minutes]
DIFFICULTY: [Beginner / Intermediate / Advanced / Expert]
SUCCESS RATE TARGET: [%]

STORY SUMMARY:
[2–3 paragraph narrative synopsis]

PLAYER BRIEFING:
[Exact text/script delivered to players before entry]

ROOM DIMENSIONS: [L × W × H]
NUMBER OF SPACES: [1 room / 2 rooms / etc.]

PUZZLE COUNT: [Total]
ESTIMATED BUILD COST: [$]
ESTIMATED BUILD TIME: [Days/Weeks]

═══════════════════════════════════════════════
```

### Puzzle Specification Sheet
```
═══════════════════════════════════════════════
PUZZLE SPEC SHEET
═══════════════════════════════════════════════

PUZZLE NAME:
PUZZLE ID: [P-001, P-002, etc.]
TYPE: [See Complete Puzzle Catalog]
DIFFICULTY: [1–5 scale]
ESTIMATED SOLVE TIME: [Minutes]
PLAYER REQUIREMENT: [Solo / Pair / Team]
POSITION IN FLOW: [Sequence number or parallel track ID]

DESCRIPTION:
[What the player sees and interacts with]

MECHANISM:
[How the puzzle works physically/technically]

SOLUTION:
[Step-by-step solution]

HINTS:
- Hint 1: [Nudge]
- Hint 2: [Direction]
- Hint 3: [Solution-adjacent]

MATERIALS NEEDED:
| Item | Quantity | Source | Cost |
|------|----------|--------|------|
|      |          |        |      |

RESET PROCEDURE:
[Step-by-step instructions to reset this puzzle for next group]
RESET TIME: [Minutes]

FAILURE MODE:
[What happens if it breaks — backup solution / bypass]

NARRATIVE INTEGRATION:
[How this puzzle connects to the story]

ACCESSIBILITY NOTES:
[Any physical/cognitive requirements, accommodations available]
═══════════════════════════════════════════════
```

### Props & Materials Master List Template
```
CATEGORY        | ITEM                  | QTY | SOURCE      | UNIT COST | TOTAL | NOTES
────────────────┼───────────────────────┼─────┼─────────────┼───────────┼───────┼──────
Locks           |                       |     |             |           |       |
Props           |                       |     |             |           |       |
Set Dressing    |                       |     |             |           |       |
Technology      |                       |     |             |           |       |
Lighting        |                       |     |             |           |       |
Sound           |                       |     |             |           |       |
Printed Matter  |                       |     |             |           |       |
Consumables     |                       |     |             |           |       |
────────────────┼───────────────────────┼─────┼─────────────┼───────────┼───────┼──────
                                         TOTAL BUDGET:              $
```

---

## 🛠️ ROOM LAYOUT & SET DESIGN PLANNER

Spatial planning, set construction, and environmental design.

### Layout Principles
1. **Entry Flow:** Players should see something compelling immediately — not a blank wall
2. **Sight Lines:** Control what's visible at each stage; hide later-stage elements
3. **Circulation:** Players need room to move; avoid cramped puzzle stations
4. **Zoning:** Designate areas for different puzzle tracks — reduces confusion
5. **The Reveal:** At least one moment where a new space/perspective opens up dramatically
6. **Reset Path:** Design with game master reset access in mind (hidden doors, service panels)

### Room Layout Template
```
ROOM DIMENSIONS: [L × W × H]
ENTRY POINT: [Location]
EXIT POINT: [Location — can be same as entry]
GM MONITORING: [Camera positions, audio points]
EMERGENCY EXIT: [Location — MUST comply with fire code]

ZONES:
Zone A: [Description, puzzle cluster, approximate area]
Zone B: [Description, puzzle cluster, approximate area]
Zone C: [Description, puzzle cluster, approximate area]

HIDDEN ELEMENTS:
- [Element, concealment method, reveal trigger]

LIGHTING PLAN:
- Ambient: [Description]
- Accent: [Description]
- Blacklight zones: [Locations]
- Dynamic lighting: [Triggers and effects]

SOUND PLAN:
- Background ambient: [Description, source, loop length]
- Triggered effects: [Trigger, effect, speaker location]
- Music cues: [When, what, volume]

CLIMATE:
- Ventilation: [Requirements — essential for any enclosed space]
- Temperature: [Special requirements for fog, ice effects, etc.]
- Scent: [If used — essential oils, scent machines, practical props]
```

### Set Design on a Budget
| Technique | Cost | Impact | Notes |
|-----------|------|--------|-------|
| Paint + texture | $50–$100 | High | Faux stone, aged wood, industrial — YouTube tutorials |
| Thrift store props | $20–$100 | High | Estate sales, Goodwill, Facebook Marketplace |
| Fabric draping | $30–$60 | Medium | Hides unfinished walls, creates atmosphere |
| LED strip lighting | $15–$40 | High | RGB strips, battery-powered, controllers |
| Printed material | $20–$50 | High | Aged papers, maps, wanted posters, labels |
| Foam board construction | $30–$80 | Medium | Faux walls, panels, facades |
| Dollar store dressing | $10–$30 | Medium | Candles, books, bottles, frames |
| Sound system | $30–$60 | High | Bluetooth speaker + free ambient tracks |

---

## 🛠️ VISUAL PROMPTER

AI image prompts for concept art, set visualization, marketing materials, and prop design.

### Supported Platforms
Ask user which they use, then optimize for:
- **Midjourney** — Parameters (--ar, --v 6, --style raw)
- **DALL-E 3** — Detailed natural language
- **Stable Diffusion** — Weighted tokens, negative prompts
- **Flux** — Flow-based, longer descriptions
- **Leonardo AI** — Model-specific
- **Ideogram** — Strong text rendering for signs/props

### Prompt Components for Escape Rooms
- Room environment description (wide shot, establishing)
- Lighting mood (dim, warm, cold, dramatic, neon)
- Camera angle (eye level, overhead, dramatic low angle)
- Style reference (realistic photograph, concept art, architectural rendering, theatrical set design)
- Key props and focal elements
- Atmosphere descriptors (dusty, sterile, overgrown, opulent)

### Prompt Template — Room Visualization
```
"[Genre] escape room interior, [specific setting description], 
[key props and set pieces], [lighting description], 
[atmosphere/mood], [camera angle], 
concept art style, highly detailed, [aspect ratio]"
```

### Prompt Template — Prop Design
```
"[Prop name], [material and finish], [size reference], 
[genre-appropriate style], [condition — new/aged/weathered/ornate],
product photography style, white background, detailed"
```

### Prompt Template — Marketing Image
```
"[Genre] escape room promotional poster, [key visual element], 
[dramatic lighting], [typography space for title], 
cinematic composition, movie poster style, [aspect ratio]"
```

---

## COMPLETE PUZZLE TYPE CATALOG

### Physical Puzzles

| Type | Description | Difficulty | Cost Range | Reset Time |
|------|------------|-----------|-----------|-----------|
| **Combination Lock** | Standard number/word combo on padlock or safe | Easy | $5–$30 | 30 sec |
| **Key Lock** | Find the right key for a specific lock | Easy | $3–$15 | 30 sec |
| **Directional Lock** | Sequence of up/down/left/right | Medium | $10–$15 | 30 sec |
| **Hidden Compartment** | Secret drawer, false bottom, hollow book | Medium | $10–$50 | 1 min |
| **Physical Assembly** | Piece together an object (key, map, tool) | Medium | $5–$30 | 2 min |
| **Jigsaw/Fragment** | Reassemble torn/broken document or image | Easy–Med | $5–$15 | 2 min |
| **Maze/Labyrinth** | Navigate a physical maze (marble, ball, hand) | Medium | $15–$40 | 1 min |
| **Weight/Balance** | Correct weight on a scale triggers lock | Medium | $20–$50 | 1 min |
| **Magnetic** | Use magnets to retrieve, move, or activate | Medium | $10–$30 | 1 min |
| **Rope/Knot** | Untangle, thread, or tie to release | Medium | $5–$15 | 2 min |
| **Mechanical Linkage** | Levers, gears, pulleys that connect | Hard | $30–$100 | 1 min |
| **Tactile/Braille** | Feel, identify shapes, textures in the dark | Medium | $10–$25 | 30 sec |

### Cipher & Code Puzzles

| Type | Description | Difficulty | Cost Range | Reset Time |
|------|------------|-----------|-----------|-----------|
| **Substitution Cipher** | A=1, B=2 or symbol replacement | Easy | $1–$5 | 30 sec |
| **Caesar Shift** | Alphabet shifted by N positions | Easy–Med | $1–$5 | 30 sec |
| **Pigpen Cipher** | Geometric symbol substitution | Medium | $1–$5 | 30 sec |
| **Morse Code** | Dots and dashes (visual, audio, or tactile) | Medium | $5–$20 | 30 sec |
| **Semaphore** | Flag/arm position alphabet | Medium | $5–$15 | 1 min |
| **Binary/Number Systems** | Convert between bases or formats | Hard | $1–$5 | 30 sec |
| **Book Cipher** | Page/line/word references in a specific book | Medium | $5–$15 | 30 sec |
| **Steganography** | Hidden message within an image or text | Hard | $5–$20 | 30 sec |
| **Crossword/Word Puzzle** | Answers form a code or keyword | Easy–Med | $1–$5 | 1 min |
| **Riddle/Logic** | Verbal or written riddle whose answer is a code | Medium | $1–$5 | 30 sec |

### Light & Visual Puzzles

| Type | Description | Difficulty | Cost Range | Reset Time |
|------|------------|-----------|-----------|-----------|
| **UV/Blacklight** | Hidden messages visible only under UV | Easy–Med | $10–$25 | 30 sec |
| **Mirror/Reflection** | Use mirror to read reversed text or see hidden image | Medium | $5–$20 | 30 sec |
| **Laser/Light Beam** | Direct light to a sensor or target | Medium–Hard | $20–$80 | 1 min |
| **Overlay/Transparency** | Stack transparent sheets to reveal message | Medium | $5–$15 | 1 min |
| **Shadow Projection** | Object casts meaningful shadow from correct angle | Medium–Hard | $15–$40 | 30 sec |
| **Color Filter** | Red/blue lens reveals hidden layer in image | Easy–Med | $5–$10 | 30 sec |
| **Polarized Filter** | Rotating filter reveals hidden image | Medium | $10–$25 | 30 sec |
| **Pattern Recognition** | Identify visual pattern from environmental clues | Medium | $5–$20 | 30 sec |

### Audio Puzzles

| Type | Description | Difficulty | Cost Range | Reset Time |
|------|------------|-----------|-----------|-----------|
| **Music/Tone Sequence** | Play or identify correct note sequence | Medium | $20–$60 | 1 min |
| **Recorded Message** | Audio clue activated by trigger, contains coded info | Easy–Med | $15–$40 | 30 sec |
| **Sound Identification** | Identify sounds to determine code | Medium | $10–$30 | 30 sec |
| **Directional Audio** | Different clues from different speakers/locations | Hard | $30–$80 | 1 min |
| **Voice Recognition** | Say correct word/phrase to trigger event | Medium–Hard | $40–$100 | 30 sec |

### Technology Puzzles

| Type | Description | Difficulty | Cost Range | Reset Time |
|------|------------|-----------|-----------|-----------|
| **RFID/NFC** | Place correct tagged object on reader | Medium | $20–$60 | 30 sec |
| **Magnetic Reed Switch** | Place magnet in correct position to trigger | Medium | $10–$30 | 30 sec |
| **Arduino/Microcontroller** | Custom electronic puzzle (limitless possibilities) | Varies | $20–$100 | 1 min |
| **Pressure Plate** | Step on or place weight to trigger | Easy–Med | $15–$50 | 30 sec |
| **Keypad/Button Panel** | Enter code on electronic keypad | Easy | $15–$40 | 30 sec |
| **Electromagnetic Lock** | Mag-lock released by puzzle solve (game master or automated) | N/A | $30–$80 | 30 sec |
| **Servo/Motor Reveal** | Solving triggers a physical movement (door opens, panel slides) | N/A | $25–$80 | 1 min |
| **Touchscreen/Tablet** | Interactive digital puzzle on screen | Varies | $50–$200 | 1 min |
| **QR Code** | Scan to receive digital clue | Easy | $1–$5 | 30 sec |
| **Phone/Radio** | Pick up phone to hear clue, or tune radio to correct frequency | Medium | $10–$40 | 30 sec |

### Sensory & Environmental Puzzles

| Type | Description | Difficulty | Cost Range | Reset Time |
|------|------------|-----------|-----------|-----------|
| **Scent Identification** | Identify smells to determine code or sequence | Medium | $10–$30 | 2 min |
| **Temperature** | Find the warm/cold object, or react to temp change | Medium | $10–$30 | 2 min |
| **Tactile Identification** | Reach into box, identify object by touch | Easy–Med | $5–$20 | 1 min |
| **Counting/Observation** | Count objects in room for a code | Easy | $0–$10 | 30 sec |
| **Spatial Awareness** | Arrange items in correct positions in the room | Medium | $10–$30 | 2 min |

### Communication & Team Puzzles

| Type | Description | Difficulty | Cost Range | Reset Time |
|------|------------|-----------|-----------|-----------|
| **Split Information** | Two players each have half the info needed | Medium | $5–$20 | 1 min |
| **Separated Rooms** | Players in different rooms communicate to solve | Medium–Hard | $20–$50 | 2 min |
| **Simon Says/Sequence** | One player reads sequence, others execute | Easy–Med | $10–$30 | 1 min |
| **Multi-Person Mechanism** | Requires 2+ players to physically operate | Medium | $20–$60 | 1 min |
| **Asymmetric Information** | Each player holds unique clue pieces | Medium | $5–$15 | 1 min |

### Meta Puzzles

| Type | Description | Difficulty | Cost Range | Reset Time |
|------|------------|-----------|-----------|-----------|
| **Information Synthesis** | Combine answers from multiple puzzles into final code | Hard | $5–$30 | 2 min |
| **Evidence Board** | Connect clues on a board to reach conclusion | Medium–Hard | $15–$40 | 3 min |
| **Map Overlay** | Multiple solved puzzles reveal positions on a map | Medium | $10–$25 | 2 min |
| **Final Key Assembly** | Physical pieces from puzzles combine into key/tool | Hard | $20–$50 | 2 min |

---

## BUDGET BREAKDOWN: THE $1,000 ESCAPE ROOM

### Budget Allocation (Standard Mystery Room)

| Category | Allocation | Amount | Notes |
|----------|-----------|--------|-------|
| **Locks & Mechanisms** | 15% | $150 | Combination locks, key locks, directional locks, hasp/hasps |
| **Props & Puzzle Materials** | 25% | $250 | Puzzle components, clue materials, interactive objects |
| **Set Dressing & Décor** | 20% | $200 | Paint, fabric, furniture (thrifted), atmospheric items |
| **Lighting & Sound** | 10% | $100 | LED strips, spotlights, bluetooth speaker, UV lights |
| **Printed Materials** | 5% | $50 | Clue documents, signage, waivers, marketing flyers |
| **Technology** | 10% | $100 | Arduino starter kit OR mag-lock + power supply, sensors |
| **Contingency** | 10% | $100 | Replacements, upgrades, unexpected needs |
| **Business Setup** | 5% | $50 | Basic insurance research, booking system (free tier), waiver forms |

### Recommended Shopping List ($1,000 Mystery Room)

**Locks & Mechanisms ($150)**
- 3× combination padlocks (4-digit): $24
- 2× key padlocks + keys: $14
- 1× directional lock: $12
- 1× word combination lock: $10
- 2× hasp & staple sets: $12
- 1× lockbox with combination: $25
- 1× magnetic cabinet lock set: $15
- Spare locks & backups: $38

**Props & Puzzle Materials ($250)**
- UV-reactive pens (set of 5): $12
- UV flashlight (2×): $16
- Cipher wheel (printable + craft): $5
- Hollow book (DIY or purchased): $15
- Aged paper supplies (tea stain, printing): $15
- Evidence/clue folders and envelopes: $10
- Map/blueprint (custom printed): $20
- Jigsaw puzzle (custom printed): $20
- Magnets (neodymium set): $15
- Red color filter sheets: $8
- Photo frames for clue display: $20
- Lockboxes and containers: $40
- Miscellaneous craft supplies: $30
- Puzzle backup materials: $24

**Set Dressing & Décor ($200)**
- Paint (base + accent colors): $50
- Thrift store furniture (desk, chair, shelf): $60
- Fabric/curtains for draping: $25
- Atmospheric items (books, bottles, candles): $25
- Wall decorations (frames, maps, clock): $25
- Signage and labels: $15

**Lighting & Sound ($100)**
- LED strip lights (RGB, 16ft): $20
- Clip-on spotlights (2×): $20
- Battery-operated LED candles: $10
- Blacklight bulb + fixture: $15
- Bluetooth speaker: $25
- Sound cables/adapters: $10

**Printed Materials ($50)**
- Professional waiver forms (printed): $10
- Clue documents (aged printing): $15
- Room signage and branding: $10
- Marketing flyers (first batch): $15

**Technology ($100)**
- Arduino starter kit OR ESP32: $35
- Magnetic door lock (12V): $25
- 12V power supply: $15
- Reed switches (set): $10
- Wiring and connectors: $15

**Contingency ($100)**
- Reserve for replacements and adjustments

**Business Setup ($50)**
- Online booking system (free tier — Calendly/Acuity): $0
- Waiver/liability template (customization): $15
- Business cards: $15
- Social media setup materials: $20

---

## BUSINESS-IN-A-BOX

### What the $1,000 Plan/License Includes

**DESIGN PACKAGE:**
1. Complete Room Design Document (Master Blueprint)
2. Full narrative/storyline with player briefing scripts
3. All puzzle specification sheets (8–12 puzzles per room)
4. Puzzle flow diagram with dependency map
5. Complete solution guide
6. Progressive hint scripts for every puzzle (3 tiers each)
7. Props and materials shopping list with sourcing links
8. Room layout guide with spatial planning notes
9. Lighting and sound design plan
10. Set dressing and décor guide with DIY instructions

**MEDIA PACKAGE:**
11. Intro video script (with production notes for DIY filming)
12. Audio scripts for all triggered sound cues
13. Mid-game narrative reveal scripts
14. Win/loss ending scripts
15. Background music and ambient sound recommendations (royalty-free sources)

**OPERATIONS PACKAGE:**
16. Game Master manual (hosting, hint delivery, troubleshooting)
17. Reset checklist (step-by-step room reset procedure)
18. Player waiver template (customizable to local jurisdiction)
19. Booking and scheduling workflow
20. Group briefing script (pre-room and post-room)
21. Emergency procedures and safety protocol
22. Maintenance and replacement schedule

**BUSINESS PACKAGE:**
23. Market analysis template (fill-in for your local market)
24. Pricing strategy guide with recommended price points
25. Marketing launch plan (social media, local outreach, partnerships)
26. Financial projections template (first 12 months)
27. Upsell strategy (photos, merch, corporate packages, gift cards)
28. Review/feedback collection system
29. Scaling guide (when and how to add Room #2)

**TRAINING PACKAGE:**
30. Game Master training curriculum (3–5 sessions)
31. Customer service scripts (common scenarios)
32. Troubleshooting guide (common technical failures and fixes)
33. Playtest planning and evaluation templates

---

## BEST PRACTICES

### Safety & Legal (NON-NEGOTIABLE)

**Fire Safety:**
- Emergency exits must be accessible AT ALL TIMES — no locked doors that prevent escape
- Panic hardware (crash bar) on all exit doors, or magnetic locks with fire alarm release
- Clearly marked emergency exit signs (illuminated)
- Fire extinguisher in every room, accessible to game master
- Smoke detectors connected to building system
- Maximum occupancy posted and enforced
- Emergency lighting (battery-backed)
- All materials must be fire-rated or treated with fire retardant

**Player Safety:**
- Nothing should be climbable unless designed and rated for it
- No sharp edges, pinch points, or trip hazards
- All electrical components must be low-voltage (12V recommended) or properly enclosed
- No locked rooms without game master override and emergency release
- Panic button or safe word that immediately unlocks all doors and turns on lights
- First aid kit on premises
- Clear "DO NOT" guidelines (don't force anything, don't climb, don't remove ceiling tiles)

**ADA & Accessibility:**
- Wheelchair-accessible path (at minimum, offer accommodations)
- No puzzles that REQUIRE a specific physical ability without alternative
- Color-blind-friendly design (don't rely solely on color differentiation)
- Hearing accommodations for audio puzzles (visual backup)
- Minimum font sizes for readability (14pt+ for critical clues)
- Consider cognitive accessibility — clear logic chains, avoid "guess what I'm thinking"
- Document accessibility features for marketing (be transparent)

**Legal:**
- Liability waiver signed by all participants before play
- Waiver reviewed by local attorney
- General liability insurance ($1M minimum recommended)
- Minor participation policy (age minimum, guardian requirements)
- Photo/video consent in waiver
- Data privacy compliance for booking information
- Business license and any local entertainment permits
- Health department requirements (if serving food/drink)
- Music licensing if playing copyrighted music (use royalty-free)

### Puzzle Design Best Practices

1. **Every puzzle must be solvable without outside knowledge** — no trivia, no "you had to be there," no cultural assumptions
2. **Test with naive players** — if your mom can't eventually figure it out, it's not clear enough
3. **One puzzle = one logic chain** — don't combine three different skills in one puzzle
4. **Confirmation feedback** — players should KNOW when they've solved something (click, light, sound, reveal)
5. **No "furniture moving"** — don't require physical strength unless the puzzle IS the physical challenge
6. **Red herrings are garnish, not the meal** — max 2–3 per room, and they should be quickly dismissible
7. **Technology should be invisible** — players interact with the theme, not the tech
8. **Always have a bypass plan** — every electronic puzzle needs a manual override
9. **Reset time matters** — if a puzzle takes 10 minutes to reset, you'll lose bookings
10. **The "aha!" moment is sacred** — protect the moment of discovery, never make it feel arbitrary

### Operations Best Practices

1. **Reset time target:** 10–15 minutes between groups
2. **Booking buffer:** 15–20 minutes between sessions (reset + next group arrival)
3. **Pre-brief:** 3–5 minutes max — respect players' time, don't lecture
4. **Hint policy:** Standardize delivery — don't let game master quality vary the experience
5. **Post-game:** Offer a 5-minute debrief, photo opportunity, and review prompt
6. **Maintenance schedule:** Weekly full inspection, daily quick check
7. **Backup locks and props:** Keep spares of everything that breaks frequently
8. **Game master rotation:** Prevent burnout — rotate rooms, rotate roles
9. **Data tracking:** Log success rates, hint usage, timing, and feedback scores
10. **Continuous improvement:** Review playtest data monthly, make adjustments quarterly

### Marketing Best Practices

1. **Photography is everything** — invest in good photos of the room (even phone photos with good lighting)
2. **Google My Business** — claim it, optimize it, respond to every review
3. **TripAdvisor, Yelp** — claim listings, encourage reviews, respond publicly
4. **Social media** — behind-the-scenes content, team photos, escape celebrations
5. **Partnerships** — hotels, restaurants, event planners, corporate HR
6. **Gift cards** — easy to sell, expand reach
7. **Grand opening event** — invite local media, influencers, bloggers, friends-and-family pricing
8. **Email list** — capture from bookings, send monthly updates, offer returning player discounts
9. **Themed events** — seasonal variants, holiday specials, anniversary editions
10. **Corporate packages** — team-building add-ons, debrief facilitation, custom branding

---

## DEVELOPMENT WORKFLOW

```
1. CONCEPT        → theme-concept-generator
2. AUDIENCE       → player-psychology-profiler
3. PUZZLES        → puzzle-flow-architect + complete puzzle catalog
4. NARRATIVE      → narrative-clue-writer (all scripts, clues, audio/video)
5. LAYOUT         → room-layout-set-design-planner
6. BUDGET         → room-design-formatter (materials list, budget breakdown)
7. BUILD          → room-design-formatter (spec sheets, construction guide)
8. PLAYTEST       → playtest-evaluator
9. POLISH         → all agents (iterate based on feedback)
10. LAUNCH        → market-comp-research (marketing, pricing, operations)
11. VISUAL ASSETS → visual-prompter (concept art, marketing images)
```

### Step-by-Step Build Process

**PHASE 1: CONCEPT (Week 1)**
- [ ] Define genre and theme
- [ ] Write story synopsis (2–3 paragraphs)
- [ ] Create room concept statement (logline equivalent)
- [ ] Identify target audience and difficulty level
- [ ] Define the "one thing" players will remember
- [ ] Research competitors and comparable rooms

**PHASE 2: DESIGN (Weeks 2–3)**
- [ ] Create puzzle flow diagram (structure type chosen)
- [ ] Write individual puzzle specifications (8–12 puzzles)
- [ ] Design hint progression for each puzzle
- [ ] Write player briefing script
- [ ] Draft audio/video scripts
- [ ] Plan room layout and zones
- [ ] Create lighting and sound design plan
- [ ] Compile materials and shopping list
- [ ] Finalize budget with contingency

**PHASE 3: BUILD (Weeks 3–5)**
- [ ] Source all materials and props
- [ ] Construct set dressing and décor
- [ ] Build/install puzzle mechanisms
- [ ] Install lighting and sound
- [ ] Wire any electronic components
- [ ] Print all clue materials
- [ ] Create reset checklist
- [ ] Install safety features (emergency exits, panic button, fire extinguisher)

**PHASE 4: TEST (Week 5–6)**
- [ ] Self-walkthrough (designer solves own room)
- [ ] Alpha playtest (3–5 sessions with friends/family)
- [ ] Fix critical issues identified
- [ ] Beta playtest (5–10 sessions with naive testers)
- [ ] Calibrate difficulty, timing, and hints
- [ ] Train game master(s)
- [ ] Final safety inspection

**PHASE 5: LAUNCH (Week 6–7)**
- [ ] Soft opening (discounted/free sessions for feedback)
- [ ] Collect reviews and testimonials
- [ ] Photography session
- [ ] Launch marketing campaign
- [ ] Grand opening event
- [ ] Full-price public bookings begin

**PHASE 6: OPERATE & IMPROVE (Ongoing)**
- [ ] Track success rates and hint usage weekly
- [ ] Review player feedback monthly
- [ ] Maintain and replace worn items
- [ ] Make quarterly adjustments based on data
- [ ] Plan Room #2 based on learnings

---

## MYSTERY GENRE QUICK REFERENCE (Default)

### Required Elements
- Crime or secret to uncover
- Evidence to collect and analyze
- Suspects to consider (even if abstract — documents, recordings)
- Red herring(s) that seem plausible
- "Eureka" moment where the truth clicks
- Satisfying resolution that makes retroactive sense

### Classic Mystery Room Structures
- **Whodunit:** Multiple suspects, players must identify the culprit
- **Cold Case:** Old crime, new evidence — players piece together the past
- **Locked Room:** Someone disappeared from an impossible situation
- **Frame Job:** Players are accused — must prove their innocence
- **Heist Gone Wrong:** The thief left clues — follow the trail
- **Missing Person:** Someone vanished — find them before time runs out

### Mystery Puzzle Best Fits
- Evidence boards with connectable clue cards
- Forensic analysis (UV clues, fingerprints, chemical reactions)
- Document analysis (letters, diaries, financial records)
- Photo/image analysis (spot the difference, hidden detail)
- Timeline reconstruction
- Cipher/coded messages from the suspect/victim
- Witness statements with contradictions
- Map-based location identification

### Mystery Atmosphere Essentials
- Detective's desk or investigation station as central hub
- Case files, manila folders, evidence bags
- Dim, focused lighting (desk lamp pools of light)
- Background: rain sounds, clock ticking, distant sirens
- Old photographs, newspaper clippings
- Cork board with pins and string

### Mystery Pitfalls
- Too many suspects with too little differentiation
- Solution that relies on obscure knowledge instead of available evidence
- Evidence that's too well-hidden (players don't know they're missing something)
- Anticlimactic reveal (the answer should reframe the room)
- Over-reliance on reading (keep documents brief and scannable)

---

## GAME MASTER MANUAL TEMPLATE

### Pre-Game Checklist
- [ ] Room fully reset (use reset checklist)
- [ ] All locks locked, all clues placed, all tech tested
- [ ] Lighting and sound system on
- [ ] Monitoring system active (cameras, audio)
- [ ] Hint system ready
- [ ] Emergency exits verified unobstructed
- [ ] Timer system ready
- [ ] Waivers collected from all participants
- [ ] Briefing materials ready

### Player Briefing Script
```
Welcome to [ROOM NAME]. My name is [GM NAME] and I'll be your guide.

In a moment, you'll enter the room. Here's what you need to know:

RULES:
- You have [X] minutes to escape.
- No phones — they stay out here.
- Nothing requires excessive force. If it doesn't move easily, it's not meant to move.
- Don't climb on furniture or remove anything from the walls or ceiling.
- If you need a hint, [hint delivery method]. You have unlimited hints — no penalty.
- If anyone needs to leave for any reason, [exit procedure].

YOUR MISSION:
[Brief story setup — 30 seconds max]

Any questions? Great — your time starts when the door closes. Good luck.
```

### Hint Delivery Protocol
1. **Watch before hinting** — give players 3–5 minutes on a puzzle before offering help
2. **Match the hint to the struggle** — use the progressive hint system (Nudge → Direction → Solution-Adjacent)
3. **Deliver in character when possible** — maintain immersion
4. **Never make players feel stupid** — frame hints as discoveries, not corrections
5. **Track what you give** — log hints for data analysis
6. **If a group is way behind at 30 minutes** — proactively offer assistance

### Post-Game Script
```
[Whether they escaped or not, celebrate the effort]

ESCAPED: "Congratulations! You solved [ROOM NAME] in [TIME]! That's [ranking context]. 
Your breakthrough on [specific puzzle] was impressive."

DID NOT ESCAPE: "Great effort! You made it [X]% of the way through. 
You were SO close to [next major puzzle]. Want me to show you what came next?"

ALWAYS: "Would you like a group photo? We'd also love if you left us a review on 
[platform]. Thanks for playing — hope to see you back for [other room]!"
```

### Troubleshooting Quick Reference
| Problem | Immediate Action | Long-term Fix |
|---------|-----------------|---------------|
| Lock won't open | Verify correct code, try spare lock | Replace lock, check mechanism |
| Electronic puzzle unresponsive | Power cycle, manual override | Check wiring, replace component |
| Player accidentally breaks prop | Remove from play, provide verbal clue instead | Reinforce or redesign, keep spare |
| Group is fighting/upset | Check in verbally, offer encouragement + hint | Review puzzle for frustration points |
| Timer malfunction | Use phone timer backup, inform players | Service timer system |
| Player medical issue | Stop game, turn on all lights, provide assistance | Review emergency procedures |
| Player wants to leave mid-game | Let them out immediately, no questions asked | Ensure exit always accessible |

---

## RESET CHECKLIST TEMPLATE

```
ROOM: [Name]
TARGET RESET TIME: [Minutes]

PRE-RESET:
- [ ] Previous group exited
- [ ] Photo opportunity offered
- [ ] Feedback collected

ZONE A:
- [ ] [Item] returned to [position]
- [ ] [Lock] reset to [combination]
- [ ] [Clue] placed in [location]
- [ ] [Tech element] powered and tested

ZONE B:
- [ ] [Item] returned to [position]
- [ ] [Lock] reset to [combination]
- [ ] [Clue] placed in [location]

ZONE C:
- [ ] [Item] returned to [position]
- [ ] [Lock] reset to [combination]
- [ ] [Clue] placed in [location]

ROOM-WIDE:
- [ ] All lights reset to starting state
- [ ] Sound system cued to start
- [ ] All hidden elements re-concealed
- [ ] All doors/compartments in starting position
- [ ] Timer reset
- [ ] Camera/monitoring verified
- [ ] Quick visual scan for player-left items
- [ ] Room smells okay (air freshener if needed)

VERIFIED BY: _______________ TIME: _______________
```

---

## FINANCIAL PROJECTIONS TEMPLATE

### Revenue Model (Per Room)
```
SESSIONS PER DAY: [Typical: 4–6 on weekdays, 6–8 on weekends]
AVERAGE GROUP SIZE: [Typical: 4–6 players]
PRICE PER PLAYER: $[Based on market]
AVERAGE BOOKING VALUE: $[Price × Avg Group Size]

WEEKLY REVENUE:
  Weekday: [Sessions] × [Avg Booking] × 5 days = $
  Weekend: [Sessions] × [Avg Booking] × 2 days = $
  Weekly total: $

MONTHLY REVENUE: Weekly × 4.3 = $
ANNUAL REVENUE: Monthly × 12 = $

OCCUPANCY RATE: [Realistic: 30–50% Year 1, 50–70% Year 2]
ADJUSTED ANNUAL REVENUE: Annual × Occupancy Rate = $
```

### Expense Model (Monthly)
```
FIXED COSTS:
  Rent/lease: $
  Insurance: $
  Utilities: $
  Software/booking system: $
  Loan payments: $
  Total fixed: $

VARIABLE COSTS:
  Staff (GM hourly × hours): $
  Consumable supplies: $
  Marketing/advertising: $
  Maintenance/repairs: $
  Credit card processing fees: $
  Total variable: $

TOTAL MONTHLY EXPENSES: $
BREAKEVEN: [Total Monthly Expenses ÷ Avg Booking Value] = bookings needed/month
```

### Upsell Revenue Streams
- **Group photos:** $5–$15 per group (printed or digital)
- **Corporate packages:** 20–50% premium over standard pricing
- **Gift cards:** Average 15–20% breakage (unredeemed)
- **Merchandise:** T-shirts, stickers, branded items
- **Private bookings:** 25–50% premium for exclusive slot
- **Food/drink partnerships:** Referral commission with nearby restaurants
- **Season passes / memberships:** For multi-room venues
- **Escape room design consulting:** Sell your expertise

---

*Escape Room Forge v1.0 — Built for escape room creators who want AI as a design partner, business advisor, and creative collaborator.*


---
---

# PART II: SAAS PLATFORM (PRD)

The product requirements for the Escape Room Forge SaaS platform — architecture, data model, user experience, AI pipeline, revision system, visualization, and business specifications.

---

## 1. EXECUTIVE SUMMARY

Escape Room Forge is a SaaS platform that guides users through designing, planning, and producing a complete, launch-ready escape room — including all physical assets, media files, business documents, and marketing materials. The system acts as an AI-powered design partner that walks users through a structured creative process, generating professional-grade deliverables at each stage that culminate in a downloadable, branded ZIP package ready to build and launch.

Unlike template-based planning tools, Escape Room Forge actually **generates** the finished products: print-ready prop PDFs, voice/audio narration files, video intro sequences, room layout diagrams, puzzle flow charts, 3D-printable prop files (STL), branded marketing kits, and a complete business operations manual — all tailored to the user's specific room concept.

**Business Model:** One-time purchase per room plan ($1,000), with the platform generating a complete "business-in-a-box" deliverable package.

---

## 2. RECOMMENDED TECH STACK

### Guiding Principle: No Vendor Lock-In

Every layer uses open standards, self-hostable alternatives exist, and data is always exportable.

### 2.1 Frontend

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | Next.js 14+ (App Router) | React ecosystem, SSR/SSG flexibility, API routes built-in. Can be self-hosted via Node. Not locked to Vercel — deploys on any Docker host. |
| **UI Library** | shadcn/ui + Tailwind CSS | Copy-paste components (not a dependency), fully ownable. No vendor. |
| **State Management** | Zustand | Lightweight, no boilerplate, works with React Server Components. |
| **Rich Text Editing** | Tiptap (ProseMirror-based) | For editing generated scripts, narratives, and documents inline. Open source. |
| **Diagram Rendering** | React Flow (puzzle flow diagrams) + Konva.js (room layouts) | Both open source. React Flow for node-based flow charts, Konva for 2D canvas-based spatial layouts. |
| **3D Preview** | Three.js / React Three Fiber | For optional 3D room previews and STL preview rendering. Open source. |
| **PDF Viewer** | react-pdf | For previewing generated print-ready documents. |

### 2.2 Backend

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Runtime** | Node.js 20+ | Matches frontend ecosystem, excellent async I/O for LLM streaming. |
| **Framework** | Hono | Ultra-lightweight, runs on any runtime (Node, Bun, Deno, Cloudflare Workers). Not locked to any platform. |
| **API Pattern** | REST + Server-Sent Events (SSE) | REST for CRUD, SSE for streaming LLM generation progress. WebSocket optional for real-time collaboration later. |
| **Job Queue** | BullMQ (Redis-backed) | For async media generation jobs (audio, video, images, 3D). Open source, self-hostable. |
| **File Storage** | MinIO (S3-compatible) | Self-hostable object storage. Same API as AWS S3, so can swap to S3, Backblaze B2, Cloudflare R2 without code changes. |
| **PDF Generation** | Puppeteer (HTML→PDF) + ReportLab (Python, for complex layouts) | Puppeteer for templated docs, ReportLab for precise print-ready props. |
| **DOCX Generation** | docx-js (Node) | Same library used in the existing Escape Room Forge documents. |
| **3D File Generation** | OpenSCAD (CLI) + Three.js (STL export) | OpenSCAD for parametric 3D models, Three.js for simpler geometry export. Both open source. |
| **Video Composition** | Remotion (React-based video) + FFmpeg | Remotion for compositing narration + images + text into videos. FFmpeg for encoding. Both open source. |
| **Audio Processing** | FFmpeg + Sox | Post-processing AI-generated audio (normalization, effects, ambient mixing). |
| **ZIP Packaging** | Archiver (Node) | Streaming ZIP creation with folder structure and manifest. |

### 2.3 Database

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Primary DB** | PostgreSQL 16+ | Industry standard, JSON support, full-text search, self-hostable everywhere. |
| **ORM** | Drizzle ORM | Type-safe, lightweight, SQL-first (not an abstraction leaking). |
| **Migrations** | Drizzle Kit | Declarative schema migrations. |
| **Cache / Queue Backend** | Redis (Valkey) | BullMQ backend, session cache, rate limiting. Valkey is the open-source Redis fork. |

### 2.4 AI / LLM Layer

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **LLM Router** | OpenRouter API | Single API for all text LLMs. Admin-configurable model per task. |
| **Orchestration LLM** | Claude (via OpenRouter) | Main creative/narrative/structural generation. Highest quality for complex prompts. |
| **Routine Tasks LLM** | Admin-configurable (e.g., GPT-4o-mini, Llama, Mistral via OpenRouter) | Formatting, extraction, summarization, simpler generation. |
| **Image Generation** | Admin-configurable: DALL-E 3 (OpenAI API), Flux (Replicate/fal.ai), Stable Diffusion (Replicate), Leonardo (API), Ideogram (API) | Abstracted behind a unified image generation interface. Admin picks provider. |
| **Voice / TTS** | Admin-configurable: ElevenLabs, OpenAI TTS, PlayHT, Fish Audio | For narration, character voices, hint audio. Admin picks provider. |
| **Music / Ambient** | Suno API or Udio API (admin-configurable) + royalty-free library fallback | Background music, ambient soundscapes, triggered audio. |
| **Video Generation** | Remotion compositing (primary) + optional AI video (Runway/Kling via API for cinematic intros) | Remotion handles most video needs; AI video is an optional premium enhancement. |
| **3D Model Generation** | OpenSCAD parametric templates + optional Meshy/Tripo3D API for complex props | Parametric templates cover most needs; AI 3D gen is experimental enhancement. |

### 2.5 Infrastructure

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Containerization** | Docker + Docker Compose | Standard. Works everywhere. |
| **Deployment** | Any VPS (Hetzner, DigitalOcean, Railway, Fly.io) or self-hosted | No platform lock-in. Single `docker-compose up` deployment. |
| **CDN** | Cloudflare (free tier) or any S3-fronting CDN | For serving generated assets. |
| **Auth** | Lucia Auth (open source) or Auth.js (NextAuth v5) | Self-hosted auth, no SaaS dependency. Supports email/password, OAuth, magic links. |
| **Payments** | Stripe | Industry standard for one-time purchases. Webhook-driven. |
| **Email** | Resend or any SMTP | Transactional emails (receipts, plan delivery). |
| **Monitoring** | OpenTelemetry + Grafana | Open-source observability stack. |

### 2.6 Development Tooling

| Tool | Purpose |
|------|---------|
| **TypeScript** | End-to-end type safety (frontend + backend) |
| **Monorepo** | Turborepo — shared types, utilities between packages |
| **Testing** | Vitest (unit), Playwright (E2E) |
| **CI/CD** | GitHub Actions |
| **Code Quality** | Biome (lint + format, replaces ESLint + Prettier) |

---

## 3. SYSTEM ARCHITECTURE

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │  Builder  │ │ Preview  │ │  Editor  │ │  Dashboard │ │
│  │  Wizard   │ │  Panel   │ │  Suite   │ │  & Admin   │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬──────┘ │
└───────┼────────────┼────────────┼──────────────┼────────┘
        │            │            │              │
        ▼            ▼            ▼              ▼
┌─────────────────────────────────────────────────────────┐
│                    API LAYER (Hono)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │ Project  │ │Generation│ │  Asset   │ │   Admin    │ │
│  │   API    │ │   API    │ │   API    │ │    API     │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬──────┘ │
└───────┼────────────┼────────────┼──────────────┼────────┘
        │            │            │              │
        ▼            ▼            ▼              ▼
┌───────────────┐ ┌─────────────────────────────────────┐
│  PostgreSQL   │ │         JOB QUEUE (BullMQ)           │
│  ┌──────────┐ │ │  ┌─────┐ ┌─────┐ ┌─────┐ ┌──────┐ │
│  │ Projects │ │ │  │Text │ │Image│ │Audio│ │Video │ │
│  │ Puzzles  │ │ │  │ Gen │ │ Gen │ │ Gen │ │ Gen  │ │
│  │ Assets   │ │ │  └──┬──┘ └──┬──┘ └──┬──┘ └──┬───┘ │
│  │ Users    │ │ │     │       │       │        │     │
│  └──────────┘ │ └─────┼───────┼───────┼────────┼─────┘
└───────────────┘       │       │       │        │
                        ▼       ▼       ▼        ▼
              ┌─────────────────────────────────────────┐
              │          AI PROVIDER LAYER               │
              │  ┌───────────┐ ┌─────────────────────┐ │
              │  │OpenRouter  │ │  Media Providers     │ │
              │  │(LLM tasks) │ │  (Image/Audio/Video) │ │
              │  └───────────┘ └─────────────────────┘ │
              └─────────────────────────────────────────┘
                        │       │       │        │
                        ▼       ▼       ▼        ▼
              ┌─────────────────────────────────────────┐
              │      ASSET PIPELINE & STORAGE            │
              │  ┌──────────┐ ┌──────────┐ ┌──────────┐│
              │  │  MinIO   │ │ Remotion │ │ OpenSCAD ││
              │  │(S3 store)│ │(video)   │ │(3D/STL)  ││
              │  └──────────┘ └──────────┘ └──────────┘│
              └─────────────────────────────────────────┘
```

### 3.2 AI Provider Abstraction Layer

The system uses a **provider adapter pattern** so any AI service can be swapped without code changes:

```
┌──────────────────────────────────────┐
│        AI Service Interface          │
│  generateText(prompt, config)        │
│  generateImage(prompt, config)       │
│  generateAudio(text, voice, config)  │
│  generateMusic(prompt, config)       │
│  generateVideo(config)               │
│  generate3D(prompt, config)          │
└───────────────┬──────────────────────┘
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
┌────────┐ ┌────────┐ ┌────────┐
│Adapter │ │Adapter │ │Adapter │  ... (one per provider)
│OpenAI  │ │Eleven  │ │Replicate│
│DALL-E  │ │Labs    │ │Flux    │
└────────┘ └────────┘ └────────┘
```

**Admin Configuration Table:**

| Task Category | Config Key | Example Value |
|--------------|-----------|---------------|
| Orchestration (narrative, creative) | `llm.orchestrator` | `anthropic/claude-sonnet-4` |
| Routine (formatting, extraction) | `llm.routine` | `openai/gpt-4o-mini` |
| Image Generation | `media.image` | `openai/dall-e-3` |
| Voice / TTS | `media.voice` | `elevenlabs` |
| Music / Ambient | `media.music` | `suno` |
| Video (AI cinematic) | `media.video_ai` | `runway` |
| 3D Model Generation | `media.3d` | `openscad` (or `meshy`) |

All configurable via admin panel. Changes take effect immediately for new generation jobs.

---

## 4. DATA MODEL

### 4.1 Core Entities

```sql
-- Users & Auth
users
  id              UUID PK
  email           VARCHAR UNIQUE
  name            VARCHAR
  role            ENUM('user', 'admin')
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

-- Projects (one per escape room plan)
projects
  id              UUID PK
  user_id         UUID FK → users
  title           VARCHAR
  status          ENUM('draft', 'in_progress', 'generating', 'complete', 'archived')
  genre           VARCHAR  -- mystery, horror, heist, etc.
  room_type       VARCHAR  -- brick_and_mortar, popup, mobile, etc.
  difficulty      ENUM('beginner', 'intermediate', 'advanced', 'expert')
  group_size_min  INT
  group_size_max  INT
  duration_min    INT      -- in minutes
  budget_tier     INT      -- in dollars
  current_phase   VARCHAR  -- tracks wizard progress
  theme_data      JSONB    -- concept, story, hook, emotional arc
  settings        JSONB    -- genre-specific settings
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

-- Puzzles
puzzles
  id              UUID PK
  project_id      UUID FK → projects
  name            VARCHAR
  puzzle_type     VARCHAR  -- from catalog
  difficulty      INT      -- 1-5
  est_solve_min   INT
  player_req      VARCHAR  -- solo, pair, team
  flow_position   JSONB    -- sequence order, parallel track, dependencies
  description     TEXT
  mechanism       TEXT
  solution        TEXT
  hints           JSONB    -- array of 3 hint tiers
  materials       JSONB    -- items, quantities, costs, links
  reset_procedure TEXT
  reset_time_min  INT
  failure_mode    TEXT
  narrative_tie   TEXT
  accessibility   TEXT
  sort_order      INT
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

-- Narrative Elements
narratives
  id              UUID PK
  project_id      UUID FK → projects
  type            ENUM('intro_script', 'briefing', 'clue_text', 'hint_audio_script',
                       'mid_reveal', 'win_ending', 'loss_ending', 'gm_script',
                       'audio_cue', 'video_script', 'red_herring', 'ambient_desc')
  title           VARCHAR
  content         TEXT     -- the actual script/text
  production_notes TEXT
  linked_puzzle_id UUID FK → puzzles (nullable)
  sort_order      INT
  metadata        JSONB   -- voice direction, timing, triggers, etc.
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

-- Room Layout
room_layouts
  id              UUID PK
  project_id      UUID FK → projects
  dimensions      JSONB    -- length, width, height
  zones           JSONB    -- array of zone definitions
  entry_point     JSONB
  exit_point      JSONB
  gm_monitoring   JSONB
  emergency_exit  JSONB
  lighting_plan   JSONB
  sound_plan      JSONB
  furniture       JSONB    -- placed items with positions
  layout_data     JSONB    -- canvas/diagram state for rendering
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

-- Generated Assets
assets
  id              UUID PK
  project_id      UUID FK → projects
  type            ENUM('image', 'audio', 'video', 'pdf', 'stl', 'docx', 'svg',
                       'diagram', 'marketing', 'music', '3d_model')
  category        VARCHAR  -- 'prop_print', 'concept_art', 'narration', 'hint_audio',
                           -- 'intro_video', 'room_diagram', 'flow_diagram',
                           -- 'marketing_flyer', 'fact_sheet', 'stl_prop',
                           -- 'ambient_audio', 'music_track', etc.
  title           VARCHAR
  description     TEXT
  file_path       VARCHAR  -- path in MinIO/S3
  file_size       BIGINT
  mime_type       VARCHAR
  generation_meta JSONB    -- model used, prompt, params, cost
  linked_puzzle_id UUID FK → puzzles (nullable)
  linked_narrative_id UUID FK → narratives (nullable)
  status          ENUM('pending', 'generating', 'complete', 'failed', 'regenerating')
  version         INT DEFAULT 1
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

-- Asset Version History (every regeneration is preserved)
asset_versions
  id              UUID PK
  asset_id        UUID FK → assets
  version         INT
  file_path       VARCHAR  -- path in MinIO/S3 (previous version's file)
  file_size       BIGINT
  generation_meta JSONB    -- model, prompt, params, cost for this version
  created_at      TIMESTAMP
  -- When an asset is regenerated, the current file_path/meta is copied here
  -- before overwriting. Users can browse all previous versions and restore any.

-- Content Snapshots (revision history for text content: puzzles, narratives, concept)
content_snapshots
  id              UUID PK
  project_id      UUID FK → projects
  entity_type     ENUM('puzzle', 'narrative', 'concept', 'layout', 'business_plan')
  entity_id       UUID     -- FK to the specific record
  snapshot_data   JSONB    -- full copy of the entity at this point in time
  change_source   ENUM('ai_generation', 'user_edit', 'regeneration', 'phase_completion')
  change_note     TEXT     -- optional user or system note ("Regenerated with darker tone")
  created_at      TIMESTAMP
  -- Every AI generation and significant user edit creates a snapshot.
  -- Users can view timeline, diff any two versions, and restore any snapshot.

-- Materials / Shopping List
materials
  id              UUID PK
  project_id      UUID FK → projects
  puzzle_id       UUID FK → puzzles (nullable)
  category        VARCHAR  -- locks, props, set_dressing, lighting, sound, tech, print, consumable
  item_name       VARCHAR
  quantity        INT
  unit_cost       DECIMAL
  total_cost      DECIMAL
  source          VARCHAR  -- suggested vendor
  purchase_url    VARCHAR  -- direct link
  notes           TEXT
  is_3d_printable BOOLEAN DEFAULT false
  stl_asset_id    UUID FK → assets (nullable)
  sort_order      INT

-- Business Plan Data
business_plans
  id              UUID PK
  project_id      UUID FK → projects
  pricing_strategy JSONB   -- per-player pricing, group rates, etc.
  financial_projections JSONB  -- revenue model, expenses, breakeven
  marketing_plan  JSONB    -- channels, timeline, budget
  operations_plan JSONB    -- scheduling, staffing, maintenance
  gm_training     JSONB    -- curriculum, scripts, protocols
  legal_checklist JSONB    -- waivers, insurance, permits
  upsell_strategy JSONB

-- Generation Jobs (async tracking)
generation_jobs
  id              UUID PK
  project_id      UUID FK → projects
  asset_id        UUID FK → assets (nullable)
  job_type        VARCHAR  -- text, image, audio, video, 3d, pdf, diagram
  status          ENUM('queued', 'processing', 'complete', 'failed', 'cancelled')
  provider        VARCHAR  -- which AI provider was used
  model           VARCHAR  -- specific model identifier
  prompt          TEXT
  config          JSONB    -- model-specific parameters
  result          JSONB    -- raw API response metadata
  cost_cents      INT      -- tracked cost per generation
  error           TEXT
  started_at      TIMESTAMP
  completed_at    TIMESTAMP
  created_at      TIMESTAMP

-- Admin Config
admin_config
  id              UUID PK
  key             VARCHAR UNIQUE -- e.g., 'llm.orchestrator', 'media.image'
  value           JSONB          -- provider, model, api_key ref, params
  updated_at      TIMESTAMP
  updated_by      UUID FK → users

-- Collaborator invites (view/comment only)
collaborators
  id              UUID PK
  project_id      UUID FK → projects
  email           VARCHAR
  name            VARCHAR
  access_level    ENUM('view', 'comment')
  invite_token    VARCHAR
  accepted_at     TIMESTAMP
  created_at      TIMESTAMP
```

### 4.2 Project Phase State Machine

```
CONCEPT → AUDIENCE → PUZZLES → NARRATIVE → LAYOUT → BUDGET → REVIEW → GENERATE → COMPLETE
   ↑         ↑          ↑          ↑          ↑        ↑        ↑
   └─────────┴──────────┴──────────┴──────────┴────────┴────────┘
                    (user can go back to any previous phase)
```

Each phase persists independently. User can jump between phases. Moving to GENERATE triggers the full asset pipeline. Moving to COMPLETE locks the project (creates the ZIP). User can unlock (back to REVIEW) to make changes.

---

## 5. USER EXPERIENCE FLOW

### 5.1 Builder Wizard — Phase-by-Phase

The guided tour walks the user through each phase. At every phase, the user can:
- Accept AI suggestions as-is
- Edit AI output before proceeding
- Regenerate with different direction
- Go back to any previous phase
- See live previews of what's been built so far

#### Phase 1: CONCEPT

**User provides:**
- Genre selection (with definitions shown)
- Room type selection (with definitions shown)
- Free-text concept description OR guided "What If" prompts
- Theme keywords, mood, inspiration references

**System generates:**
- Room concept statement (logline equivalent)
- Story synopsis (2–3 paragraphs)
- Theme mood board (4–6 AI-generated concept images)
- Hook statement ("the one thing players will tell friends about")
- Emotional arc description (start → middle → end feelings)

**Preview:** Mood board gallery + concept card

#### Phase 2: AUDIENCE

**User provides/adjusts:**
- Target group size (min–max)
- Difficulty level
- Target audience type (families, enthusiasts, corporate, etc.)
- Duration (default 60 min)

**System generates:**
- Player psychology profile for the concept
- Group dynamic recommendations
- Difficulty calibration targets (success rate, hint targets)
- Accessibility considerations specific to the room design

**Preview:** Audience profile card with recommendations

#### Phase 3: PUZZLES

**User involvement:** This is the most interactive phase. The system proposes an initial puzzle set based on concept, genre, difficulty, and group size, then the user iterates.

**System generates:**
- Recommended puzzle count and flow structure (linear/parallel/hybrid)
- Initial puzzle set (8–12 puzzles) with full spec sheets:
  - Name, type, difficulty, solve time, player requirement
  - Description, mechanism, solution
  - 3-tier hints
  - Materials needed with costs
  - Reset procedure
  - Narrative connection
- Puzzle flow diagram (interactive, editable)
- Difficulty curve visualization
- Timing blueprint
- Dependency map

**User can:**
- Add/remove/reorder puzzles
- Swap puzzle types from the complete catalog
- Edit any detail of any puzzle
- Ask the system to "make this harder/easier"
- Ask for alternative puzzles ("give me 3 options for the midpoint puzzle")
- Drag-and-drop puzzle flow editing

**Preview:** Interactive puzzle flow diagram + timeline + difficulty curve chart

#### Phase 4: NARRATIVE

**System generates based on puzzles and concept:**
- Intro briefing script (with voice direction notes)
- All clue text for every puzzle
- Red herring text and placement
- Progressive hint scripts (3 tiers × every puzzle)
- Mid-game narrative reveal script(s)
- Win ending script
- Loss ending script
- Game master hosting script
- Pre-game briefing script
- Post-game debrief script
- Audio cue scripts (triggered sounds with timing)
- Video scripts (intro, reveals, endings) with shot-by-shot breakdowns

**User can:** Edit every script inline, regenerate individual scripts, adjust tone/length

**Preview:** Script reader view, audio preview (TTS quick-preview)

#### Phase 5: LAYOUT

**System generates:**
- Room layout diagram (2D, top-down)
- Zone designations with puzzle placements
- Furniture and prop placement suggestions
- Entry/exit flow, GM monitoring positions
- Emergency exit compliance
- Lighting plan (ambient, accent, UV, dynamic)
- Sound plan (speaker placement, ambient sources, triggered cues)
- Sight line analysis

**User can:** Drag-and-drop elements on canvas, resize zones, adjust placements

**Preview:** Interactive 2D room layout canvas + 3D preview (optional)

#### Phase 6: BUDGET & MATERIALS

**System generates:**
- Complete materials shopping list with:
  - Item name, quantity, unit cost, total cost
  - Direct purchase links (Amazon, specialty suppliers)
  - Alternative/budget options
  - 3D-printable flag for applicable props
- Budget breakdown by category
- Budget vs. allocation comparison
- 3D printing plans (STL files) for printable props
- Parts list with BOM (bill of materials) for electronic components

**User can:** Adjust quantities, swap items, mark items as "already have," add custom items

**Preview:** Budget dashboard with category breakdown chart

#### Phase 7: REVIEW & EDIT

Full preview of everything generated. User reviews all sections in a unified view:
- Complete room design document
- All puzzles and their specs
- All narrative scripts
- Layout diagram
- Budget summary
- Business plan elements

**User can:** Edit anything, regenerate anything, add notes for collaborators

#### Phase 8: GENERATE ASSETS

User triggers the full asset generation pipeline. A progress dashboard shows each job:

**Text Documents:**
- [ ] Master Room Design Document (DOCX + PDF)
- [ ] Puzzle Specification Binder (PDF)
- [ ] Complete Solution Guide (PDF)
- [ ] Game Master Manual (DOCX + PDF)
- [ ] Player Waiver Template (PDF, fillable)
- [ ] Reset Checklist (PDF, printable)
- [ ] Emergency Procedures (PDF)
- [ ] Maintenance Schedule (PDF)

**Print-Ready Props:**
- [ ] Aged letters and documents (PDF, high-res)
- [ ] Cipher wheels and decoder tools (PDF, cut-lines included)
- [ ] Evidence cards and case files (PDF)
- [ ] Wanted posters, newspaper clippings (PDF)
- [ ] Room signage and labels (PDF)
- [ ] Player briefing cards (PDF)
- [ ] Map fragments and overlays (PDF)
- [ ] Custom puzzle-specific printed materials (PDF per puzzle)

**Diagrams:**
- [ ] Room layout diagram (SVG + PDF, to scale)
- [ ] Puzzle flow diagram (SVG + PDF)
- [ ] Wiring diagram for electronics (SVG + PDF)
- [ ] Difficulty curve chart (SVG + PDF)
- [ ] Timeline blueprint (SVG + PDF)
- [ ] Reset flow diagram (SVG + PDF)

**Audio:**
- [ ] Intro narration (MP3/WAV)
- [ ] Hint audio files (MP3 per puzzle per tier)
- [ ] Mid-game reveal narration (MP3/WAV)
- [ ] Win ending narration (MP3/WAV)
- [ ] Loss ending narration (MP3/WAV)
- [ ] Triggered sound effects (MP3 per cue)
- [ ] Background ambient loop (MP3, seamless)
- [ ] Background music track(s) (MP3)

**Video:**
- [ ] Intro video (MP4, composited from narration + images + text)
- [ ] Win ending video (MP4)
- [ ] Loss ending video (MP4)
- [ ] Mid-game reveal video(s) (MP4, if applicable)
- [ ] Marketing promo video / trailer (MP4)

**3D Printing Files:**
- [ ] STL files for each printable prop
- [ ] Print settings recommendation per file (layer height, infill, material)
- [ ] Assembly instructions (PDF per multi-part prop)

**Marketing Kit:**
- [ ] Room fact sheet (PDF, single page)
- [ ] Marketing one-pager (PDF, designed)
- [ ] Social media post copy (text file, platform-specific)
- [ ] Email announcement template (HTML)
- [ ] Google My Business listing copy (text)
- [ ] Review request template (text)
- [ ] Grand opening event plan (PDF)
- [ ] Photography shot list (PDF)
- [ ] Press release template (DOCX)

**Business Documents:**
- [ ] Financial projections spreadsheet (XLSX or PDF)
- [ ] Pricing strategy guide (PDF)
- [ ] 12-month marketing calendar (PDF)
- [ ] Upsell strategy guide (PDF)
- [ ] Scaling roadmap (PDF)
- [ ] GM training curriculum (PDF)
- [ ] Customer service scripts (PDF)

**Progress UI shows:** A real-time dashboard with each asset showing status (queued → generating → complete), estimated time, and preview-on-complete.

#### Phase 9: DOWNLOAD

**System produces:**
- Single branded ZIP file
- Detailed manifest (JSON + human-readable PDF index)
- Organized folder structure:

```
escape-room-forge-[room-name]/
├── 00-MANIFEST.pdf
├── 00-MANIFEST.json
├── 01-MASTER-PLAN/
│   ├── room-design-document.docx
│   ├── room-design-document.pdf
│   └── executive-summary.pdf
├── 02-PUZZLES/
│   ├── puzzle-specification-binder.pdf
│   ├── solution-guide.pdf
│   ├── puzzle-flow-diagram.svg
│   ├── puzzle-flow-diagram.pdf
│   ├── difficulty-curve.svg
│   └── individual-specs/
│       ├── P-001-bookshelf-cipher.pdf
│       ├── P-002-desk-drawer.pdf
│       └── ...
├── 03-NARRATIVE/
│   ├── scripts/
│   │   ├── intro-briefing.pdf
│   │   ├── player-briefing-card.pdf
│   │   ├── win-ending.pdf
│   │   ├── loss-ending.pdf
│   │   ├── mid-game-reveals/
│   │   └── gm-scripts/
│   ├── clue-text/
│   │   ├── P-001-clues.pdf
│   │   └── ...
│   └── hint-scripts/
│       ├── P-001-hints.pdf
│       └── ...
├── 04-ROOM-LAYOUT/
│   ├── room-layout-diagram.svg
│   ├── room-layout-diagram.pdf
│   ├── lighting-plan.pdf
│   ├── sound-plan.pdf
│   ├── wiring-diagram.svg
│   └── wiring-diagram.pdf
├── 05-PRINT-READY-PROPS/
│   ├── aged-letters/
│   ├── cipher-tools/
│   ├── evidence-cards/
│   ├── signage/
│   ├── maps-and-overlays/
│   └── puzzle-specific/
│       ├── P-001-bookshelf-cipher-printable.pdf
│       └── ...
├── 06-3D-PRINTING/
│   ├── stl-files/
│   │   ├── hidden-compartment-box.stl
│   │   └── ...
│   ├── print-settings.pdf
│   └── assembly-instructions/
├── 07-AUDIO/
│   ├── narration/
│   │   ├── intro-narration.mp3
│   │   ├── win-ending.mp3
│   │   ├── loss-ending.mp3
│   │   └── mid-game-reveals/
│   ├── hints/
│   │   ├── P-001-hint-1.mp3
│   │   ├── P-001-hint-2.mp3
│   │   ├── P-001-hint-3.mp3
│   │   └── ...
│   ├── sound-effects/
│   ├── ambient/
│   │   └── background-loop.mp3
│   └── music/
│       └── theme-track.mp3
├── 08-VIDEO/
│   ├── intro-video.mp4
│   ├── win-ending-video.mp4
│   ├── loss-ending-video.mp4
│   └── marketing-trailer.mp4
├── 09-MARKETING-KIT/
│   ├── fact-sheet.pdf
│   ├── marketing-one-pager.pdf
│   ├── social-media-copy.txt
│   ├── email-template.html
│   ├── google-my-business-listing.txt
│   ├── review-request-template.txt
│   ├── grand-opening-plan.pdf
│   ├── photography-shot-list.pdf
│   ├── press-release.docx
│   └── concept-art/
│       ├── room-concept-01.png
│       ├── room-concept-02.png
│       └── ...
├── 10-BUSINESS/
│   ├── financial-projections.pdf
│   ├── pricing-strategy.pdf
│   ├── marketing-calendar.pdf
│   ├── upsell-strategy.pdf
│   ├── scaling-roadmap.pdf
│   └── operations/
│       ├── gm-training-curriculum.pdf
│       ├── customer-service-scripts.pdf
│       ├── reset-checklist.pdf
│       ├── maintenance-schedule.pdf
│       ├── emergency-procedures.pdf
│       └── player-waiver-template.pdf
└── 11-REFERENCE/
    ├── complete-puzzle-catalog.pdf
    ├── shopping-list-with-links.pdf
    ├── parts-list-electronics.pdf
    └── best-practices-guide.pdf
```

---

## 6. AI GENERATION PIPELINE

### 6.1 Pipeline Architecture

Each generation task flows through a standardized pipeline:

```
User Action → API Request → Job Created (BullMQ) → Worker Picks Up
→ Prompt Constructed (from project data + system templates)
→ AI Provider Called (via adapter)
→ Result Processed (format conversion, quality check)
→ Asset Stored (MinIO) → DB Updated → SSE Notification → UI Updates
```

### 6.2 Prompt System

The system maintains a **prompt library** — version-controlled prompt templates for every generation task. Each prompt template:

- References project data dynamically (concept, genre, puzzles, etc.)
- Includes system context (the Escape Room Forge "voice" and expertise)
- Has quality criteria and output format specifications
- Is tagged with the recommended model tier (orchestrator vs. routine)

**Prompt template example (narrative intro script):**
```
SYSTEM: You are the Narrative & Clue Writer agent of Escape Room Forge.
You write immersive, compelling scripts for escape room experiences.

PROJECT CONTEXT:
- Room: {{project.title}}
- Genre: {{project.genre}}
- Theme: {{project.theme_data.concept}}
- Story: {{project.theme_data.synopsis}}
- Duration: {{project.duration_min}} minutes
- Audience: {{project.difficulty}} difficulty, groups of {{project.group_size_min}}-{{project.group_size_max}}

TASK: Write the intro briefing script that players hear/see before entering the room.

REQUIREMENTS:
- Maximum 90 seconds when read aloud (~200 words)
- Structure: Hook (1-2 sentences) → Setup (who/where/why) → Stakes → Goal → Launch line
- Tone: {{genre_tone_map[project.genre]}}
- Include production notes (voice direction, music cue, delivery method)
- Output format: JSON { script, production_notes, estimated_duration_seconds, tone_notes, music_cue }
```

### 6.3 Generation Task Types & Model Routing

| Task | Model Tier | Output | Processing |
|------|-----------|--------|------------|
| Room concept & story | Orchestrator | JSON → DB | Direct |
| Puzzle specifications | Orchestrator | JSON → DB | Direct |
| Narrative scripts | Orchestrator | JSON → DB | Direct |
| Hint text | Orchestrator | JSON → DB | Direct |
| Business documents | Orchestrator | JSON → DOCX/PDF pipeline | Template merge |
| Shopping list + links | Routine | JSON → DB | Web search enrichment |
| Clue text formatting | Routine | Text → PDF pipeline | Template merge |
| Concept art images | Image provider | PNG → MinIO | Direct store |
| Print-ready prop PDFs | Routine + PDF pipeline | Structured text → ReportLab → PDF | Multi-step |
| Room layout diagram | Routine + SVG renderer | JSON positions → SVG/PDF | Programmatic |
| Puzzle flow diagram | Routine + React Flow export | JSON graph → SVG/PDF | Programmatic |
| Wiring diagrams | Routine + SVG renderer | JSON components → SVG/PDF | Programmatic |
| Voice narration | TTS provider | Audio file → MP3/WAV | FFmpeg post-process |
| Hint audio | TTS provider | Audio per hint → MP3 | FFmpeg post-process |
| Ambient soundscape | Music provider | Audio file → MP3 | FFmpeg loop/normalize |
| Music track | Music provider | Audio file → MP3 | Direct store |
| Intro video | Remotion + assets | Images + audio + text → MP4 | Render pipeline |
| Marketing images | Image provider | PNG → MinIO | Direct store |
| STL 3D files | OpenSCAD / 3D provider | STL files → MinIO | Parametric or AI gen |
| Marketing copy | Routine | Text → formatted docs | Template merge |
| Financial projections | Routine | JSON → XLSX/PDF | Template merge |

### 6.4 Quality Gates

Before marking any asset as "complete," the system runs quality checks:

- **Text:** Word count within bounds, no placeholder text, JSON valid
- **Images:** Resolution meets minimum (1024×1024 for concept art, 300 DPI for print), no watermarks
- **Audio:** Duration within expected range, no silence > 2s, normalized loudness (-16 LUFS)
- **Video:** Resolution ≥ 1080p, audio synced, no encoding artifacts
- **PDF:** Page count expected, no blank pages, fonts embedded
- **STL:** Watertight mesh, no non-manifold edges, printable dimensions

Failed quality checks → auto-retry once → if still failed → mark for manual review by user.

---

## 7. ADMIN SYSTEM

### 7.1 Admin Dashboard

| Feature | Description |
|---------|-------------|
| **Model Configuration** | Set which AI model/provider is used for each task category. Test prompts against models. |
| **API Key Management** | Securely store and rotate API keys for all providers (encrypted at rest). |
| **Cost Tracking** | Per-project and aggregate cost tracking across all AI providers. |
| **Prompt Library** | View, edit, version, and A/B test prompt templates. |
| **Generation Queue** | Monitor all active/queued/failed generation jobs. Retry or cancel. |
| **User Management** | View users, projects, usage. Manual overrides if needed. |
| **System Health** | Queue depth, worker status, storage usage, API rate limit status. |
| **Feature Flags** | Toggle features (e.g., AI video generation, 3D printing) per tier. |

### 7.2 Cost Management

Each AI call logs its cost. The admin can set:
- **Per-project budget cap** (alert or hard-stop)
- **Per-task cost limits** (e.g., max $2 per image generation)
- **Provider fallback chain** (if primary provider fails or is over budget, fall back to cheaper alternative)

---

## 8. COLLABORATOR SYSTEM

The project owner (single user) can invite collaborators via email link:

- **View access:** Can see all project content, previews, and generated assets
- **Comment access:** Can view + leave comments/suggestions on any section
- Collaborators CANNOT edit directly — they leave notes that the owner reviews
- Collaborator comments are threaded per section/puzzle/script
- Owner sees a "suggestions" panel and can accept/dismiss each
- No additional login required — magic link access with project-scoped token

---

## 9. PERSISTENCE & RETURN FLOW

### 9.1 Auto-Save

Every change auto-saves to the database. No explicit "save" button needed. Changes are debounced (500ms) and saved via PATCH requests.

### 9.2 Project Dashboard

Users return to a dashboard showing all their projects with:
- Project card (title, genre, room type, status, last modified)
- Progress indicator (which phases are complete)
- Quick resume button (jumps to current phase)
- "Re-open" button for completed projects (unlocks for editing, reverts to REVIEW phase)

### 9.3 Revision System

The revision system ensures nothing is ever lost and users can freely experiment.

#### 9.3.1 Content Revision History

Every piece of generated or edited content maintains a full revision timeline:

- **Auto-snapshot triggers:**
  - Every AI generation or regeneration
  - Every significant user edit (debounced — not every keystroke, but every "meaningful change" detected after 10 seconds of inactivity or on explicit save)
  - Phase completion milestones
  - Before and after full asset generation

- **Per-entity revision browser:**
  - Each puzzle, narrative script, concept element, and layout has a "History" button
  - Opens a timeline sidebar showing all versions with timestamps and change source labels (AI Generated / User Edit / Regenerated / Restored)
  - Click any version to preview it
  - "Restore this version" copies it back as the current version (creating a new snapshot of what was replaced)
  - "Compare" mode shows a diff between any two versions (additions highlighted green, removals red)

- **"Revert to AI Original"** button on any manually edited content — restores the last AI-generated version without losing the user's edits (both are preserved in history)

#### 9.3.2 Asset Version History

Generated media assets (images, audio, video, PDFs, STLs) maintain version history:

- When a user regenerates an asset, the previous file is moved to `asset_versions` before the new one overwrites it
- Asset preview panel shows a version carousel — swipe/click through all previous generations
- "Use this version" restores any previous generation as the current asset
- Each version shows the prompt and model that created it, so users can see what changed
- Version storage is capped at 5 versions per asset (oldest auto-pruned, user warned)

#### 9.3.3 Project-Level Snapshots

Major milestones create a full project snapshot (all entities serialized):

- Completing any phase
- Before triggering full asset generation
- After full asset generation completes
- Manual "Save checkpoint" button available at any time

Users can browse project snapshots on the dashboard and restore the entire project to any checkpoint.

#### 9.3.4 Undo/Redo Within Sessions

- Standard undo/redo (Ctrl+Z / Ctrl+Shift+Z) works within all text editors (Tiptap)
- Puzzle flow diagram (React Flow) supports undo/redo for node moves, additions, deletions
- Room layout canvas (Konva.js) supports undo/redo for all placement actions
- Undo stack is per-session (cleared on page navigation, but the snapshot system preserves cross-session history)

#### 9.3.5 Side-by-Side Comparison

For creative decisions, users can:
- Generate 2–3 alternatives for any element ("Give me 3 options for this puzzle")
- View them side by side in a comparison panel
- Pick one, or cherry-pick elements from multiple options
- Unpicked alternatives are preserved in history and can be restored later

---

## 9A. PROGRESSIVE VISUALIZATION SYSTEM

The room comes alive visually as the user builds it. A persistent **Room Preview Panel** is available on the right side of every phase (collapsible on mobile), showing the room's current state and updating in real time as content is added.

### 9A.1 Preview Panel Behavior by Phase

| Phase | What the Preview Shows |
|-------|----------------------|
| **Concept** | Mood board images as they're generated. Genre/theme color palette applied to a placeholder room silhouette. |
| **Audience** | Mood board + overlay badges showing group size, difficulty rating, and target audience type on the room silhouette. |
| **Puzzles** | Interactive minimap of the puzzle flow diagram. Clicking a puzzle node shows its spec card. Difficulty curve chart below. As puzzles are added/removed, the flow diagram and curve update live. |
| **Narrative** | Room silhouette with "story pins" — clickable markers showing where each narrative beat occurs (intro, mid-reveal, ending). Clicking plays a quick TTS preview of the script. Audio waveform indicator for generated audio. |
| **Layout** | The Konva.js room canvas IS the preview — it's the primary workspace. But a small 3D perspective preview (React Three Fiber) appears in the panel showing a basic extruded floor plan with placed furniture as blocks. Updates live as the user drags items on the 2D canvas. |
| **Budget** | Budget donut chart showing allocation by category. Items turn green as they're sourced/linked. Total vs. budget bar indicator. |
| **Review** | Full scrollable preview of the entire room — concept art gallery, puzzle flow diagram, room layout, script excerpts, budget summary — all in one view. This IS the review phase workspace. |
| **Generate** | Asset generation progress dashboard — grid of asset cards, each showing status (queued / spinner / preview thumbnail on complete). As each asset finishes, its thumbnail/waveform/preview populates the card. The grid progressively fills in like a mosaic. |
| **Download** | ZIP contents explorer — folder tree on the left, file preview on the right. Click any file to preview it before downloading. |

### 9A.2 Quick TTS Preview

Available in the Narrative phase and Review phase:
- Any script or narrative element has a "Preview" (play button) icon
- Clicking it sends the text to the configured TTS provider for a quick low-quality preview (fastest/cheapest model)
- Audio plays inline with a waveform indicator
- This is a DRAFT preview — the final generation uses the full-quality voice/model
- Preview audio is cached per text hash (regenerates only if text changes)

### 9A.3 Room Visualization Progression

The system builds a **composite room visualization** that evolves across phases:

**Phase 1 (Concept):** Empty room outline + mood board images as background inspiration collage

**Phase 3 (Puzzles):** Room outline + labeled puzzle station markers appear at approximate positions (auto-placed, user can adjust later)

**Phase 5 (Layout):** Full 2D spatial layout with all elements placed. Optional 3D extrusion view shows:
- Walls and doorways
- Furniture as simplified block shapes
- Puzzle stations as labeled markers
- Lighting zones as colored overlays
- Sound source positions as speaker icons

**Phase 8 (Generate):** As concept art images generate, they populate a "room gallery" — giving the user a visual feel for what the finished room looks like before they build it physically.

### 9A.4 Generation Progress Visualization

The Generate phase (Phase 8) shows a **visual progress dashboard**, not just a checklist:

```
┌─────────────────────────────────────────────────────────────┐
│  GENERATING YOUR ESCAPE ROOM                    72% Complete │
│  ███████████████████████████░░░░░░░░░  43 of 60 assets      │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ 📄 Docs  │ │ 🖼 Images│ │ 🔊 Audio │ │ 🎬 Video │       │
│  │ 12/15 ✓  │ │ 18/22 ✓  │ │ 8/14 ⏳  │ │ 1/5 ⏳   │       │
│  │ [======] │ │ [======] │ │ [====  ] │ │ [=     ] │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │ 📐 Diagms│ │ 🖨 Props │ │ 🔧 3D    │                    │
│  │ 4/6 ✓    │ │ 0/8 queued│ │ 0/3 queued│                   │
│  │ [======] │ │ [      ] │ │ [      ] │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
│                                                              │
│  LATEST COMPLETED:                                          │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │
│  │thumb│ │thumb│ │wave │ │thumb│ │thumb│ │wave │        │
│  │img  │ │img  │ │audio│ │diagram│ │img │ │audio│        │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘        │
│  Concept  Evidence  Intro   Puzzle  Wanted   Hint          │
│  Art #3   Card      Narr.   Flow    Poster   P-001         │
│                                                              │
│  Click any asset to preview full size. ⟳ to regenerate.    │
└─────────────────────────────────────────────────────────────┘
```

Each asset card:
- Shows a spinner while generating
- Pops in a thumbnail/waveform preview on completion
- Click to view full-size preview in a modal
- "Regenerate" button on hover
- Shows the model/provider that generated it
- Red border + retry button if failed

---

## 10. PRINT-READY ASSET SPECIFICATIONS

### 10.1 Prop PDFs

All print-ready props are generated as high-resolution PDFs:

- **Resolution:** 300 DPI minimum
- **Color Space:** CMYK for print (RGB version also included for screen reference)
- **Bleed:** 3mm bleed on all sides for professional printing
- **Trim Marks:** Included as separate layer/option
- **Paper Size:** US Letter (8.5" × 11") with content sized appropriately
- **Font Embedding:** All fonts embedded in PDF
- **Aging/Distress Effects:** Applied digitally (tea stain, burn edges, fold marks, etc.)

### 10.2 Prop Categories & Generation Approach

| Prop Type | Generation Method | Output |
|-----------|------------------|--------|
| Aged letters / documents | LLM writes content → HTML template → Puppeteer → PDF with aging filters | PDF |
| Cipher wheels | Parametric SVG generation based on cipher type | PDF with cut lines |
| Evidence cards | LLM writes content → designed card template → PDF | PDF sheet (multiple cards) |
| Newspaper clippings | LLM writes article → newspaper column template → aged PDF | PDF |
| Wanted posters | LLM writes copy + image gen for portrait → poster template → PDF | PDF |
| Maps and floor plans | Programmatic SVG from layout data → aged/themed overlay → PDF | PDF |
| Photographs (in-world) | Image generation with specific style/era → print-ready PDF | PDF |
| Labels and signage | LLM writes text → themed label template → PDF | PDF sheet |
| Puzzle-specific printables | Per puzzle type (crosswords, coded messages, etc.) → programmatic generation | PDF |

### 10.3 3D Printing Specifications

| Attribute | Standard |
|-----------|----------|
| File Format | STL (binary) + STEP (for editing) |
| Units | Millimeters |
| Wall Thickness | Minimum 1.5mm |
| Mesh Quality | Watertight, manifold, < 500K triangles |
| Print Settings Doc | Layer height, infill %, material rec, support needs, estimated time, estimated filament |
| Assembly Guide | Multi-part props include assembly PDF with exploded view diagrams |

**3D-printable prop examples:**
- Hidden compartment boxes with sliding/rotating mechanisms
- Custom lock housings themed to the room
- Puzzle piece fragments
- Themed key shapes
- Decorative elements (emblems, runes, symbols)
- Display stands for props
- Cable management and sensor housings

---

## 11. NON-FUNCTIONAL REQUIREMENTS

### 11.1 Performance

| Metric | Target |
|--------|--------|
| Page load (initial) | < 2 seconds |
| Phase transition | < 500ms |
| Text generation (streaming) | First token < 2s, full response < 30s |
| Image generation | < 60s (with progress indicator) |
| Audio generation (per file) | < 30s |
| Video generation | < 5 minutes (with progress bar) |
| ZIP packaging | < 2 minutes for full project |
| Auto-save | < 200ms perceived, debounced 500ms |

### 11.2 Scalability

- Stateless API servers (horizontally scalable)
- BullMQ workers independently scalable (add workers per task type)
- MinIO supports clustering for storage
- PostgreSQL read replicas if needed
- Redis cluster for queue scaling

### 11.3 Security

- All API keys encrypted at rest (AES-256)
- User data isolated per account (row-level security)
- Generated assets are private per user (signed URLs with expiry)
- CSRF, XSS, SQL injection protections standard
- Rate limiting on all AI generation endpoints
- SOC 2 considerations for future enterprise tier

### 11.4 Data Export

Users can always:
- Download the full ZIP of any completed project
- Export raw project data as JSON
- Delete their account and all associated data (GDPR compliance)

---

## 12. MONETIZATION

### 12.1 Pricing Model

| Tier | Price | Includes |
|------|-------|----------|
| **Single Room Plan** | $1,000 | Full guided build + all asset generation for one room |
| **Additional Room** | $750 | Discounted for returning customers |
| **Room Refresh** | $250 | Re-open a completed project, regenerate updated assets |
| **Enterprise / Franchise** | Custom | Multiple rooms, custom branding, API access, bulk pricing |

### 12.2 Cost Structure Per Room (Estimated AI Costs)

| Category | Est. API Cost |
|----------|--------------|
| Text generation (all LLM calls) | $5–$15 |
| Image generation (concept art, props, marketing — ~30 images) | $10–$30 |
| Voice/TTS (all narration + hints — ~30 audio files) | $10–$25 |
| Music generation (2–3 tracks) | $5–$10 |
| Video composition (3–5 videos) | $5–$15 |
| 3D model generation (3–8 STLs) | $5–$15 |
| **Total per room** | **$40–$110** |

**Margin:** ~89–96% gross margin per room plan.

---

## 13. DEVELOPMENT PHASES

### Phase 1: Foundation (Weeks 1–3)
- Monorepo setup, CI/CD, Docker compose
- Database schema, migrations, seed data
- Auth (Lucia), user management
- Project CRUD, phase state machine
- Admin panel (model config, API key management)
- OpenRouter integration with provider abstraction layer
- Basic frontend shell with wizard navigation

### Phase 2: Builder Core (Weeks 4–7)
- Phase 1–3 of wizard (Concept, Audience, Puzzles)
- LLM integration for concept and puzzle generation
- Interactive puzzle flow diagram (React Flow)
- Puzzle catalog UI with filtering/search
- Inline editing for all generated content
- Preview panels for each phase

### Phase 3: Narrative & Layout (Weeks 8–10)
- Phase 4–5 of wizard (Narrative, Layout)
- All script generation (intro, hints, GM, endings, audio/video scripts)
- Room layout canvas (Konva.js)
- Lighting and sound plan visualization
- Diagram generation (SVG pipeline)

### Phase 4: Media Generation (Weeks 11–14)
- Image generation pipeline (concept art, props, marketing)
- TTS/voice pipeline (all narration and hint audio)
- Music generation pipeline
- Video composition pipeline (Remotion)
- Print-ready prop PDF pipeline (ReportLab + templates)
- 3D model generation pipeline (OpenSCAD + optional AI)
- Quality gate system

### Phase 5: Business & Assembly (Weeks 15–17)
- Phase 6–7 of wizard (Budget, Review)
- Materials list with purchase links (web search enrichment)
- Business plan document generation
- Marketing kit generation
- Financial projections template
- ZIP packaging with manifest
- Stripe payment integration

### Phase 6: Polish & Launch (Weeks 18–20)
- End-to-end testing (full room generation)
- Performance optimization
- Error handling and retry logic
- User onboarding flow
- Documentation
- Beta testing with real users
- Launch

**Total estimated timeline: 20 weeks (5 months)**

---

## 14. RISKS & MITIGATIONS

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| AI generation quality inconsistent | High | High | Quality gates, regeneration, human review step, prompt iteration |
| API cost overrun per project | Medium | High | Budget caps, cost tracking, fallback to cheaper models |
| Long generation times frustrate users | Medium | Medium | Progressive generation, streaming updates, async with notifications |
| 3D model quality insufficient | High | Medium | Parametric templates as primary, AI 3D as optional enhancement |
| Provider API downtime | Medium | High | Fallback providers configured per task, graceful degradation |
| Print-ready quality issues | Medium | High | 300 DPI enforcement, CMYK conversion, sample print testing |
| Scope creep on media features | High | High | Clear MVP scope per phase, feature flags to gate experimental features |

---

## 15. SUCCESS METRICS

| Metric | Target (6 months post-launch) |
|--------|------------------------------|
| Rooms fully generated | 100+ |
| Average generation completion rate | > 85% (users who start → finish) |
| Average time to complete a room plan | < 8 hours (across multiple sessions) |
| User satisfaction (post-generation survey) | > 4.2 / 5.0 |
| Asset quality rating (user feedback) | > 4.0 / 5.0 |
| Gross margin per room | > 85% |
| Monthly recurring projects | 20+ |

---

*Escape Room Forge PRD v1.0*


---
---

# PART III: IMPLEMENTATION GUIDE

The Claude Code starter — project structure, setup instructions, sprint-by-sprint build order, and key implementation patterns for building the Escape Room Forge platform.

---

## CONTEXT

You are building **Escape Room Forge**, a SaaS platform that guides users through designing, planning, and producing a complete escape room — generating all deliverables including documents, print-ready props, audio narration, video intros, 3D printing files, diagrams, and marketing materials.

Read the full PRD at: `docs/PRD.md`
Read the system reference at: `docs/escape-room-forge-consolidated.md`

---

## PROJECT STRUCTURE

Initialize the project as a Turborepo monorepo:

```
escape-room-forge/
├── README.md
├── docs/
│   ├── PRD.md                          # Full product requirements
│   ├── escape-room-forge-consolidated.md  # System reference (voices, agents, catalogs)
│   └── architecture.md                 # Architecture decisions
├── turbo.json
├── package.json
├── docker-compose.yml                  # Local dev: Postgres, Redis, MinIO
├── .env.example
├── packages/
│   ├── db/                             # Drizzle schema, migrations, seed
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   │   ├── users.ts
│   │   │   │   ├── projects.ts
│   │   │   │   ├── puzzles.ts
│   │   │   │   ├── narratives.ts
│   │   │   │   ├── room-layouts.ts
│   │   │   │   ├── assets.ts
│   │   │   │   ├── asset-versions.ts       # Asset generation version history
│   │   │   │   ├── content-snapshots.ts    # Content revision history
│   │   │   │   ├── materials.ts
│   │   │   │   ├── business-plans.ts
│   │   │   │   ├── generation-jobs.ts
│   │   │   │   ├── admin-config.ts
│   │   │   │   ├── collaborators.ts
│   │   │   │   └── index.ts
│   │   │   ├── migrate.ts
│   │   │   └── seed.ts                 # Seed puzzle catalog, genre defs, prompt templates
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   ├── shared/                         # Shared types, constants, utilities
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── project.ts          # Project, phase, status types
│   │   │   │   ├── puzzle.ts           # Puzzle types, catalog types
│   │   │   │   ├── narrative.ts        # Narrative element types
│   │   │   │   ├── asset.ts            # Asset types, generation status
│   │   │   │   ├── ai.ts              # AI provider types, config types
│   │   │   │   └── index.ts
│   │   │   ├── constants/
│   │   │   │   ├── genres.ts           # Genre definitions with metadata
│   │   │   │   ├── room-types.ts       # Room type definitions
│   │   │   │   ├── puzzle-catalog.ts   # Complete puzzle type catalog
│   │   │   │   ├── phases.ts           # Builder phases and transitions
│   │   │   │   └── index.ts
│   │   │   └── utils/
│   │   │       ├── budget.ts           # Budget calculation helpers
│   │   │       ├── timing.ts           # Puzzle timing/flow helpers
│   │   │       └── validation.ts       # Shared validation schemas (Zod)
│   │   └── package.json
│   └── ai/                             # AI provider abstraction layer
│       ├── src/
│       │   ├── providers/
│       │   │   ├── base.ts             # Abstract provider interface
│       │   │   ├── openrouter.ts       # OpenRouter adapter (all LLMs)
│       │   │   ├── openai-image.ts     # DALL-E adapter
│       │   │   ├── replicate.ts        # Flux/SD adapter
│       │   │   ├── elevenlabs.ts       # TTS adapter
│       │   │   ├── openai-tts.ts       # OpenAI TTS adapter
│       │   │   ├── suno.ts             # Music generation adapter
│       │   │   ├── openscad.ts         # 3D parametric generation
│       │   │   └── index.ts            # Provider registry
│       │   ├── prompts/
│       │   │   ├── concept.ts          # Room concept generation prompts
│       │   │   ├── puzzles.ts          # Puzzle generation prompts
│       │   │   ├── narrative.ts        # All narrative script prompts
│       │   │   ├── layout.ts           # Room layout generation prompts
│       │   │   ├── business.ts         # Business doc prompts
│       │   │   ├── marketing.ts        # Marketing copy prompts
│       │   │   ├── materials.ts        # Shopping list / parts prompts
│       │   │   └── index.ts
│       │   ├── router.ts              # Routes tasks to correct provider based on admin config
│       │   ├── quality-gates.ts       # Quality checks per asset type
│       │   └── cost-tracker.ts        # Per-call cost logging
│       └── package.json
├── apps/
│   ├── web/                            # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx            # Landing / marketing page
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/page.tsx
│   │   │   │   │   └── register/page.tsx
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx        # Project list, create new
│   │   │   │   ├── project/[id]/
│   │   │   │   │   ├── layout.tsx      # Builder shell with phase nav
│   │   │   │   │   ├── concept/page.tsx
│   │   │   │   │   ├── audience/page.tsx
│   │   │   │   │   ├── puzzles/page.tsx
│   │   │   │   │   ├── narrative/page.tsx
│   │   │   │   │   ├── layout/page.tsx
│   │   │   │   │   ├── budget/page.tsx
│   │   │   │   │   ├── review/page.tsx
│   │   │   │   │   ├── generate/page.tsx   # Asset generation dashboard
│   │   │   │   │   └── download/page.tsx   # Final ZIP download
│   │   │   │   └── admin/
│   │   │   │       ├── models/page.tsx     # AI model configuration
│   │   │   │       ├── prompts/page.tsx    # Prompt library management
│   │   │   │       ├── queue/page.tsx      # Generation queue monitor
│   │   │   │       ├── costs/page.tsx      # Cost tracking dashboard
│   │   │   │       └── users/page.tsx
│   │   │   ├── components/
│   │   │   │   ├── ui/                 # shadcn/ui components
│   │   │   │   ├── builder/
│   │   │   │   │   ├── PhaseNavigation.tsx
│   │   │   │   │   ├── PhaseHeader.tsx
│   │   │   │   │   ├── PreviewPanel.tsx         # Persistent right-side room preview
│   │   │   │   │   ├── RoomPreviewComposite.tsx # Progressive room visualization
│   │   │   │   │   ├── GenerationProgress.tsx   # Visual asset generation dashboard
│   │   │   │   │   ├── AssetMosaic.tsx          # Grid of asset thumbnails filling in live
│   │   │   │   │   └── InlineEditor.tsx         # Tiptap-based editor w/ undo/redo
│   │   │   │   ├── revision/
│   │   │   │   │   ├── RevisionTimeline.tsx     # Per-entity version history sidebar
│   │   │   │   │   ├── RevisionDiff.tsx         # Side-by-side diff view (text)
│   │   │   │   │   ├── AssetVersionCarousel.tsx # Swipe through previous asset generations
│   │   │   │   │   ├── ComparisonPanel.tsx      # Side-by-side compare 2-3 alternatives
│   │   │   │   │   ├── SnapshotBrowser.tsx      # Project-level checkpoint browser
│   │   │   │   │   └── RevertButton.tsx         # "Revert to AI Original" action
│   │   │   │   ├── puzzles/
│   │   │   │   │   ├── PuzzleFlowDiagram.tsx    # React Flow
│   │   │   │   │   ├── PuzzleCatalog.tsx
│   │   │   │   │   ├── PuzzleSpecCard.tsx
│   │   │   │   │   ├── PuzzleEditor.tsx
│   │   │   │   │   └── DifficultyCurve.tsx
│   │   │   │   ├── layout/
│   │   │   │   │   ├── RoomCanvas.tsx      # Konva.js 2D layout editor
│   │   │   │   │   ├── RoomPreview3D.tsx   # Three.js 3D preview
│   │   │   │   │   ├── ZoneEditor.tsx
│   │   │   │   │   └── LightingOverlay.tsx
│   │   │   │   ├── narrative/
│   │   │   │   │   ├── ScriptEditor.tsx
│   │   │   │   │   ├── ScriptPreview.tsx
│   │   │   │   │   └── AudioPreview.tsx
│   │   │   │   └── generation/
│   │   │   │       ├── AssetGrid.tsx
│   │   │   │       ├── JobProgress.tsx
│   │   │   │       └── AssetPreview.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useProject.ts       # Project state management
│   │   │   │   ├── useGeneration.ts    # SSE subscription for gen progress
│   │   │   │   ├── useAutoSave.ts      # Debounced auto-save + snapshot triggers
│   │   │   │   ├── usePuzzleFlow.ts    # Puzzle flow graph state
│   │   │   │   ├── useRevisionHistory.ts   # Load/browse/restore content versions
│   │   │   │   ├── useAssetVersions.ts     # Load/browse/restore asset generations
│   │   │   │   ├── useUndoRedo.ts          # Generic undo/redo stack for canvas/flow
│   │   │   │   ├── useQuickTTSPreview.ts   # Quick TTS preview for narrative scripts
│   │   │   │   └── useRoomPreview.ts       # Composite room preview state across phases
│   │   │   ├── stores/
│   │   │   │   ├── project-store.ts    # Zustand store for active project
│   │   │   │   └── ui-store.ts         # UI state (panels, modals)
│   │   │   └── lib/
│   │   │       ├── api.ts              # API client (fetch wrapper)
│   │   │       └── sse.ts              # SSE client for streaming
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   └── api/                            # Hono API server
│       ├── src/
│       │   ├── index.ts                # Server entry, middleware
│       │   ├── routes/
│       │   │   ├── auth.ts             # Login, register, session
│       │   │   ├── projects.ts         # CRUD, phase management
│       │   │   ├── puzzles.ts          # Puzzle CRUD within project
│       │   │   ├── narratives.ts       # Narrative CRUD within project
│       │   │   ├── layouts.ts          # Room layout CRUD
│       │   │   ├── materials.ts        # Materials/shopping list
│       │   │   ├── assets.ts           # Asset management, download, version browse
│       │   │   ├── revisions.ts       # Content snapshot CRUD, diff, restore
│       │   │   ├── preview.ts         # Quick TTS preview, room composite state
│       │   │   ├── generation.ts       # Trigger generation, SSE progress
│       │   │   ├── collaborators.ts    # Invite, manage collaborators
│       │   │   ├── admin.ts            # Admin config, model management
│       │   │   └── export.ts           # ZIP packaging and download
│       │   ├── middleware/
│       │   │   ├── auth.ts             # Session verification
│       │   │   ├── admin.ts            # Admin role check
│       │   │   └── rate-limit.ts       # Rate limiting
│       │   ├── workers/
│       │   │   ├── text-generation.ts      # LLM text generation worker
│       │   │   ├── image-generation.ts     # Image generation worker
│       │   │   ├── audio-generation.ts     # TTS/voice worker
│       │   │   ├── music-generation.ts     # Music/ambient worker
│       │   │   ├── video-generation.ts     # Video composition worker
│       │   │   ├── pdf-generation.ts       # Document/prop PDF worker
│       │   │   ├── diagram-generation.ts   # SVG diagram worker
│       │   │   ├── stl-generation.ts       # 3D model worker
│       │   │   └── zip-packaging.ts        # Final ZIP assembly worker
│       │   ├── services/
│       │   │   ├── project-service.ts
│       │   │   ├── generation-service.ts   # Orchestrates full generation pipeline
│       │   │   ├── asset-service.ts
│       │   │   ├── revision-service.ts     # Content snapshots, diffs, restore
│       │   │   ├── asset-version-service.ts # Asset version history, carousel data
│       │   │   ├── preview-service.ts      # Quick TTS preview, room composite state
│       │   │   ├── storage-service.ts      # MinIO abstraction
│       │   │   └── payment-service.ts      # Stripe integration
│       │   └── templates/
│       │       ├── props/                  # HTML templates for print-ready props
│       │       │   ├── aged-letter.html
│       │       │   ├── newspaper-clipping.html
│       │       │   ├── evidence-card.html
│       │       │   ├── wanted-poster.html
│       │       │   ├── cipher-wheel.svg
│       │       │   └── ...
│       │       ├── documents/              # DOCX/PDF templates
│       │       │   ├── master-plan.ts
│       │       │   ├── puzzle-spec.ts
│       │       │   ├── gm-manual.ts
│       │       │   └── ...
│       │       ├── diagrams/               # SVG templates
│       │       │   ├── room-layout.ts
│       │       │   ├── puzzle-flow.ts
│       │       │   ├── wiring-diagram.ts
│       │       │   └── ...
│       │       └── video/                  # Remotion compositions
│       │           ├── IntroVideo.tsx
│       │           ├── EndingVideo.tsx
│       │           └── MarketingTrailer.tsx
│       ├── package.json
│       └── Dockerfile
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile.api
│   │   ├── Dockerfile.web
│   │   └── Dockerfile.worker
│   └── docker-compose.yml              # Full stack: web, api, worker, postgres, redis, minio
└── scripts/
    ├── setup.sh                        # Initial setup script
    ├── seed-puzzle-catalog.ts          # Seed complete puzzle catalog
    ├── seed-prompt-library.ts          # Seed all prompt templates
    └── test-generation.ts              # Test AI generation pipeline
```

---

## INITIAL SETUP INSTRUCTIONS

### Step 1: Initialize Monorepo

```bash
mkdir escape-room-forge && cd escape-room-forge
npx create-turbo@latest . --package-manager pnpm
```

### Step 2: Docker Compose for Local Dev

Create `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: forge
      POSTGRES_PASSWORD: forge_dev
      POSTGRES_DB: escape_room_forge
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: valkey/valkey:8-alpine
    ports:
      - "6379:6379"

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: forge_minio
      MINIO_ROOT_PASSWORD: forge_minio_secret
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - miniodata:/data

volumes:
  pgdata:
  miniodata:
```

### Step 3: Environment Variables

Create `.env.example`:

```env
# Database
DATABASE_URL=postgresql://forge:forge_dev@localhost:5432/escape_room_forge

# Redis
REDIS_URL=redis://localhost:6379

# MinIO / S3
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=forge_minio
S3_SECRET_KEY=forge_minio_secret
S3_BUCKET=forge-assets
S3_REGION=us-east-1

# Auth
AUTH_SECRET=generate-a-random-secret-here

# AI Providers (stored in admin_config DB table, these are fallback defaults)
OPENROUTER_API_KEY=your-openrouter-key

# Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
APP_URL=http://localhost:3000
API_URL=http://localhost:3001
```

### Step 4: Initialize Packages

Install core dependencies for each package and bootstrap the workspace.

---

## BUILD ORDER

Follow this exact order. Each step should be a working, testable increment.

### Sprint 1: Foundation (Week 1-2)

**Goal:** Monorepo running, DB connected, auth working, basic project CRUD.

1. Set up Turborepo with `packages/db`, `packages/shared`, `apps/web`, `apps/api`
2. Implement Drizzle schema for `users`, `projects`, `admin_config`
3. Run migrations, verify tables created
4. Implement Lucia auth (email/password) in `apps/api`
5. Build login/register pages in `apps/web` (shadcn/ui forms)
6. Implement project CRUD API (`POST /projects`, `GET /projects`, `GET /projects/:id`, `PATCH /projects/:id`)
7. Build dashboard page showing project cards
8. Build "Create New Project" flow (genre + room type selection)
9. **Test:** Can create account, log in, create a project, see it on dashboard

### Sprint 2: AI Layer + Concept Phase (Week 3-4)

**Goal:** OpenRouter integrated, concept generation working with streaming.

1. Build `packages/ai` — provider abstraction layer
2. Implement OpenRouter adapter with streaming support
3. Implement admin config API + admin model configuration page
4. Build prompt templates for concept generation (stored in code, loaded to DB via seed)
5. Build Phase 1 (Concept) wizard page:
   - Genre selection with definitions panel
   - Room type selection with definitions panel
   - Concept input form (free text + guided prompts)
   - "Generate Concept" button → streams response → displays result
   - Inline editing of generated concept
   - Mood board image generation (integrate first image provider)
6. Implement auto-save hook
7. **Test:** Can select genre, input concept, generate AI concept + images, edit result, see it saved

### Sprint 3: Audience + Puzzles Phase (Week 5-7)

**Goal:** Core puzzle design system working with interactive flow diagram.

1. Seed complete puzzle type catalog into DB (from `escape-room-forge-consolidated.md`)
2. Build Phase 2 (Audience) wizard page:
   - Group size, difficulty, audience type selection
   - AI generates player psychology profile and recommendations
3. Build Phase 3 (Puzzles) wizard page:
   - AI generates initial puzzle set based on concept + audience
   - Puzzle catalog browser (filterable by type, difficulty, cost)
   - Puzzle spec card component (displays all puzzle details)
   - Puzzle editor (edit any field of any puzzle)
   - React Flow diagram for puzzle flow visualization
   - Drag-and-drop puzzle reordering
   - Add/remove puzzles
   - Difficulty curve chart (Recharts)
   - Timing blueprint table
   - "Regenerate this puzzle" / "Give me alternatives" actions
4. Build puzzle CRUD API
5. **Test:** Full concept → audience → puzzle design flow with editing and regeneration

### Sprint 4: Narrative + Layout (Week 8-10)

**Goal:** All scripts generated, room layout canvas working.

1. Build Phase 4 (Narrative) wizard page:
   - Generate all narrative elements (intro, hints, GM scripts, audio/video scripts, endings)
   - Script editor (Tiptap rich text) per narrative element
   - Tabbed view for different script categories
   - Audio preview (quick TTS preview of any script)
   - Regenerate individual scripts
2. Build narrative CRUD API
3. Build Phase 5 (Layout) wizard page:
   - Konva.js 2D room layout canvas
   - Drag-and-drop furniture, props, puzzle stations
   - Zone definition and coloring
   - Lighting plan overlay
   - Sound plan overlay (speaker positions)
   - Entry/exit/emergency marking
   - Export layout as SVG
4. Build room layout API
5. **Test:** Complete narrative generation + editing, layout design on canvas

### Sprint 5: Budget + Materials (Week 11-12)

**Goal:** Materials list with purchase links, budget dashboard, 3D print flagging.

1. Build Phase 6 (Budget) wizard page:
   - Auto-generated materials list from puzzle specs
   - AI enrichment: add purchase links, suggest alternatives
   - Editable quantities, costs, custom items
   - Budget breakdown chart (by category)
   - Budget vs. allocation comparison
   - 3D-printable flag per item
   - Parts list for electronics with component links
2. Build materials CRUD API
3. Build business plan generation (pricing, financial projections, marketing plan)
4. **Test:** Full budget calculation, materials list with links, business docs generated

### Sprint 6: Generation Pipeline (Week 13-15)

**Goal:** Full asset generation working — text docs, images, audio, video, 3D, PDFs.

1. Implement BullMQ job queue with workers:
   - `text-generation` worker (documents, business plans)
   - `image-generation` worker (concept art, props, marketing)
   - `audio-generation` worker (TTS narration, hints, ambient)
   - `music-generation` worker (background tracks)
   - `diagram-generation` worker (SVG flow diagrams, layout diagrams, wiring)
   - `pdf-generation` worker (print-ready props, documents)
   - `stl-generation` worker (OpenSCAD parametric models)
   - `video-generation` worker (Remotion composition)
2. Implement quality gate checks per asset type
3. Build Phase 8 (Generate) page:
   - Full asset checklist with status indicators
   - Real-time progress via SSE
   - Preview-on-complete for each asset
   - Regenerate failed/unsatisfactory assets
   - Cost tracking display
4. Build MinIO storage service (upload, signed URL retrieval)
5. Build all prop PDF templates (aged letters, evidence cards, cipher wheels, etc.)
6. Build all document templates (master plan DOCX, puzzle binder, GM manual)
7. Build Remotion video compositions (intro, endings, marketing trailer)
8. Build OpenSCAD parametric templates (hidden compartment, lock housing, etc.)
9. **Test:** Trigger full generation, watch all assets generate, preview each

### Sprint 7: Export + Payment (Week 16-17)

**Goal:** ZIP packaging, Stripe payment, download flow.

1. Build ZIP packaging worker:
   - Assemble all assets into folder structure (per PRD spec)
   - Generate manifest (JSON + PDF index)
   - Stream ZIP creation (Archiver)
2. Build Phase 9 (Download) page:
   - Branded download page with room summary
   - ZIP download button
   - Manifest preview
3. Integrate Stripe:
   - One-time payment checkout
   - Payment verification before generation trigger
   - Receipt email
4. Build project dashboard enhancements:
   - Re-open completed projects
   - Version snapshots
   - Project status cards
5. **Test:** End-to-end: create project → build through all phases → pay → generate → download ZIP

### Sprint 8: Polish + Launch (Week 18-20)

**Goal:** Production-ready, tested, deployed.

1. Collaborator system (invite, view, comment)
2. Review phase (unified preview of entire project)
3. Error handling and retry logic for all generation jobs
4. Loading states, empty states, error states for all UI
5. Mobile responsive (at minimum: dashboard, review, download)
6. Landing page / marketing page
7. E2E tests (Playwright) for critical flows
8. Performance optimization (lazy loading, image optimization)
9. Docker production build
10. Deploy to production
11. Beta testing
12. Launch

---

## KEY IMPLEMENTATION NOTES

### AI Provider Pattern

```typescript
// packages/ai/src/providers/base.ts
export interface TextGenerationConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt: string;
  userPrompt: string;
  responseFormat?: 'json' | 'text';
  stream?: boolean;
}

export interface TextGenerationResult {
  content: string;
  model: string;
  usage: { inputTokens: number; outputTokens: number };
  costCents: number;
}

export interface ImageGenerationConfig {
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  style?: string;
  quality?: 'standard' | 'hd';
}

export interface AudioGenerationConfig {
  text: string;
  voice: string;
  speed?: number;
  format?: 'mp3' | 'wav';
  effects?: { reverb?: boolean; ambient?: string };
}

export abstract class AIProvider {
  abstract generateText(config: TextGenerationConfig): Promise<TextGenerationResult>;
  abstract generateTextStream(config: TextGenerationConfig): AsyncGenerator<string>;
}

export abstract class ImageProvider {
  abstract generateImage(config: ImageGenerationConfig): Promise<Buffer>;
}

export abstract class AudioProvider {
  abstract generateAudio(config: AudioGenerationConfig): Promise<Buffer>;
}

export abstract class MusicProvider {
  abstract generateMusic(prompt: string, durationSec: number): Promise<Buffer>;
}
```

### Task Router

```typescript
// packages/ai/src/router.ts
export class TaskRouter {
  constructor(private configService: AdminConfigService) {}

  async getTextProvider(taskType: 'orchestrator' | 'routine'): Promise<AIProvider> {
    const config = await this.configService.get(`llm.${taskType}`);
    return ProviderRegistry.createTextProvider(config);
  }

  async getImageProvider(): Promise<ImageProvider> {
    const config = await this.configService.get('media.image');
    return ProviderRegistry.createImageProvider(config);
  }

  async getAudioProvider(): Promise<AudioProvider> {
    const config = await this.configService.get('media.voice');
    return ProviderRegistry.createAudioProvider(config);
  }

  // ... same for music, video, 3d
}
```

### Generation Orchestrator

```typescript
// apps/api/src/services/generation-service.ts
export class GenerationService {
  async generateAllAssets(projectId: string): Promise<void> {
    const project = await this.projectService.getFullProject(projectId);

    // Phase 1: Text documents (can run in parallel)
    await Promise.all([
      this.queueJob('text', { type: 'master-plan', projectId }),
      this.queueJob('text', { type: 'puzzle-binder', projectId }),
      this.queueJob('text', { type: 'gm-manual', projectId }),
      this.queueJob('text', { type: 'solution-guide', projectId }),
      this.queueJob('text', { type: 'business-docs', projectId }),
      this.queueJob('text', { type: 'marketing-copy', projectId }),
    ]);

    // Phase 2: Media assets (can run in parallel)
    await Promise.all([
      // Images
      ...this.getImageJobs(project),
      // Diagrams
      this.queueJob('diagram', { type: 'room-layout', projectId }),
      this.queueJob('diagram', { type: 'puzzle-flow', projectId }),
      this.queueJob('diagram', { type: 'wiring', projectId }),
      this.queueJob('diagram', { type: 'difficulty-curve', projectId }),
      // Audio
      ...this.getAudioJobs(project),
      // Music
      this.queueJob('music', { type: 'ambient', projectId }),
      this.queueJob('music', { type: 'theme', projectId }),
      // 3D models
      ...this.get3DJobs(project),
    ]);

    // Phase 3: Composed assets (depend on Phase 2)
    await Promise.all([
      // Print-ready props (need images)
      ...this.getPropPDFJobs(project),
      // Videos (need audio + images)
      this.queueJob('video', { type: 'intro', projectId }),
      this.queueJob('video', { type: 'win-ending', projectId }),
      this.queueJob('video', { type: 'loss-ending', projectId }),
      this.queueJob('video', { type: 'marketing-trailer', projectId }),
    ]);

    // Phase 4: Final assembly
    await this.queueJob('zip', { projectId });
  }
}
```

### SSE Progress Updates

```typescript
// apps/api/src/routes/generation.ts
app.get('/projects/:id/generation/stream', async (c) => {
  const projectId = c.req.param('id');

  return c.newResponse(
    new ReadableStream({
      start(controller) {
        const subscriber = redis.subscribe(`generation:${projectId}`);
        subscriber.on('message', (channel, message) => {
          controller.enqueue(`data: ${message}\n\n`);
        });
      }
    }),
    { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } }
  );
});
```

### Print-Ready Prop Pipeline

```typescript
// apps/api/src/workers/pdf-generation.ts
async function generatePropPDF(job: Job): Promise<string> {
  const { propType, content, style, projectId } = job.data;

  // 1. LLM generates the content (already done in narrative phase)
  // 2. Load HTML template for prop type
  const template = loadTemplate(`props/${propType}.html`);

  // 3. Inject content + apply aging/distress effects
  const html = renderTemplate(template, {
    content,
    style, // genre-specific visual style
    aging: style.agingLevel, // none, light, heavy, burned
    fontFamily: style.font, // typewriter, handwritten, serif, gothic
  });

  // 4. Render to PDF at 300 DPI
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
  });

  // 5. Store in MinIO
  const path = `projects/${projectId}/props/${propType}.pdf`;
  await storage.upload(path, pdf, 'application/pdf');

  return path;
}
```

---

## TESTING STRATEGY

### Unit Tests (Vitest)
- All utility functions in `packages/shared`
- AI provider adapters (mock API calls)
- Budget calculation logic
- Puzzle flow validation
- Quality gate checks

### Integration Tests
- API routes with test database
- Generation workers with mocked AI providers
- PDF generation pipeline
- ZIP packaging

### E2E Tests (Playwright)
- Complete wizard flow (create project → all phases → generate)
- Authentication flow
- Admin configuration
- Asset preview and download

---

## GETTING STARTED

```bash
# 1. Clone and install
git clone <repo-url>
cd escape-room-forge
pnpm install

# 2. Start infrastructure
docker compose up -d

# 3. Set up environment
cp .env.example .env
# Edit .env with your API keys

# 4. Run migrations and seed
pnpm --filter db migrate
pnpm --filter db seed

# 5. Start development
pnpm dev
```

This starts:
- Next.js frontend on `http://localhost:3000`
- Hono API on `http://localhost:3001`
- BullMQ workers processing jobs

---

## CRITICAL FIRST FILE TO BUILD

Start with `packages/shared/src/constants/puzzle-catalog.ts` — seed the complete puzzle type catalog from the `escape-room-forge-consolidated.md` reference. This is the data backbone that every other system references. Then build the Drizzle schema. Then auth. Then the wizard shell. Then start filling in phases one by one.


---
---

*Escape Room Forge v1.1 (Consolidated) — Complete system reference combining design system, product requirements, and implementation guide. Built for escape room creators who want AI as a design partner, business advisor, and creative collaborator.*
