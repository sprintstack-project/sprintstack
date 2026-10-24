A field that opens a rounded calendar: round 44px days, today ringed in ink, the selected day filled red. Tap the month title to switch to a 4×3 grid of month pills.

## Consumer provides
`id`, `value`/`onValueChange` or `defaultValue` (ISO date), `placeholder`, `min`/`max`, `weekStartsOn` (Monday in Europe), `dueStyle` (past dates read "· Overdue" in red), `defaultView` (`days` | `months`), `invalid`, `disabled`.

## Web recipe (Base UI Popover + react-day-picker)
```tsx
import { Popover } from "@base-ui/react/popover";
import { DayPicker } from "react-day-picker";
<Popover.Root>
  <Popover.Trigger className="field flex w-full items-center gap-3 px-5 text-[17px]"><Calendar size={24} className="text-ink-muted" />{label}<Caret /></Popover.Trigger>
  <Popover.Portal><Popover.Positioner sideOffset={8} align="start" className="z-50">
    <Popover.Popup className="w-[360px] rounded-[20px] border border-line bg-surface p-5 shadow-popover">
      <DayPicker mode="single" weekStartsOn={1} selected={value} onSelect={setValue} captionLayout="label"
        classNames={{
          month_caption: "headline text-[22px] text-center", weekday: "pb-2 text-sm font-extrabold text-ink-muted font-stretch-condensed",
          day_button: "size-11 rounded-full text-[17px] font-bold tabular-nums font-stretch-semi-condensed hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
          today: "[&>button]:shadow-[inset_0_0_0_2px_var(--ink)]", selected: "[&>button]:bg-brand [&>button]:text-on-brand [&>button]:shadow-none",
          outside: "invisible" }} />
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3"><a className="link">Clear</a><Button variant="primary" size="sm">Today</Button></div>
    </Popover.Popup>
  </Popover.Positioner></Popover.Portal>
</Popover.Root>
```
For the month grid, render 12 `rounded-full bg-surface-muted h-12` buttons in a 4-column grid, with the selected month in `bg-brand text-on-brand`.

## Rules
- Format dates as `30 Oct 2026`. Hide days outside the month.
- Today is a ring and the selection is a red fill, so the two can't be confused.

## Native
A trigger `Pressable` opens a sheet with the same grid (react-native-calendars `dayComponent`) and 44px round cells.
