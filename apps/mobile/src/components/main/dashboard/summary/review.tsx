import { scaled } from '@lib/scale';
import Card from '@ui/card';
import Text from '@ui/text';
import { type Href, router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';
import { Loadable, type QueryState } from '../loadable';
import { StatTileSkeleton } from '../skeletons';

const ReviewTile = ({ awaitingReview: query }: { awaitingReview: QueryState<number> }) => {
  const onBrand = useTokenColor('on-brand');
  return (
    <Loadable query={query} label="your review queue" skeleton={<StatTileSkeleton />}>
      {(awaitingReview) => (
        <Card variant="brand">
          <Text className="text-eyebrow font-bold uppercase text-on-brand">To review</Text>
          <View className="flex-1" />
          <Text className="text-[4.5rem] leading-[4.25rem] font-extrabold uppercase text-on-brand">
            {awaitingReview}
          </Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => router.navigate('/main/taskboard' as Href)}
            hitSlop={8}
            className="flex-row items-center gap-1 self-start active:opacity-70"
          >
            <Text className="text-[1.0625rem] leading-5 font-extrabold text-on-brand">
              Open queue
            </Text>
            <ArrowRight aria-hidden size={scaled(20)} strokeWidth={2.5} color={onBrand} />
          </Pressable>
        </Card>
      )}
    </Loadable>
  );
};

export default ReviewTile;
