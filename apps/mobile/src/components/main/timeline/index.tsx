import Text from '@ui/text';
import { useState } from 'react';
import { View } from 'react-native';
import { Chart } from './chart';
import {
  columnsOf,
  DEFAULT_RANGE,
  EPICS,
  type Level,
  rangeMonths,
  type Scale,
  type StatusFilter,
} from './data';
import { Toolbar } from './toolbar';

export const Timeline = () => {
  const [level, setLevel] = useState<Level>('epics');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [range, setRange] = useState(DEFAULT_RANGE);
  const [scale, setScale] = useState<Scale>('months');
  const [expanded, setExpanded] = useState(['PAY-E12']);

  const matches = (item: { status: StatusFilter }) => status === 'all' || item.status === status;

  return (
    <>
      <View>
        <Text className="text-sm font-bold uppercase text-ink-muted">{rangeMonths(range)}</Text>
        <Text
          accessibilityRole="header"
          className="text-4xl leading-14 font-extrabold uppercase text-ink"
        >
          Timeline
        </Text>
      </View>
      <Toolbar
        level={level}
        onLevelChange={setLevel}
        status={status}
        onStatusChange={setStatus}
        range={range}
        onRangeChange={setRange}
        scale={scale}
        onScaleChange={setScale}
      />
      <Chart
        level={level}
        epics={EPICS.filter(matches)}
        features={EPICS.flatMap((e) => e.features).filter(matches)}
        range={range}
        columns={columnsOf(range, scale)}
        expanded={expanded}
        onExpandedChange={(key, next) =>
          setExpanded((all) => (next ? [...all, key] : all.filter((k) => k !== key)))
        }
      />
    </>
  );
};
