import { scaled } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import Button from '@ui/button';
import Spinner from '@ui/spinner';
import Text from '@ui/text';
import type { SaveStatusProps } from '@ui/types';
import { clsx } from 'clsx';
import { Check, TriangleAlert } from 'lucide-react-native';
import { View } from 'react-native';

const SaveStatus = ({ state, savedAt, onRetry }: SaveStatusProps) => {
  const success = useTokenColor('success');
  const danger = useTokenColor('danger');
  const iconProps = { size: scaled(20), strokeWidth: 2, 'aria-hidden': true } as const;
  const words =
    state === 'saving'
      ? 'Saving…'
      : state === 'saved'
        ? savedAt
          ? `Saved · ${savedAt}`
          : 'Saved'
        : 'Couldn’t save.';

  return (
    <View className="flex-row items-center gap-3">
      {/* Only the words are live: the Retry link isn't re-read with every change. */}
      <View
        accessible
        accessibilityLabel={words}
        accessibilityLiveRegion="polite"
        className="flex-row items-center gap-2.5"
      >
        {state === 'saving' && <Spinner size={16} />}
        {state === 'saved' && <Check {...iconProps} color={success} />}
        {state === 'error' && <TriangleAlert {...iconProps} color={danger} />}
        <Text
          className={clsx(
            'text-[1.0625rem] leading-5 font-semibold',
            state === 'error' ? 'text-danger' : 'text-ink-muted',
          )}
        >
          {words}
        </Text>
      </View>
      {state === 'error' && onRetry && (
        <Button variant="link" onClick={onRetry}>
          Retry
        </Button>
      )}
    </View>
  );
};

export default SaveStatus;
