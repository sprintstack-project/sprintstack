import { Button, LoadState, Skeleton, Text } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useRef, useState } from 'react';
import { View } from 'react-native';

const meta = {
  title: 'UI/LoadState',
  component: LoadState,
  args: {
    loading: true,
    label: 'Loading backlog…',
    skeleton: null,
    errorTitle: 'Couldn’t load the backlog',
    errorDescription: 'Check your connection and try again. Your filters are kept.',
    errorDetail: 'Error 503 · ref 7f3k2',
  },
} satisfies Meta<typeof LoadState>;

export default meta;
type Story = StoryObj<typeof meta>;

const BacklogSkeleton = () => (
  <View className="gap-4">
    {[70, 50, 60].map((title) => (
      <View key={title} className="flex-row items-center gap-3 border-b border-line pb-4">
        <Skeleton shape="icon" />
        <Skeleton width={`${title}%`} />
      </View>
    ))}
  </View>
);

const Backlog = () => (
  <View className="gap-4">
    {['Dark mode for emailed receipts', 'Tidy up onboarding copy', 'Retry failed webhooks'].map(
      (title) => (
        <Text key={title} className="border-b border-line pb-4 text-[1.0625rem] font-bold text-ink">
          {title}
        </Text>
      ),
    )}
  </View>
);

// Elements stay out of args (native Storybook can't infer types through them), so the skeleton
// and content come from render.
const Demo = () => {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const load = (ms: number, fail = false) => {
    clearTimeout(timer.current);
    setFailed(false);
    setLoading(true);
    timer.current = setTimeout(() => {
      setLoading(false);
      setFailed(fail);
    }, ms);
  };

  return (
    <View className="gap-5">
      <View className="flex-row flex-wrap gap-2">
        <Button size="sm" onClick={() => load(200)}>
          Fast
        </Button>
        <Button size="sm" onClick={() => load(1500)}>
          Normal
        </Button>
        <Button size="sm" onClick={() => load(10_000)}>
          Slow
        </Button>
        <Button size="sm" onClick={() => load(1000, true)}>
          Fails
        </Button>
      </View>
      <LoadState
        loading={loading}
        failed={failed}
        label="Loading backlog…"
        skeleton={<BacklogSkeleton />}
        slowMessage="Still loading. Large backlogs can take a few seconds."
        errorTitle="Couldn’t load the backlog"
        errorDescription="Check your connection and try again. Your filters are kept."
        errorDetail="Error 503 · ref 7f3k2"
        onRetry={() => load(1500)}
      >
        <Backlog />
      </LoadState>
    </View>
  );
};

export const Playground: Story = { render: () => <Demo /> };

export const Failed: Story = {
  render: (args) => <LoadState {...args} loading={false} failed onRetry={() => {}} />,
};
