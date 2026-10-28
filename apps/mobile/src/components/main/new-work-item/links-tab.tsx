import { scaled, touchSlop } from '@lib/scale';
import { useFieldContext } from '@sprintstack/forms';
import {
  WORK_ITEM_LINK_KINDS,
  type WorkItemLink,
  type WorkItemLinkKind,
} from '@sprintstack/shared';
import { Button, Field, Select, Text } from '@sprintstack/ui';
import SelectWithTrigger from '@ui/select/select';
import type { Option } from '@ui/types';
import { ChevronDown, Plus, X, Zap } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';
import { TypeIcon } from '../taskboard/parts';
import { findLinkable, LINK_KINDS, LINKABLE, type Linkable } from './data';

const kindOptions: Option<WorkItemLinkKind>[] = WORK_ITEM_LINK_KINDS.map((kind) => ({
  value: kind,
  label: LINK_KINDS[kind].label,
  icon: LINK_KINDS[kind].icon,
  description: LINK_KINDS[kind].description,
}));

const EpicIcon = () => {
  const color = useTokenColor('review-ink');
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="Epic"
      className="size-7 items-center justify-center rounded-md bg-review-subtle"
    >
      <Zap aria-hidden size={scaled(16)} strokeWidth={2} color={color} />
    </View>
  );
};

const LinkCard = ({ item, onRemove }: { item: Linkable; onRemove: () => void }) => {
  const ink = useTokenColor('ink');
  return (
    <View className="flex-row items-center gap-4 rounded-xl border border-line bg-surface px-4 py-3.5">
      {item.type === 'epic' ? <EpicIcon /> : <TypeIcon type={item.type} />}
      <View className="min-w-0 flex-1">
        <Text className="text-meta font-semibold text-ink-muted">{item.key}</Text>
        <Text numberOfLines={1} className="text-[1.0625rem] leading-6 font-bold text-ink">
          {item.title}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remove link to ${item.key}`}
        onPress={onRemove}
        hitSlop={touchSlop(36)}
        className="size-9 items-center justify-center rounded-full active:bg-surface-pressed"
      >
        <X aria-hidden size={scaled(20)} strokeWidth={2} color={ink} />
      </Pressable>
    </View>
  );
};

/** After a kind is picked from "Add link": choose the item, whose sheet opens straight away. */
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
    <View className="gap-3 rounded-xl border border-line p-4">
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
      <View className="items-end">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </View>
    </View>
  );
};

/** Parent, children, dependencies and the rest, grouped by kind. */
export const LinksField = () => {
  const field = useFieldContext<WorkItemLink[]>();
  const links = field.state.value;
  const [picking, setPicking] = useState<WorkItemLinkKind | null>(null);
  const ink = useTokenColor('ink');

  const remove = (link: WorkItemLink) =>
    field.handleChange(links.filter((l) => !(l.kind === link.kind && l.key === link.key)));

  return (
    <View className="gap-6">
      <View className="flex-row flex-wrap items-center justify-between gap-4">
        <Text className="text-[1.0625rem] leading-6 font-semibold text-ink-muted">
          Links show on both items.
        </Text>
        <SelectWithTrigger<WorkItemLinkKind>
          options={kindOptions}
          value={null}
          onValueChange={setPicking}
          trigger={{
            label: 'Add link',
            hitSlop: touchSlop(48),
            className:
              'h-12 flex-row items-center gap-2 rounded-full border-2 border-ink px-5 active:bg-surface-pressed',
            children: (
              <>
                <Plus aria-hidden size={scaled(22)} strokeWidth={2} color={ink} />
                <Text className="text-[1.0625rem] leading-5 font-extrabold text-ink">Add link</Text>
                <ChevronDown aria-hidden size={scaled(20)} strokeWidth={2} color={ink} />
              </>
            ),
          }}
        />
      </View>
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
        <View className="rounded-xl border border-dashed border-line-strong px-6 py-10">
          <Text className="text-center font-semibold text-ink-muted">
            No links yet. Add a parent epic, or the items this one depends on.
          </Text>
        </View>
      )}
      {WORK_ITEM_LINK_KINDS.map((kind) => {
        const items = links.filter((l) => l.kind === kind);
        if (items.length === 0) return null;
        return (
          <View key={kind} className="gap-3">
            <Text accessibilityRole="header" className="text-eyebrow uppercase text-ink-muted">
              {LINK_KINDS[kind].heading}
            </Text>
            {items.map((link) => {
              const item = findLinkable(link.key);
              return item && <LinkCard key={link.key} item={item} onRemove={() => remove(link)} />;
            })}
          </View>
        );
      })}
    </View>
  );
};
