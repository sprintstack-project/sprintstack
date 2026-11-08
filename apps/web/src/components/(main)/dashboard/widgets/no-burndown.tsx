import { useDashboardContext } from '@sprintstack/shared/providers/main/dashboard';
import Card from '@ui/card';
import EmptyState from '@ui/empty-state';
import { ChartNoAxesGantt, SquareArrowOutUpRight, X } from 'lucide-react';
import Link from 'next/link';

const iconButton =
  'kbd-focus grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink-muted transition-colors duration-120 hover:bg-surface-hover hover:text-ink';
const title = 'Burndown';

const NoBurndown = () => {
  const { widgets, rearrangeWidgets } = useDashboardContext();
  const onRemove = () => rearrangeWidgets(widgets.filter((key) => key !== 'burndown'));
  return (
    <Card className="flex flex-col">
      <header className="-my-2 flex items-center gap-1">
        <h2 className="headline flex-1 truncate text-title text-ink">{title}</h2>
        <Link href="" aria-label={`Open ${title}`} className={iconButton}>
          <SquareArrowOutUpRight aria-hidden strokeWidth={2} className="size-5" />
        </Link>
        <button
          type="button"
          aria-label={`Remove ${title}`}
          onClick={onRemove}
          className={`${iconButton} -mr-2`}
        >
          <X aria-hidden strokeWidth={2} className="size-5" />
        </button>
      </header>
      <div className="mt-4 flex grow flex-col text-[1.0625rem] leading-6 font-semibold text-ink-muted font-stretch-semi-condensed">
        <EmptyState
          variant="widget"
          icon={ChartNoAxesGantt}
          title="No active sprint"
          description="Start a sprint to track remaining points day by day."
          actions={
            <Link href="/backlog" className="link kbd-focus rounded-xs text-[1rem] leading-5">
              Plan a sprint
            </Link>
          }
        />
      </div>
    </Card>
  );
};

export default NoBurndown;
