A white sheet with a hairline edge and 20px corners, plus solid red, black and grey **tiles** for headlines and shortcuts.

## When to use
- `variant="issue"`: board and list cards. Key (or a status badge) and watch on top, condensed title, `Project · Platform` subline, then a meta row (priority, points, due) or a red progress bar, and a footer with assignee, age and a "View issue" link.
- Panel (default): sections in issue detail, sprint summaries, settings groups.
- `variant="tile"` with `tone` `brand` / `ink` / `muted`: dashboard shortcuts and one poster per screen (`SHIP IT. SPRINT 24.`). Tiles carry an `eyebrow` and a `poster` or `headline`. They're not for data.

## Consumer provides
- Issue: `title`, `issueKey`, optional `status` (shows a badge instead of the key), `project`, `priority`, `points`, `due` + `overdue`, `progress` (0–100), `assignee`, `age`, `watched`, `selected`, `linkLabel`.
- Panel: `title`, `actions`, `children`, `footer`.
- Tile: `tone`, `eyebrow`, `children` (a `poster`, using `<em>` for the red second line on ink tiles).

## Web recipe
```tsx
<article tabIndex={0} className="rounded-[20px] border border-line bg-surface p-6 hover:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring aria-selected:border-2 aria-selected:border-ink">
  <div className="flex items-start"><span className="text-meta font-semibold text-ink-muted font-stretch-semi-condensed">PAY-1482</span><span className="flex-1" /><BookmarkButton /></div>
  <h3 className="mt-3 text-title font-extrabold font-stretch-condensed">Checkout fails on saved cards</h3>
  <p className="mt-3 font-bold text-ink-muted font-stretch-semi-condensed">Payments · iOS</p>
  <div className="mt-4 flex gap-5 font-bold text-ink-muted font-stretch-semi-condensed">…priority · points · due</div>
  <footer className="mt-4 flex items-center gap-3 border-t border-line-strong pt-4"><Avatar /><span className="text-meta text-ink-muted">Updated 2h ago</span><span className="flex-1" /><a className="link">View issue</a></footer>
</article>

<section className="flex min-h-[200px] flex-col justify-between rounded-[28px] bg-ink p-8 text-on-ink">
  <h2 className="headline text-poster leading-[.92]">Ship it.<br /><span className="text-brand">Sprint 24.</span></h2>
</section>
```

## Do / don't
- Do keep one poster tile per screen at most.
- Don't add shadows to cards, and don't colour a card by status. The badge does that.
- Don't nest cards inside tiles.

## Native
`Pressable` with `rounded-[20px] border border-line bg-surface p-6`; tiles `rounded-[28px]`. Poster text uses Archivo Condensed ExtraBold.
