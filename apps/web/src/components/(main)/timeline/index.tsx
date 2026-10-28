'use client';

import { Button } from '@ui/button';
import { PlusIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import Chart from './chart';
import {
  columnsOf,
  contains,
  DEFAULT_RANGE,
  EPICS,
  findRange,
  type Level,
  offsetOf,
  RANGES,
  rangeMonths,
  type Scale,
  type StatusFilter,
  TODAY,
} from './data';
import Toolbar from './toolbar';

const Timeline = () => {
  const [level, setLevel] = useState<Level>('epics');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [rangeValue, setRangeValue] = useState(DEFAULT_RANGE);
  const [scale, setScale] = useState<Scale>('months');
  const [expanded, setExpanded] = useState(['PAY-E12']);
  const scrollRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const range = findRange(rangeValue);
  const matches = (item: { status: StatusFilter }) => status === 'all' || item.status === status;
  const epics = EPICS.filter(matches);
  const features = EPICS.flatMap((e) => e.features).filter(matches);

  const scrollToToday = (target = range) => {
    const scroller = scrollRef.current;
    const label = labelRef.current?.offsetWidth ?? 0;
    if (!scroller) return;
    // The labels stay put, so centre today in the part of the track left showing.
    const track = scroller.scrollWidth - label;
    const visible = scroller.clientWidth - label;
    scroller.scrollTo({
      left: track * offsetOf(target, TODAY) - visible / 2,
      behavior: 'smooth',
    });
  };

  // Out of range, today first brings in the range that holds it.
  const goToToday = () => {
    if (contains(range, TODAY)) return scrollToToday();
    const next = RANGES.find((r) => contains(r, TODAY));
    if (!next) return;
    setRangeValue(next.value);
    requestAnimationFrame(() => scrollToToday(next));
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="eyebrow">Roadmap · {rangeMonths(range)}</p>
          <h1 className="headline text-7xl leading-none">Timeline</h1>
        </div>
        <Button variant="brand" size="lg" icon={PlusIcon}>
          New epic
        </Button>
      </div>
      <Toolbar
        level={level}
        onLevelChange={setLevel}
        status={status}
        onStatusChange={setStatus}
        range={rangeValue}
        onRangeChange={setRangeValue}
        scale={scale}
        onScaleChange={setScale}
        onToday={goToToday}
      />
      <Chart
        level={level}
        epics={epics}
        features={features}
        range={range}
        scale={scale}
        columns={columnsOf(range, scale)}
        expanded={expanded}
        onExpandedChange={(key, next) =>
          setExpanded((all) => (next ? [...all, key] : all.filter((k) => k !== key)))
        }
        scrollRef={scrollRef}
        labelRef={labelRef}
      />
    </div>
  );
};

export default Timeline;
