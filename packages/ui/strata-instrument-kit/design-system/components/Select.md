A screen-style trigger that opens a keyboard-driven list: arrow keys move, `1–9` jumps to an option, and a key legend sits in the footer.

## Consumer provides
`id`, `options: { value, label, status?, avatar?, description?, disabled? }[]`, `value`/`onValueChange` or `defaultValue`, `placeholder`, `shortcut` (opens it from anywhere, e.g. `⇧S`), `size`, `invalid`, `disabled`.

## Web recipe (Base UI Select)
```tsx
import { Select } from "@base-ui/react/select";
<Select.Root items={options} defaultValue="progress">
  <Select.Trigger className="screen flex h-[30px] w-full items-center gap-2 px-2 text-body">
    <Select.Value className="flex-1 truncate text-left data-[placeholder]:text-ink-placeholder" />
    <ChevronsUpDown size={14} className="text-ink-muted" />
  </Select.Trigger>
  <Select.Portal>
    <Select.Positioner sideOffset={4} alignItemWithTrigger={false} className="z-50">
      <Select.Popup className="max-h-80 min-w-[var(--anchor-width)] overflow-hidden rounded-md bg-surface-raised shadow-popover data-[starting-style]:opacity-0 transition-opacity duration-75">
        <Select.List className="p-1">
          {options.map((o, i) => (
            <Select.Item key={o.value} value={o.value}
              className="flex h-[30px] items-center gap-2 rounded-sm px-2 text-body outline-none data-[highlighted]:bg-surface-pressed data-[selected]:font-medium data-[selected]:text-accent-ink">
              <StatusMeter tone={o.status} /><Select.ItemText>{o.label}</Select.ItemText>
              <span className="ml-auto flex items-center gap-2"><Select.ItemIndicator><Check size={14} /></Select.ItemIndicator><kbd className="kbd">{i + 1}</kbd></span>
            </Select.Item>))}
        </Select.List>
        <KeyLegend items={[["↑↓", "move"], ["↵", "select"], ["1–5", "jump"]]} />
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>
```
Base UI gives you arrow keys and typeahead. Add the digit handler in `onKeyDown` on the Popup.

## Rules
- Number hints cover the first 9 options only. Longer lists use a Combobox with type-to-filter.
- The selected option is lime text with a check. Keyboard highlight is `surface-pressed`, so the two never look alike.

## Native
A `Pressable` trigger at `h-11` opens a bottom sheet of 44px rows. With a hardware keyboard (iPad), the digit shortcuts work and the legend shows.
