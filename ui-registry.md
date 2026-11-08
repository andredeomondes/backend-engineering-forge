# UI Registry — Backend Engineering Forge

Established: 2026-07-26

The shared tokens live in `tools/forge-web/src/styles.css`. New components must
reuse these tokens before adding another color, radius or interaction pattern.

### Operational Panel

File: `tools/forge-web/src/styles.css`

| Property | Pattern |
| --- | --- |
| Background | `var(--surface)` |
| Border | `1px solid var(--line)` |
| Border radius | `6px` |
| Text — primary | `var(--ink)` |
| Text — secondary | `var(--muted)` |
| Heading | `16px`, weight inherited from semantic heading |
| Spacing | `21px` padding, `16–22px` section gaps |
| Shadow | none |
| Accent | green for active/success, amber for due, blue for informational |

**Pattern notes:** Panels frame a complete tool or dataset. Do not nest a panel
inside another panel. Separate rows with `var(--line)` rather than wrapping each
row in a card.

### Command Button

File: `tools/forge-web/src/styles.css`

| Property | Pattern |
| --- | --- |
| Primary background | `var(--green)` |
| Secondary background | `#eef2f1` |
| Border | none primary, `1px solid #d8dfdd` secondary |
| Border radius | `5px` |
| Text | `13px`, weight `700` |
| Spacing | minimum height `39px`, horizontal padding `15px` |
| Hover | darker green or neutral surface |
| Disabled | opacity `0.55` |

**Pattern notes:** Use icon plus text for clear commands. Standalone icon
buttons are reserved for familiar navigation actions and must have a tooltip.

### Form Control

File: `tools/forge-web/src/styles.css`

| Property | Pattern |
| --- | --- |
| Background | `#fbfcfc` |
| Border | `1px solid #cfd8d5` |
| Border radius | `4px` |
| Label | `12px`, weight `650`, `var(--muted)` |
| Spacing | `9px 10px` control padding, `6px` label gap |
| Focus | green border with subtle green focus ring |

**Pattern notes:** Labels remain visible above their controls. Placeholder text
is supporting context, never the only accessible label.

### Status Badge

File: `tools/forge-web/src/styles.css`

| Property | Pattern |
| --- | --- |
| Informational | blue text on `var(--blue-soft)` |
| Complete | green text on `var(--green-soft)` |
| Border radius | `4px` |
| Text | `11px`, weight `700` |
| Spacing | minimum height `24px`, horizontal padding `8px` |

**Pattern notes:** Badges communicate state only. They are not buttons and do
not receive hover styling.

### Roadmap and Track Lists

File: `tools/forge-web/src/components/ProgressView.tsx`
Last updated: 2026-08-16

| Property | Pattern |
| --- | --- |
| Background | `var(--surface)` |
| Border | `1px solid var(--line)`, row separators `#edf0ef` |
| Border radius | `6px` section, `4px` number/status marker |
| Text — primary | `var(--ink)`, `12–13px` |
| Text — secondary | `var(--muted)`, `10–11px` |
| Spacing | `20px` section padding, `10–12px` row gaps |
| Hover state | none for informational rows |
| Shadow | none |
| Accent usage | green completed, blue active/informational, muted locked |

**Pattern notes:** Roadmap and specialization rows are informational, not
interactive cards. Reuse the panel header and status badge patterns. Dense
phase lists use two columns on desktop and one column on narrow screens.

### Trail Node

File: `tools/forge-web/src/styles/trail.css`
Last updated: 2026-11-08

| Property | Pattern |
| --- | --- |
| Background | `var(--background)` (todo), `var(--foreground)` (done/current) |
| Border | `2px solid var(--foreground)`; `dashed` for side quests (Java, DSA) while not done |
| Border radius | none |
| Text | Press Start 2P; progress bar line `8px`; inverted `var(--background)` on filled states |
| Spacing | min-height `44px`, `10px 12px` padding, `6px` gap (compact: `38px`, `7px 10px`, `4px`) |
| Hover | `translateX(3px)`, `steps(2)` transition `0.1s` |
| Focus | `2px solid var(--foreground)`, offset `3px` |
| Selected | `aria-pressed="true"` draws a `2px dashed` ring, offset `3px` |
| Current | inverted fill + stepped blink (`1.1s steps(2)`, opacity `0.35`) + "◀ AQUI" text |
| Shadow | none |

**Pattern notes:** States are monochrome and never rely on hue: todo = outline,
done = filled, current = inverted + blink, side quest = dashed outline,
selected = dashed ring. Phases are always clickable; no state means "locked".
Nodes sit in level groups (`1px solid var(--border)`, dashed for side groups) and
the tree collapses to one column under `520px` container width. With
`prefers-reduced-motion: reduce` the blink and hover motion are removed.

### Character Sheet

File: `tools/forge-web/src/styles/trail.css`
Last updated: 2026-11-08

| Property | Pattern |
| --- | --- |
| Background | `var(--card)` |
| Border | `2px solid var(--foreground)`, inner divider `1px solid var(--border)` |
| Border radius | none |
| Label (`.trail-k`) | Press Start 2P `8px`, uppercase, `0.05em` tracking, `var(--muted-foreground)` |
| Value (`.trail-v`) | `11px`, line-height `1.7` |
| Meter | `2px` border; fill is a `6px/2px` hatch stripe (`repeating-linear-gradient`); heights `16px` lg, `12px` sm, `14px` solid |
| Spacing | `16px 18px` padding, `18px` column gap, `14px` label top margin |
| Layout | 3 columns, then a 2-column side row; one column under `720px` (padding `14px`) |
| Shadow | none |

**Pattern notes:** The sheet is a single panel and holds no nested panel; columns
are separated by gaps and the side row by a `1px` rule. Progress is shown with
stepped hatch meters and counts (`8px`, `var(--muted-foreground)`), never a
colored bar. Reuse `.trail-meter` for any percentage.

### Mission Card

File: `tools/forge-web/src/styles/unit.css`
Last updated: 2026-11-08

| Property | Pattern |
| --- | --- |
| Background | `var(--card)` |
| Border | `2px solid var(--foreground)`; head rule `2px`, section rules `1px solid var(--border)` |
| Border radius | none |
| Name | Press Start 2P `12px`, line-height `1.6` |
| Long text | `var(--font-read)` (JetBrains Mono) `14px`, line-height `1.6–1.65`; code/IO `12–12.5px` |
| Badge | `2px` border, `7px`, uppercase; `.is-passed`/`.is-inv` inverted, `.is-manual` dashed, `.is-failing` double `4px` |
| Spacing | head `16px 18px`, sections `14px 18px`, `8–12px` gaps |
| Summary / note | summary `4px` left rule on `var(--muted)`; note `2px dashed` box |
| Buttons | `.unit-btn`: `2px` border, `8px` Press Start 2P, primary inverted, hover `translateY(-2px)`, disabled opacity `0.45` |
| Shadow | none |

**Pattern notes:** One card per mission; sections are divided by rules, not
nested cards. Verdict states are monochrome: failing = double border, passed =
filled, "marcada · sem teste verde" (manual) = dashed outline. Long statements,
rules, hints and code use `--font-read`; labels, badges and numbers keep Press
Start 2P. Two-column and I/O grids collapse to one column under `640px`.
Hover motion and the gate badge blink are disabled under `prefers-reduced-motion`.

### Quest Log

File: `tools/forge-web/src/styles/unit.css`
Last updated: 2026-11-08

| Property | Pattern |
| --- | --- |
| Background | `var(--card)` |
| Border | `2px solid var(--foreground)`; group rules `1px solid var(--border)`, legend rule `2px` |
| Border radius | none |
| Row | Press Start 2P `8px`, `8px 14px` padding, `10px` gap, `3px` transparent left border |
| Group title | `7px`, uppercase, `var(--muted-foreground)` |
| Selected row | inverted (`var(--foreground)` fill), focus outline flips to `var(--background)` |
| Hover | `var(--muted)` on non-selected rows |
| Status square | `12px`, `2px` currentColor border: todo = empty, failing = ✕, passed = filled, manual = dashed `45deg` hatch |
| Position | sticky at `top: 84px`, `max-height: calc(100vh - 100px)`; static under `900px` |
| Shadow | none |

**Pattern notes:** The log is a single list panel beside the mission card (`300px`
column). Status squares inherit `currentColor` so they stay legible on selected
rows in both themes. The legend repeats the four squares in `7px` text. Every
mission stays selectable; no row is disabled. Empty state uses `--font-read`
`13px`.
