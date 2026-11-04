import { useLoadPhase } from '@lib/loading';
import { scaled } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import { Button } from '@ui/button';
import { Spinner } from '@ui/spinner';
import { Text } from '@ui/text';
import type { LoadStateProps } from '@ui/types';
import { TriangleAlert } from 'lucide-react-native';
import { useEffect } from 'react';
import { AccessibilityInfo, View } from 'react-native';

const LoadState = ({
  loading,
  label,
  skeleton,
  children,
  failed,
  slowMessage = 'Still loading. This can take a few seconds.',
  errorTitle = 'Couldn’t load this',
  errorDescription = 'Check your connection and try again.',
  errorDetail,
  onRetry,
}: LoadStateProps) => {
  const { phase, restart } = useLoadPhase(loading);
  const danger = useTokenColor('danger');
  const busy = phase === 'waiting' || phase === 'skeleton' || phase === 'slow';
  const showError = phase === 'timeout' || (phase === 'done' && failed);

  // Announce once, when the skeleton appears (a fast load says nothing); the blocks stay silent.
  useEffect(() => {
    if (phase === 'skeleton') AccessibilityInfo.announceForAccessibility(label);
  }, [phase, label]);

  const retry = () => {
    restart();
    onRetry?.();
  };

  return (
    <View accessibilityState={{ busy }}>
      {(phase === 'skeleton' || phase === 'slow') && (
        <>
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            {skeleton}
          </View>
          {phase === 'slow' && (
            <View className="mt-4 flex-row items-center gap-3 rounded-xl bg-surface-muted px-4 py-3.5">
              <Spinner size={20} />
              <Text className="flex-1 text-[1.0625rem] leading-5 font-semibold text-ink">
                {slowMessage}
              </Text>
            </View>
          )}
        </>
      )}

      {showError && (
        <View
          accessibilityLiveRegion="assertive"
          className="rounded-xl border-[1.5px] border-danger p-5"
        >
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            className="size-12 items-center justify-center rounded-full bg-danger/15"
          >
            <TriangleAlert aria-hidden size={scaled(24)} strokeWidth={2} color={danger} />
          </View>
          <Text
            accessibilityRole="header"
            className="mt-4 text-title font-extrabold uppercase text-ink"
          >
            {errorTitle}
          </Text>
          <Text className="mt-2 text-[1.0625rem] leading-6 font-semibold text-ink-muted">
            {errorDescription}
          </Text>
          {(onRetry || errorDetail) && (
            <View className="mt-5 flex-row flex-wrap items-center gap-x-4 gap-y-2">
              {onRetry && (
                <Button variant="primary" size="sm" onClick={retry}>
                  Retry
                </Button>
              )}
              {errorDetail && <Text className="text-meta text-ink-muted">{errorDetail}</Text>}
            </View>
          )}
        </View>
      )}

      {phase === 'done' && !failed && children}
    </View>
  );
};

export default LoadState;
