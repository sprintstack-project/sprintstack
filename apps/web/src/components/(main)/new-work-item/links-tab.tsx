'use client';

import { Menu } from '@base-ui/react/menu';
import { usePortalContainer } from '@lib/portal-container';
import { useFieldContext } from '@sprintstack/forms';
import {
  WORK_ITEM_LINK_KINDS,
  type WorkItemLink,
  type WorkItemLinkKind,
} from '@sprintstack/shared';
import { Button, buttonClass } from '@ui/button';
import { Field } from '@ui/field';
import { Select } from '@ui/select';
import { popup, row } from '@ui/select/menu';
import type { Option } from '@ui/types';
import { ChevronDown, Plus, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { TypeIcon } from '../taskboard/parts';
import { findLinkable, LINK_KINDS, LINKABLE, type Linkable } from './data';

/** "Add link": each kind, with a line on what it means, so the direction is clear. */
const AddLinkMenu = ({ onPick }: { onPick: (kind: WorkItemLinkKind) => void }) => {
  const container = usePortalContainer();
  return (
    <Menu.Root>
      <Menu.Trigger className={buttonClass('secondary', 'md')}>
        <Plus aria-hidden strokeWidth={2} className="size-6" />
        Add link
        <ChevronDown aria-hidden strokeWidth={2} className="size-5 in-data-popup-open:rotate-180" />
      </Menu.Trigger>
      <Menu.Portal container={container}>
        <Menu.Positioner sideOffset={8} align="end" className="z-50 outline-none">
          <Menu.Popup className={`${popup} w-[24rem]`}>
            {WORK_ITEM_LINK_KINDS.map((kind) => {
              const { label, description, icon: Icon } = LINK_KINDS[kind];
              return (
                <Menu.Item key={kind} onClick={() => onPick(kind)} className={`${row} py-3`}>
                  <Icon aria-hidden strokeWidth={2} className="size-6 shrink-0 self-start" />
                  <span className="flex min-w-0 flex-col">
                    <span className="font-bold">{label}</span>
                    <span className="text-meta text-ink-muted font-stretch-semi-condensed">
                      {description}
                    </span>
                  </span>
                </Menu.Item>
              );
            })}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};

const LinkIcon = ({ item }: { item: Linkable }) =>
  item.type === 'epic' ? (
    <span
      role="img"
      aria-label="Epic"
      title="Epic"
      className="grid size-7 shrink-0 place-items-center rounded-md bg-review-subtle text-review-ink"
    >
      <Zap aria-hidden strokeWidth={2} className="size-4" />
    </span>
  ) : (
    <TypeIcon type={item.type} />
  );

const LinkCard = ({ item, onRemove }: { item: Linkable; onRemove: () => void }) => (
  <li className="flex items-center gap-4 rounded-xl border border-line bg-surface px-4 py-3.5">
    <LinkIcon item={item} />
    <div className="flex min-w-0 flex-1 flex-col">
      <span className="text-meta text-ink-muted font-stretch-semi-condensed">{item.key}</span>
      <span className="truncate text-[1.0625rem] leading-6 font-bold text-ink font-stretch-semi-condensed">
        {item.title}
      </span>
    </div>
    <button
      type="button"
      aria-label={`Remove link to ${item.key}`}
      onClick={onRemove}
      className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-ink hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-focus-ring"
    >
      <X aria-hidden strokeWidth={2} className="size-5" />
    </button>
  </li>
);

/** After a kind is picked from "Add link": choose the item, which opens straight away. */
const ItemPicker = ({
  kind,
  exclude,
  onPick,
  onCancel,
}: {
  kind: WorkItemLinkKind;
  exclude: string[];
  onPick: (key: string) => void;
  onCancel: () => void;
}) => {
  const options: Option[] = LINKABLE.filter((l) => !exclude.includes(l.key)).map((l) => ({
    value: l.key,
    label: l.title,
    description: l.key,
  }));
  return (
    <div className="flex items-end gap-3 rounded-xl border border-line p-4">
      <div className="min-w-0 flex-1">
        <Field label={`${LINK_KINDS[kind].label}: find a work item`}>
          <Select
            options={options}
            value={null}
            onValueChange={(key) => key && onPick(key)}
            placeholder="Search by title or key"
            searchable
            defaultOpen
          />
        </Field>
      </div>
      <Button variant="ghost" size="lg" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
};

/** Parent, children, dependencies and the rest, grouped by kind. */
export const LinksField = () => {
  const field = useFieldContext<WorkItemLink[]>();
  const links = field.state.value;
  const [picking, setPicking] = useState<WorkItemLinkKind | null>(null);

  const remove = (link: WorkItemLink) =>
    field.handleChange(links.filter((l) => !(l.kind === link.kind && l.key === link.key)));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[1.0625rem] leading-6 font-semibold text-ink-muted font-stretch-semi-condensed">
          Links show on both items.
        </p>
        <AddLinkMenu onPick={setPicking} />
      </div>
      {picking && (
        <ItemPicker
          kind={picking}
          exclude={links.map((l) => l.key)}
          onPick={(key) => {
            field.pushValue({ kind: picking, key });
            setPicking(null);
          }}
          onCancel={() => setPicking(null)}
        />
      )}
      {links.length === 0 && !picking && (
        <p className="rounded-xl border border-dashed border-line-strong px-6 py-10 text-center font-semibold text-ink-muted">
          No links yet. Add a parent epic, or the items this one depends on.
        </p>
      )}
      {WORK_ITEM_LINK_KINDS.map((kind) => {
        const items = links.filter((l) => l.kind === kind);
        if (items.length === 0) return null;
        return (
          <section key={kind} aria-label={LINK_KINDS[kind].heading} className="flex flex-col gap-3">
            <h3 className="eyebrow">{LINK_KINDS[kind].heading}</h3>
            <ul className="flex flex-col gap-2">
              {items.map((link) => {
                const item = findLinkable(link.key);
                return (
                  item && <LinkCard key={link.key} item={item} onRemove={() => remove(link)} />
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
};
