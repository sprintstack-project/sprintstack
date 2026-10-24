An issue card on the dot-grid board, or a panel with a mono header bar: 1px lines, no fills beyond `surface`, selection shown with lime crop marks.

## When to use
- `variant="issue"`: board cards. The layout is fixed: key + tags + priority tag on top, the title, then status meter · due countdown · points · assignee.
- Panel (default): side-panel sections, sprint summaries, dashboards. The header is a 32px bar with a `label-caps` title and ghost actions on the right.
- Backlog and tables use 36px rows with the same anatomy flattened to one line, not cards.

## Consumer provides
- Issue: `title`, `issueKey`, `status`, optional `priority`, `points`, `assignee`, `labels`, `due` (a countdown string such as `T-2D` / `2D OVER`) + `dueState` (`soon` / `over`), `selected`.
- Panel: `title`, optional `actions`, `children`, `footer`.
- Column header: `label-caps` name plus a WIP counter (`3 / 3 WIP`, amber when at or over the limit).

## Web recipe
```tsx
<article tabIndex={0} data-selected={selected || undefined}
  className="relative flex flex-col gap-2 rounded-md border border-line bg-surface px-3 py-2.5 hover:border-line-hover
             focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus-ring
             data-[selected]:border-line-strong data-[selected]:before:absolute data-[selected]:before:-inset-[5px] data-[selected]:before:[background:var(--crop-marks)]">
  <div className="flex items-center gap-2"><span className="font-mono text-meta text-ink-muted">{key}</span>{tags}<span className="flex-1" /><PriorityTag level="high" /></div>
  <p className="text-body text-ink">{title}</p>
  <div className="flex items-center gap-2"><StatusMeter tone="info">In progress</StatusMeter><span className="flex-1" />
    <span className="font-mono text-[11px] text-warning">T-2D</span><span className="font-mono text-meta text-ink-muted">5pt</span><Avatar /></div>
</article>
```
Define `--crop-marks` once in CSS: eight `linear-gradient(var(--accent-ink), var(--accent-ink))` layers sized 10×2 / 2×10 at the four corners (see `bundle.css`, `.st-issue[data-selected]::before`).

## Do / don't
- Do keep cards one size: titles clamp to 2 lines (`line-clamp-2`).
- Don't fill cards by status or priority. The meter and the tag carry it.
- Don't show more than 2 tags on a card. Add `+N` in `meta`.

## Native
`Pressable` with a 1px `line` border. Draw the crop marks with four 10×10 absolutely positioned `View`s using two borders each. Long-press drags with `shadow-drag`.
