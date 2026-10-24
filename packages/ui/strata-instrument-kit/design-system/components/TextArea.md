A multi-line writing surface with a status bar for format, character count and the submit shortcut.

## Consumer provides
`id`, `value`/`onChange` or `defaultValue`, `placeholder`, `rows` (default 4), optional `maxLength`, `submitHint` (e.g. "send", shown as `⌘↵ send`), `markdown` (default true, shows `MD`), `invalid`, `disabled`.

## Web recipe
```tsx
<div className="screen flex flex-col overflow-hidden">
  <Field.Control render={<textarea rows={4} />}
    className="min-h-20 max-h-80 resize-y bg-transparent p-2 text-body text-ink outline-none [field-sizing:content] placeholder:text-ink-placeholder" />
  <div className="flex h-6 items-center gap-2 border-t border-line bg-surface px-2 font-mono text-[11px] text-ink-muted">
    <span>MD</span><span className="flex-1" />
    <span className="tabular-nums data-[over]:text-danger-ink">{n}/{max}</span>
    <span><kbd className="kbd">⌘↵</kbd> send</span>
  </div>
</div>
```

## Rules
- Grows with content to 320px, then scrolls.
- ⌘/Ctrl+Enter submits; Escape blurs. Plain Enter always inserts a newline.
- Past `maxLength`, the counter turns `danger-ink` and the Field shows an error. Never truncate silently.

## Native
`TextInput multiline textAlignVertical="top"` in the screen shell, with the status bar as a `View` row below it. The submit shortcut appears only with a hardware keyboard.
