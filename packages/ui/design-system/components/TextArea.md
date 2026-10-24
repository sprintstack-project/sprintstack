The multi-line version of the field, for descriptions, comments and release notes.

## Consumer provides
`id`, `value`/`onChange` or `defaultValue`, `placeholder`, `rows` (default 4), optional `maxLength` (shows `n / max`), `invalid`, `disabled`.

## Web recipe
```tsx
<div className="field flex flex-col gap-2 px-5 pb-3 pt-4">
  <Field.Control render={<textarea rows={4} />} className="min-h-24 max-h-80 resize-y bg-transparent text-[17px] outline-none [field-sizing:content] placeholder:text-ink-placeholder" />
  {maxLength && <span className="self-end text-[13px] font-semibold tabular-nums text-ink-muted data-[over]:text-brand-ink">{n} / {maxLength}</span>}
</div>
```

## Rules
- Grows with content up to 320px, then scrolls.
- Past the limit, the counter turns red and the Field shows an error. Never truncate silently.

## Native
`TextInput multiline textAlignVertical="top"` in the same shell, with `min-h-24`.
