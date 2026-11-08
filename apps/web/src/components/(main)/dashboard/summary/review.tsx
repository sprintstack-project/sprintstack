import Card from '@ui/card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Suspense, use } from 'react';
import ErrorWrapper from '../error-wrapper';
import { StatTileSkeleton } from '../skeletons';

const Review = ({ awaitingReview: countPromise }: { awaitingReview: Promise<number> }) => {
  const awaitingReview = use(countPromise);
  return (
    <ErrorWrapper label="your review queue">
      <Suspense fallback={<StatTileSkeleton label="your review queue" />}>
        <Card variant="brand">
          <span className="eyebrow text-current">Waiting on your review</span>
          <span className="flex-1" />
          <p className="headline text-[4.5rem] leading-[0.92] tabular-nums">{awaitingReview}</p>
          <Link
            href="/taskboard"
            className="kbd-focus inline-flex items-center gap-1 self-start rounded-xs text-[1.0625rem] leading-5 font-extrabold underline decoration-2 underline-offset-4 font-stretch-condensed"
          >
            Open review queue
            <ChevronRight aria-hidden strokeWidth={2.5} className="size-5" />
          </Link>
        </Card>
      </Suspense>
    </ErrorWrapper>
  );
};

export default Review;
