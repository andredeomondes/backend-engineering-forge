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
