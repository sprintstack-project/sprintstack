A screen that collects tokens, filters as you type, and shows a checklist with a live count.

## Consumer provides
`id`, `options` (or `loadOptions`), `value`/`onValueChange` or `defaultValue` (array), `placeholder`, `chipTone` (`neutral` for people, `outline` for labels), optional `creatable`, `max`, `invalid`, `disabled`. Use `description` on options for context like `3 open`.

## Web recipe (Base UI Combobox, multiple)
```tsx
import { Combobox } from "@base-ui/react/combobox";
const token = "inline-flex h-5 items-center gap-1 rounded-sm bg-surface-pressed px-1.5 font-mono text-[11px] text-ink";
<Combobox.Root items={people} multiple>
  <Combobox.Chips className="screen relative flex min-h-[30px] w-full flex-wrap items-center gap-1 py-[3px] pl-[3px] pr-7">
    <Combobox.Value>{(sel) => sel.map(p => (
      <Combobox.Chip key={p.id} className={token}>{p.name}
        <Combobox.ChipRemove aria-label={`Remove ${p.name}`} className="grid size-3.5 place-items-center rounded-sm text-ink-muted hover:bg-danger hover:text-on-danger"><X size={10} /></Combobox.ChipRemove>
      </Combobox.Chip>))}</Combobox.Value>
    <Combobox.Input placeholder="Assign people" className="h-[22px] min-w-12 flex-1 bg-transparent pl-1 text-body outline-none placeholder:text-ink-placeholder" />
  </Combobox.Chips>
  <Combobox.Portal><Combobox.Positioner sideOffset={4} className="z-50">
    <Combobox.Popup className="w-[var(--anchor-width)] overflow-hidden rounded-md bg-surface-raised shadow-popover">
      <Combobox.Empty className="p-3 font-mono text-meta text-ink-muted">0 results</Combobox.Empty>
      <Combobox.List className="max-h-72 overflow-y-auto p-1">{(p) => (
        <Combobox.Item key={p.id} value={p} className="group flex h-[30px] items-center gap-2 rounded-sm px-2 text-body data-[highlighted]:bg-surface-pressed data-[selected]:text-accent-ink">
          <span className="grid size-3.5 place-items-center rounded-sm border border-line-strong bg-surface-sunken group-data-[selected]:border-accent group-data-[selected]:bg-accent group-data-[selected]:text-on-accent"><Combobox.ItemIndicator><Check size={10} /></Combobox.ItemIndicator></span>
          {p.name}<span className="ml-auto font-mono text-[11px] text-ink-muted">{p.open} open</span>
        </Combobox.Item>)}</Combobox.List>
      <KeyLegend items={[["↑↓", "move"], ["↵", "toggle"]]} right={`${count} selected`} />
    </Combobox.Popup>
  </Combobox.Positioner></Combobox.Portal>
</Combobox.Root>
```

## Rules
- The popup stays open between picks. Enter toggles; Escape closes.
- Backspace in an empty input removes the last token. After 2 rows of tokens, collapse to `+N`.
- Selected items keep their position. Async loading shows 3 skeleton rows after 150ms, never a spinner.

## Native
Tokens wrap inside a `min-h-11` screen. Tapping opens a full-height sheet: a search field at the top, checkbox rows, and a bottom bar reading "N selected · Done".
