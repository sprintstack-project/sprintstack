A mono figure with a vertical stepper rack: story points, estimates, capacity, WIP limits.

## Consumer provides
`id`, `value`/`onValueChange` or `defaultValue`, `min`, `max`, `step`, optional `unit`, `format`, `invalid`, `disabled`. Pair with `Field scrub` to drag-adjust from the label.

## Web recipe (Base UI NumberField)
```tsx
import { NumberField } from "@base-ui/react/number-field";
<NumberField.Root min={0} max={21} defaultValue={3}>
  <NumberField.ScrubArea className="label-caps cursor-ew-resize">Story points ↔</NumberField.ScrubArea>
  <NumberField.Group className="screen flex h-[30px] items-center gap-2 overflow-hidden pl-2">
    <NumberField.Input className="min-w-0 flex-1 bg-transparent font-mono text-body tabular-nums text-ink outline-none" />
    {unit && <span className="font-mono text-meta text-ink-muted">{unit}</span>}
    <span className="flex flex-col self-stretch border-l border-line-strong">
      <NumberField.Increment tabIndex={-1} className="grid w-[22px] flex-1 place-items-center bg-surface text-ink-muted hover:bg-surface-hover hover:text-ink"><ChevronUp size={10} /></NumberField.Increment>
      <NumberField.Decrement tabIndex={-1} className="grid w-[22px] flex-1 place-items-center border-t border-line bg-surface text-ink-muted hover:bg-surface-hover hover:text-ink"><ChevronDown size={10} /></NumberField.Decrement>
    </span>
  </NumberField.Group>
</NumberField.Root>
```
Steppers are taken out of the Tab order because the arrow keys do the same job: ↑/↓ steps, Shift+↑/↓ ×10, and Base UI handles wheel and scrub.

## Rules
- Figures are always mono and tabular.
- Disable a stepper at its bound. Keep typed out-of-range values, mark them invalid and state the range.

## Native
`TextInput keyboardType="decimal-pad"` in Geist Mono, with a two-button rack (`hitSlop={11}` for 44px). Long-press repeats. Show a scrub hint only on iPad with a pointer.
