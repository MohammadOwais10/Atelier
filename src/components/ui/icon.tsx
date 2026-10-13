import { memo } from 'react';
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';

export type IconName =
  | 'chevronLeft'
  | 'chevronRight'
  | 'arrowUpRight'
  | 'share'
  | 'refresh'
  | 'alert'
  | 'search'
  | 'close'
  | 'info'
  | 'spark';

type IconProps = {
  name: IconName;
  size?: number;
  color: string;
  strokeWidth?: number;
};

/**
 * House icon set. Hand-drawn on a 24pt grid with a light, even stroke so the
 * marks read as engraving rather than a stock icon pack.
 */
function IconBase({ name, size = 20, color, strokeWidth = 1.5 }: IconProps) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'chevronLeft' && <Polyline points="15 18 9 12 15 6" {...common} />}
      {name === 'chevronRight' && <Polyline points="9 18 15 12 9 6" {...common} />}
      {name === 'arrowUpRight' && (
        <>
          <Line x1="7" y1="17" x2="17" y2="7" {...common} />
          <Polyline points="8 7 17 7 17 16" {...common} />
        </>
      )}
      {name === 'share' && (
        <>
          <Path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" {...common} />
          <Polyline points="16 6 12 2 8 6" {...common} />
          <Line x1="12" y1="2" x2="12" y2="15" {...common} />
        </>
      )}
      {name === 'refresh' && (
        <>
          <Polyline points="21 4 21 10 15 10" {...common} />
          <Polyline points="3 20 3 14 9 14" {...common} />
          <Path d="M3.5 9a9 9 0 0 1 14.8-3.4L21 10M3 14l4.6 4.4A9 9 0 0 0 20.5 15" {...common} />
        </>
      )}
      {name === 'alert' && (
        <>
          <Circle cx="12" cy="12" r="9.25" {...common} />
          <Line x1="12" y1="7.5" x2="12" y2="13" {...common} />
          <Line x1="12" y1="16.4" x2="12" y2="16.5" {...common} />
        </>
      )}
      {name === 'search' && (
        <>
          <Circle cx="10.8" cy="10.8" r="7.3" {...common} />
          <Line x1="16.2" y1="16.2" x2="21" y2="21" {...common} />
        </>
      )}
      {name === 'close' && (
        <>
          <Line x1="18" y1="6" x2="6" y2="18" {...common} />
          <Line x1="6" y1="6" x2="18" y2="18" {...common} />
        </>
      )}
      {name === 'info' && (
        <>
          <Circle cx="12" cy="12" r="9.25" {...common} />
          <Line x1="12" y1="11" x2="12" y2="16.5" {...common} />
          <Line x1="12" y1="7.6" x2="12" y2="7.7" {...common} />
        </>
      )}
      {name === 'spark' && (
        <Path d="M12 2.5l1.9 6.1L20 10.5l-6.1 1.9L12 18.5l-1.9-6.1L4 10.5l6.1-1.9L12 2.5z" {...common} />
      )}
    </Svg>
  );
}

export const Icon = memo(IconBase);
