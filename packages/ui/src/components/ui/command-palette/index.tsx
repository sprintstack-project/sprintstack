'use client';

import { Autocomplete } from '@base-ui/react/autocomplete';
import { Dialog } from '@base-ui/react/dialog';
import { commandOption, filterCommands } from '@lib/command';
import { usePortalContainer } from '@lib/portal-container';
import { row } from '@ui/select/menu';
import OptionContent from '@ui/select/option-content';
import type { CommandGroup, CommandItem, CommandPaletteProps } from '@ui/types';
import { clsx } from 'clsx';
import { Search } from 'lucide-react';
import { useRef, useState } from 'react';

const kbd =
  'rounded-md border border-line-strong px-1.5 py-0.5 font-sans text-badge text-ink-muted';

const CommandPalette = ({
  open,
  onOpenChange,
  groups,
  placeholder = 'Search or jump to…',
}: CommandPaletteProps) => {
  const container = usePortalContainer();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const shown = filterCommands(groups, query);

  const run = (item: CommandItem) => {
    onOpenChange(false);
    item.onSelect();
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
      // Start each search fresh, however it closed (Esc, a pick, or the parent). After the exit
      // animation, so the results don't flash back to the full list as it fades.
      onOpenChangeComplete={(next) => {
        if (!next) setQuery('');
      }}
    >
      <Dialog.Portal container={container}>
        <Dialog.Backdrop
          className={clsx(
            'fixed inset-0 z-(--z-dialog) bg-scrim transition-opacity duration-140',
            'data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none',
          )}
        />
        <Dialog.Popup
          initialFocus={input}
          className={clsx(
            'fixed top-[12vh] left-1/2 z-(--z-dialog) flex max-h-[76vh] w-[min(40rem,calc(100vw-2rem))] -translate-x-1/2 flex-col',
            'overflow-hidden rounded-xl border border-line bg-surface text-ink shadow-popover outline-none',
            'transition-[opacity,scale] duration-140 ease-out motion-reduce:transition-none',
            'data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0',
          )}
        >
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <Autocomplete.Root<CommandGroup | CommandItem>
            inline
            open
            items={groups}
            filteredItems={shown}
            value={query}
            onValueChange={setQuery}
            itemToStringValue={(item) => ('label' in item ? item.label : item.title)}
            autoHighlight="always"
            keepHighlight
          >
            <div className="flex h-16 shrink-0 items-center gap-3 border-b border-line px-5 text-ink-muted">
              <Search aria-hidden strokeWidth={2} className="size-6 shrink-0" />
              <Autocomplete.Input
                ref={input}
                aria-label={placeholder}
                placeholder={placeholder}
                className="min-w-0 flex-1 self-stretch bg-transparent text-[1.1875rem] leading-6 text-ink outline-none placeholder:text-ink-placeholder"
              />
              <kbd className={kbd}>Esc</kbd>
            </div>

            <Autocomplete.Empty className="px-6 py-8 text-center font-semibold text-ink-muted empty:hidden">
              {query.trim() ? `No results for “${query.trim()}”` : 'Nothing to show'}
            </Autocomplete.Empty>

            <Autocomplete.List className="min-h-0 flex-1 overflow-y-auto p-2 empty:hidden">
              {(group: CommandGroup) => (
                <Autocomplete.Group key={group.title} items={group.items} className="[&+&]:mt-2">
                  <Autocomplete.GroupLabel className="eyebrow px-4 pt-2 pb-1">
                    {group.title}
                  </Autocomplete.GroupLabel>
                  <Autocomplete.Collection>
                    {(item: CommandItem) => (
                      <Autocomplete.Item
                        key={item.key}
                        value={item}
                        // Fires on click and on Enter while the item is highlighted.
                        onClick={() => run(item)}
                        className={row}
                      >
                        <OptionContent option={commandOption(item)} />
                      </Autocomplete.Item>
                    )}
                  </Autocomplete.Collection>
                </Autocomplete.Group>
              )}
            </Autocomplete.List>
          </Autocomplete.Root>

          <div
            aria-hidden
            className="flex shrink-0 items-center gap-4 border-t border-line px-5 py-3 text-meta text-ink-muted font-stretch-semi-condensed max-sm:hidden"
          >
            <span className="flex items-center gap-1.5">
              <kbd className={kbd}>↑</kbd>
              <kbd className={kbd}>↓</kbd>
              to move
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className={kbd}>↵</kbd>
              to open
            </span>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CommandPalette;
