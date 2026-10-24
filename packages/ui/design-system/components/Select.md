A field-shaped trigger with a solid caret that opens a rounded menu: icons on the left, hairlines between rows, a red check on the selected row, and an optional red destructive row at the end.

## Consumer provides
`id`, `options: { value, label, icon?, status?, avatar?, description?, disabled?, danger? }[]`, `value`/`onValueChange` or `defaultValue`, `placeholder`, `size`, `invalid`, `disabled`.

## Web recipe (Base UI Select)
```tsx
import { Select } from "@base-ui/react/select";
<Select.Root items={options} defaultValue="recent">
  <Select.Trigger className="field flex w-full items-center gap-3 px-5 text-[17px]">
    <Select.Value className="flex-1 truncate text-left data-[placeholder]:text-ink-placeholder" />
    <Select.Icon className="transition-transform data-[popup-open]:rotate-180"><Caret /></Select.Icon>
  </Select.Trigger>
  <Select.Portal><Select.Positioner sideOffset={8} alignItemWithTrigger={false} className="z-50">
    <Select.Popup className="min-w-[var(--anchor-width)] rounded-2xl border border-line bg-surface p-2 shadow-popover">
      <Select.List>{options.map(o => (
        <Select.Item key={o.value} value={o.value}
          className="relative flex min-h-14 items-center gap-4 rounded-xl px-4 text-[17px] outline-none data-[highlighted]:bg-surface-hover data-[disabled]:text-ink-disabled
                     [&+&]:before:absolute [&+&]:before:inset-x-0 [&+&]:before:top-0 [&+&]:before:h-px [&+&]:before:bg-line">
          <o.Icon size={24} /><Select.ItemText>{o.label}</Select.ItemText>
          <Select.ItemIndicator className="ml-auto text-brand-ink"><Check size={24} /></Select.ItemIndicator>
        </Select.Item>))}</Select.List>
    </Select.Popup>
  </Select.Positioner></Select.Portal>
</Select.Root>
```

## Rules
- Use a solid caret (▾) for selects and a chevron for multi-selects and nav.
- A destructive action ("Clear this view") can sit at the end of a menu in `brand-ink`. Never put it first.

## Native
A `Pressable` trigger opens a bottom sheet with the same 56px rows, hairlines and red check.
