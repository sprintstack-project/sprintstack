import type { CommandGroup, CommandItem, Option } from '@ui/types';

const matches = (item: CommandItem, words: string[]) => {
  const haystack = [item.label, item.description, ...(item.keywords ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return words.every((word) => haystack.includes(word));
};

/** The groups with only the items matching every word of the query; empty groups are dropped. */
export const filterCommands = (groups: CommandGroup[], query: string) => {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return groups;
  return groups
    .map((group) => ({ ...group, items: group.items.filter((item) => matches(item, words)) }))
    .filter((group) => group.items.length > 0);
};

/** A command as a menu option, so rows reuse Select's OptionContent. */
export const commandOption = ({ key, label, icon, avatar, description }: CommandItem): Option => ({
  value: key,
  label,
  icon,
  avatar,
  description,
});
