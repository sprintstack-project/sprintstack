Type a date in plain words ("fri", "+3d", "next mon", an ISO date) or pick from a gridded month. The field shows the date and a live countdown.

## Consumer provides
`id`, `value`/`onValueChange` or `defaultValue` (ISO), `placeholder`, `min`/`max`, `weekStartsOn` (from locale; Monday in Europe), `dueStyle` (past dates count up in `danger`), `shortcut` (opens it from anywhere, e.g. `D`), `invalid`, `disabled`.

## Web recipe (Base UI Popover + react-day-picker + a parser)
```tsx
import { Popover } from "@base-ui/react/popover";
import { DayPicker } from "react-day-picker";

<Popover.Root>
  <Popover.Trigger className="screen flex h-[30px] w-full items-center gap-2 px-2 text-body">
    <Calendar size={14} className="text-ink-muted" />
    <span className="flex-1 text-left font-mono">{value ? fmt(value) : <span className="font-sans text-ink-placeholder">Pick or type a date</span>}</span>
    {value && <span className="font-mono text-[11px] text-ink-muted data-[over]:text-danger">{countdown(value)}</span>}
  </Popover.Trigger>
  <Popover.Portal><Popover.Positioner sideOffset={4} align="start" className="z-50">
    <Popover.Popup className="w-72 overflow-hidden rounded-md bg-surface-raised shadow-popover">
      <div className="flex h-8 items-center gap-2 border-b border-line px-2">
        <input autoFocus placeholder="fri, +3d, next mon" className="flex-1 bg-transparent font-mono text-meta outline-none" onChange={e => setPreview(parse(e.target.value))} />
        {preview && <span className="font-mono text-[11px] text-accent-ink">→ {short(preview)} ↵</span>}
      </div>
      <DayPicker mode="single" weekStartsOn={1} showOutsideDays selected={value} onSelect={choose} modifiers={{ preview }}
        classNames={{
          month_grid: "w-full border-separate border-spacing-px bg-line rounded-sm",
          weekday: "bg-surface py-1 font-mono text-[10px] uppercase tracking-[.06em] text-ink-muted",
          day: "h-[30px] bg-surface-raised p-0 text-center font-mono text-meta tabular-nums",
          day_button: "size-full hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring",
          today: "text-accent-ink font-medium [&>button]:shadow-[inset_0_-2px_0_var(--accent-ink)]",
          selected: "!bg-accent text-on-accent font-medium", outside: "bg-surface text-ink-muted",
        }} modifiersClassNames={{ preview: "shadow-[inset_0_0_0_2px_var(--focus-ring)] text-accent-ink" }} />
      <KeyLegend items={[["↑↓", "move"], ["↵", "set"]]} right={<><kbd className="kbd">T</kbd> today</>} />
    </Popover.Popup>
  </Popover.Positioner></Popover.Portal>
</Popover.Root>
```
`SprintStack.parseDate(text, today)` in the bundle is a reference parser covering `today`, `tom`, `+Nd`, `+Nw`, weekday names, `next <weekday>` and ISO dates. Swap in `chrono-node` if you need more phrasing or other languages.

## Rules
- Field format is `27 Oct 2026` (mono, zero-padded day) plus a countdown: `T-4D`, `today`, `2D OVER`.
- Typing previews the parsed date with a lime outline. Enter commits it. Clicking a day commits immediately.
- Today has a lime underline; the selected day is a lime fill, so they're never confused.

## Native
A `Pressable` trigger at `h-11` opens a sheet with the same type-a-date field above the grid (react-native-calendars `dayComponent`), with 44px cells.
