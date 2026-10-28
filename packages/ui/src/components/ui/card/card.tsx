'use client';

import { Badge } from '@ui/badge';
import { Button } from '@ui/button';
import { Priority } from '@ui/priority';
import type { CardProps } from '@ui/types';
import { clsx } from 'clsx';
import { Bookmark, Clock, Target } from 'lucide-react';
import { type KeyboardEvent, useId, useState } from 'react';

const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring';
const meta = 'text-meta font-semibold tabular-nums text-ink-muted font-stretch-semi-condensed';
const title = 'font-display text-title font-extrabold text-ink font-stretch-condensed';

// Poster second lines go in <em>: brand on ink tiles (darkened in Night, where ink turns light),
// ink on brand tiles.
const tiles = {
  brand: 'bg-brand text-on-brand [&_em]:text-ink',
  ink: 'bg-ink text-on-ink [&_em]:text-brand-on-ink',
  muted: 'bg-surface-muted text-ink [&_em]:text-brand-ink',
};

const Card = (props: CardProps) => {
  if (props.variant === 'tile') return <Tile {...props} />;
  if (props.variant === 'issue') return <IssueCard {...props} />;

  const { title: heading, actions, children, footer } = props;
  return (
    <section className="min-w-0 rounded-xl border border-line bg-surface p-6 text-ink">
      {(heading || actions) && (
        <header className="flex items-start gap-3">
          {heading && <h3 className={clsx(title, 'flex-1')}>{heading}</h3>}
          {actions}
        </header>
      )}
      {children && (
        <div
          className={clsx(
            (heading || actions) && 'mt-3',
            'text-[1.0625rem] leading-6 font-semibold text-ink-muted font-stretch-semi-condensed',
          )}
        >
          {children}
        </div>
      )}
      {footer && (
        <footer className="mt-4 flex items-center gap-3 border-t border-line-strong pt-4">
          {footer}
        </footer>
      )}
    </section>
  );
};

const Tile = ({ tone = 'brand', eyebrow, children }: CardProps) => {
  return (
    <section
      className={clsx(
        'flex min-h-[12.5rem] min-w-0 flex-col justify-between gap-4 rounded-2xl p-8 [&_em]:not-italic',
        tiles[tone],
      )}
    >
      {eyebrow && <span className="eyebrow text-current">{eyebrow}</span>}
      <span className="flex-1" />
      {children}
    </section>
  );
};

const IssueCard = ({
  title: heading,
  issueKey,
  status,
  project,
  priority,
  points,
  due,
  overdue,
  progress,
  assignee,
  updated,
  age,
  watched,
  selected,
  linkLabel = 'View issue',
  onPress,
}: CardProps) => {
  const [isWatched, setWatched] = useState(Boolean(watched));
  const titleId = useId();
  const interactive = Boolean(onPress);
  const subline = [status && issueKey, project].filter(Boolean).join(' · ');

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    onPress?.();
  };

  return (
    <article
      aria-labelledby={titleId}
      tabIndex={interactive ? 0 : undefined}
      onClick={(e) => {
        // Inner buttons (watch, the link) handle their own clicks.
        if ((e.target as HTMLElement).closest('button')) return;
        onPress?.();
      }}
      onKeyDown={interactive ? onKeyDown : undefined}
      data-selected={selected || undefined}
      className={clsx(
        'min-w-0 rounded-xl border border-line bg-surface p-6 text-ink',
        // The selected card gets a 2px ink border (padding shrinks to keep the content still).
        'data-selected:border-2 data-selected:border-ink data-selected:p-[1.4375rem]',
        interactive && [
          'cursor-pointer transition-colors duration-120 hover:border-line-strong',
          focus,
        ],
      )}
    >
      <div className="flex items-start gap-3">
        {status ? <Badge tone={status} /> : <span className={meta}>{issueKey}</span>}
        <span className="flex-1" />
        {updated ? (
          <span className={meta}>{updated}</span>
        ) : (
          <button
            type="button"
            aria-pressed={isWatched}
            aria-label="Watch"
            onClick={() => setWatched(!isWatched)}
            className={clsx(
              '-m-2.5 grid size-11 cursor-pointer place-items-center rounded-full text-ink hover:bg-surface-hover',
              focus,
            )}
          >
            {/* Watch uses a bookmark that fills when active. */}
            <Bookmark
              aria-hidden
              strokeWidth={2}
              className={clsx('size-6', isWatched && 'fill-current')}
            />
          </button>
        )}
      </div>
      <h3 id={titleId} className={clsx(title, 'mt-3')}>
        {heading}
      </h3>
      {subline && (
        <p className="mt-3 text-[1.125rem] leading-6 font-bold text-ink-muted font-stretch-semi-condensed">
          {subline}
        </p>
      )}
      {progress !== undefined ? (
        <div
          role="progressbar"
          aria-label="Subtasks done"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-4 h-2 overflow-hidden rounded-full bg-line"
        >
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      ) : (
        <>
          {(priority || points !== undefined || due) && (
            <div className="mt-4 flex flex-wrap items-center gap-5 text-[1.0625rem] leading-[1.375rem] font-bold text-ink-muted font-stretch-semi-condensed">
              {priority && <Priority level={priority} />}
              {points !== undefined && (
                <span className="inline-flex items-center gap-2">
                  <Target aria-hidden strokeWidth={2} className="size-[1.125rem]" />
                  {points} pts
                </span>
              )}
              {due && (
                <span
                  className={clsx('inline-flex items-center gap-2', overdue && 'text-brand-ink')}
                >
                  <Clock aria-hidden strokeWidth={2} className="size-[1.125rem]" />
                  {due}
                </span>
              )}
            </div>
          )}
          <footer className="mt-4 flex items-center gap-3 border-t border-line-strong pt-4">
            {assignee && (
              <span
                role="img"
                aria-label={`Assignee ${assignee}`}
                className="grid size-8 shrink-0 place-items-center rounded-full bg-ink font-display text-[0.8125rem] font-extrabold text-on-ink font-stretch-condensed"
              >
                {assignee}
              </span>
            )}
            <span className={meta}>{age}</span>
            <span className="flex-1" />
            <Button variant="link" onClick={onPress}>
              {linkLabel}
            </Button>
          </footer>
        </>
      )}
    </article>
  );
};

export default Card;
