import {
  SKELETON_CONTROL_HEIGHTS,
  SKELETON_DEFAULT_WIDTH,
  SKELETON_SHAPES,
  skeletonLineWidths,
} from '@lib/loading';
import { useShimmer } from '@lib/motion.native';
import { scaled } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import type { SkeletonProps } from '@ui/types';
import { clsx } from 'clsx';
import { useState } from 'react';
import { Animated, type DimensionValue, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

const toDimension = (width: SkeletonProps['width']): DimensionValue | undefined =>
  typeof width === 'number' ? scaled(width) : width;

/** The light band that crosses a block, timed by the shared clock. */
const Shine = () => {
  const progress = useShimmer();
  const ink = useTokenColor('ink');
  const [width, setWidth] = useState(0);
  if (!progress) return null;

  const band = Math.max(width * 0.6, scaled(80));
  return (
    <View
      className="absolute inset-0"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      pointerEvents="none"
    >
      {width > 0 && (
        // Uniwind styles RN's own View, not Animated.View, so the band is placed with style.
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: band,
            transform: [
              {
                translateX: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-band, width],
                }),
              },
            ],
          }}
        >
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={ink} stopOpacity={0} />
                <Stop offset="0.5" stopColor={ink} stopOpacity={0.07} />
                <Stop offset="1" stopColor={ink} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#shine)" />
          </Svg>
        </Animated.View>
      )}
    </View>
  );
};

const Block = ({
  className,
  width,
  height,
}: {
  className: string;
  width?: DimensionValue;
  height?: DimensionValue;
}) => (
  <View
    className={clsx('overflow-hidden bg-surface-muted', className)}
    // Only the dimensions that are set: an undefined `height` in style overrides the class height.
    style={{ width, ...(height !== undefined && { height }) }}
  >
    <Shine />
  </View>
);

const Skeleton = ({ shape = 'line', width, size = 'md', lines }: SkeletonProps) => {
  const w = toDimension(width ?? SKELETON_DEFAULT_WIDTH[shape]);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={clsx('gap-2.5', !w && 'self-stretch')}
      style={{ width: w }}
    >
      {shape === 'line' && lines && lines > 1 ? (
        skeletonLineWidths(lines).map((lineWidth, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: the lines are identical placeholders.
          <Block key={i} className={SKELETON_SHAPES.line} width={lineWidth as DimensionValue} />
        ))
      ) : (
        <Block
          className={clsx(
            SKELETON_SHAPES[shape],
            shape === 'control' && SKELETON_CONTROL_HEIGHTS[size],
          )}
          width="100%"
          height={shape === 'circle' || shape === 'icon' ? w : undefined}
        />
      )}
    </View>
  );
};

export default Skeleton;
