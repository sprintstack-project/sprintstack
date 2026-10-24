import { scaled } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import { Badge } from '@ui/Badge';
import { Button } from '@ui/Button';
import { Priority } from '@ui/Priority';
import { Text } from '@ui/Text';
import type { CardProps } from '@ui/types';
import { clsx } from 'clsx';
import { Bookmark, Clock, Target } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

const tiles = {
  brand: { box: 'bg-brand', text: 'text-on-brand' },
  ink: { box: 'bg-ink', text: 'text-on-ink' },
  muted: { box: 'bg-surface-muted', text: 'text-ink' },
};

export function Card(props: CardProps) {
  if (props.variant === 'tile') return <Tile {...props} />;
  if (props.variant === 'issue') return <IssueCard {...props} />;

  const { title, actions, children, footer } = props;
  return (
    <View className="min-w-0 rounded-[1.25rem] border border-line bg-surface p-6">
      {(title || actions) && (
        <View className="flex-row items-start gap-3">
          {title && (
            <Text accessibilityRole="header" className="flex-1 text-title font-extrabold text-ink">
              {title}
            </Text>
          )}
          {actions}
        </View>
      )}
      {children != null &&
        (typeof children === 'string' ? (
          <Text
            className={clsx(
              (title || actions) && 'mt-3',
              'text-[1.0625rem] leading-6 font-semibold text-ink-muted',
            )}
          >
            {children}
          </Text>
        ) : (
          <View className={clsx((title || actions) && 'mt-3')}>{children}</View>
        ))}
      {footer && (
        <View className="mt-4 flex-row items-center gap-3 border-t border-line-strong pt-4">
          {footer}
        </View>
      )}
    </View>
  );
}

/** Tiles carry an eyebrow and a poster or headline; pass styled <Text> as children. */
function Tile({ tone = 'brand', eyebrow, children }: CardProps) {
  return (
    <View
      className={clsx(
        'min-h-[12.5rem] min-w-0 justify-between gap-4 rounded-[1.75rem] p-8',
        tiles[tone].box,
      )}
    >
      {eyebrow && (
        <Text
          className={clsx(
            'text-[0.8125rem] leading-4 font-bold uppercase tracking-[.4px]',
            tiles[tone].text,
          )}
        >
          {eyebrow}
        </Text>
      )}
      <View className="flex-1" />
      {children}
    </View>
  );
}

function IssueCard({
  title,
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
}: CardProps) {
  const [isWatched, setWatched] = useState(Boolean(watched));
  const ink = useTokenColor('ink');
  const muted = useTokenColor('ink-muted');
  const red = useTokenColor('brand-ink');
  const subline = [status && issueKey, project].filter(Boolean).join(' · ');

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={title}
      accessibilityState={{ selected: Boolean(selected) }}
      disabled={!onPress}
      onPress={onPress}
      className={clsx(
        'min-w-0 rounded-[1.25rem] bg-surface',
        // The selected card gets a 2px ink border (padding shrinks to keep the content still).
        selected
          ? 'border-2 border-ink p-[1.4375rem]'
          : 'border border-line p-6 active:border-line-strong',
      )}
    >
      <View className="flex-row items-start gap-3">
        {status ? (
          <Badge tone={status} />
        ) : (
          <Text className="text-meta font-semibold text-ink-muted">{issueKey}</Text>
        )}
        <View className="flex-1" />
        {updated ? (
          <Text className="text-meta font-semibold text-ink-muted">{updated}</Text>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Watch"
            accessibilityState={{ selected: isWatched }}
            onPress={() => setWatched(!isWatched)}
            className="-m-2.5 size-11 items-center justify-center rounded-full active:bg-surface-pressed"
          >
            <Bookmark
              aria-hidden
              size={scaled(24)}
              strokeWidth={2}
              color={ink}
              fill={isWatched ? ink : 'none'}
            />
          </Pressable>
        )}
      </View>
      <Text className="mt-3 text-title font-extrabold text-ink">{title}</Text>
      {subline !== '' && (
        <Text className="mt-3 text-[1.125rem] leading-6 font-bold text-ink-muted">{subline}</Text>
      )}
      {progress !== undefined ? (
        <View
          accessibilityRole="progressbar"
          accessibilityLabel="Subtasks done"
          accessibilityValue={{ min: 0, max: 100, now: progress }}
          className="mt-4 h-2 overflow-hidden rounded-full bg-line"
        >
          <View
            className="h-full rounded-full bg-brand"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </View>
      ) : (
        <>
          {(priority || points !== undefined || due) && (
            <View className="mt-4 flex-row flex-wrap items-center gap-x-5 gap-y-2">
              {priority && <Priority level={priority} />}
              {points !== undefined && (
                <View className="flex-row items-center gap-2">
                  <Target aria-hidden size={scaled(18)} strokeWidth={2} color={muted} />
                  <Text className="text-[1.0625rem] font-bold text-ink-muted">{points} pts</Text>
                </View>
              )}
              {due && (
                <View className="flex-row items-center gap-2">
                  <Clock
                    aria-hidden
                    size={scaled(18)}
                    strokeWidth={2}
                    color={overdue ? red : muted}
                  />
                  <Text
                    className={clsx(
                      'text-[1.0625rem] font-bold',
                      overdue ? 'text-brand-ink' : 'text-ink-muted',
                    )}
                  >
                    {due}
                  </Text>
                </View>
              )}
            </View>
          )}
          <View className="mt-4 flex-row items-center gap-3 border-t border-line-strong pt-4">
            {assignee && (
              <View
                accessibilityRole="image"
                accessibilityLabel={`Assignee ${assignee}`}
                className="size-8 items-center justify-center rounded-full bg-ink"
              >
                <Text className="text-[0.8125rem] font-extrabold text-on-ink">{assignee}</Text>
              </View>
            )}
            <Text className="text-meta font-semibold text-ink-muted">{age}</Text>
            <View className="flex-1" />
            <Button variant="link" onClick={onPress}>
              {linkLabel}
            </Button>
          </View>
        </>
      )}
    </Pressable>
  );
}
