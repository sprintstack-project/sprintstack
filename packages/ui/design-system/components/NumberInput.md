A segmented stepper: minus, the value, plus, separated by 1.5px dividers inside one field.

## Consumer provides
`id`, `value`/`onValueChange` or `defaultValue`, `min`, `max`, `step`, optional `unit`, `invalid`, `disabled`.

## Web recipe (Base UI NumberField)
```tsx
import { NumberField } from "@base-ui/react/number-field";
<NumberField.Root min={0} max={21} defaultValue={3}>
  <NumberField.Group className="field flex overflow-hidden">
    <NumberField.Decrement className="grid w-16 place-items-center border-r-[1.5px] border-line-strong hover:bg-surface-hover disabled:text-ink-disabled"><Minus size={24} /></NumberField.Decrement>
    <NumberField.Input className="min-w-0 flex-1 bg-transparent text-center text-lg tabular-nums outline-none" />
    <NumberField.Increment className="grid w-16 place-items-center border-l-[1.5px] border-line-strong hover:bg-surface-hover disabled:text-ink-disabled"><Plus size={24} /></NumberField.Increment>
  </NumberField.Group>
</NumberField.Root>
```

## Rules
- Centre the value. Disable a stepper at its bound.
- Out-of-range typed values stay as typed, get marked invalid, and the error states the range.

## Native
A row: 64px `Pressable` −, centred `TextInput keyboardType="number-pad"`, 64px `Pressable` +. Long-press repeats.
