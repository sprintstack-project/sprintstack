A field that collects choices as solid ink pills and opens a checkbox menu you can filter by typing.

## Consumer provides
`id`, `options` (or `loadOptions`), `value`/`onValueChange` or `defaultValue` (array), `placeholder`, `chipTone` (`ink` default, `neutral` for softer pills), optional `creatable`, `max`, `invalid`, `disabled`.

## Web recipe (Base UI Combobox, multiple)
```tsx
import { Combobox } from "@base-ui/react/combobox";
<Combobox.Root items={labels} multiple>
  <Combobox.Chips className="field relative flex w-full flex-wrap items-center gap-2 py-2 pl-2.5 pr-12">
    <Combobox.Value>{(sel) => sel.map(l => (
      <Combobox.Chip key={l.id} className="inline-flex h-[34px] items-center gap-2 rounded-full bg-ink pl-3.5 pr-3 text-[15px] font-semibold text-on-ink font-stretch-semi-condensed">
        {l.name}<Combobox.ChipRemove aria-label={`Remove ${l.name}`} className="grid size-[22px] place-items-center rounded-full hover:bg-white/25"><X size={18} /></Combobox.ChipRemove>
      </Combobox.Chip>))}</Combobox.Value>
    <Combobox.Input placeholder="Add labels" className="h-9 min-w-16 flex-1 bg-transparent pl-2 text-[17px] outline-none placeholder:text-ink-placeholder" />
  </Combobox.Chips>
  <Combobox.Portal><Combobox.Positioner sideOffset={8} className="z-50">
    <Combobox.Popup className="w-[var(--anchor-width)] rounded-2xl border border-line bg-surface p-2 shadow-popover">
      <Combobox.Empty className="p-4 font-semibold text-ink-muted">No matches</Combobox.Empty>
      <Combobox.List>{(l) => (
        <Combobox.Item key={l.id} value={l} className="group flex min-h-14 items-center gap-4 rounded-xl px-4 data-[highlighted]:bg-surface-hover">
          <span className="grid size-6 place-items-center rounded-[7px] border-2 border-ink group-data-[selected]:bg-ink group-data-[selected]:text-on-ink"><Combobox.ItemIndicator><Check size={16} /></Combobox.ItemIndicator></span>
          {l.name}
        </Combobox.Item>)}</Combobox.List>
    </Combobox.Popup>
  </Combobox.Positioner></Combobox.Portal>
</Combobox.Root>
```

## Rules
- The menu stays open between picks. Backspace in an empty input removes the last pill.
- After two rows of pills, collapse to "+N more".

## Native
Ink pills wrap inside the field. Tapping opens a sheet with search, checkbox rows and a "Done" pill button.
