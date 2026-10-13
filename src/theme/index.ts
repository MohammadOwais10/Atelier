import { useColorScheme } from 'react-native';

/**
 * ATELIER — house design tokens.
 *
 * The palette is built around a warm "museum catalogue" feeling: bone paper by
 * day, lamp-lit gallery at night. A single vermilion accent carries the brand;
 * everything else is ink, paper, and hairline rules.
 */

export type Palette = {
  canvas: string;
  surface: string;
  elevated: string;
  ink: string;
  inkSoft: string;
  inkFaint: string;
  line: string;
  lineStrong: string;
  accent: string;
  accentSoft: string;
  accentInk: string;
  scrim: string;
  positive: string;
  critical: string;
};

export const palettes: Record<'light' | 'dark', Palette> = {
  light: {
    canvas: '#E7E1D5',
    surface: '#F6F2EA',
    elevated: '#FFFCF7',
    ink: '#15120D',
    inkSoft: '#5F584B',
    inkFaint: '#948B7B',
    line: 'rgba(21,18,13,0.11)',
    lineStrong: 'rgba(21,18,13,0.22)',
    accent: '#BE3D17',
    accentSoft: 'rgba(190,61,23,0.10)',
    accentInk: '#FFF4EC',
    scrim: 'rgba(10,8,6,0.52)',
    positive: '#3C6E47',
    critical: '#A8341A',
  },
  dark: {
    canvas: '#0C0A07',
    surface: '#15120D',
    elevated: '#1F1B14',
    ink: '#F4EEE1',
    inkSoft: '#A79D8C',
    inkFaint: '#776E5F',
    line: 'rgba(244,238,225,0.13)',
    lineStrong: 'rgba(244,238,225,0.24)',
    accent: '#EE6A3A',
    accentSoft: 'rgba(238,106,58,0.14)',
    accentInk: '#1A0D06',
    scrim: 'rgba(3,2,1,0.6)',
    positive: '#7CB98C',
    critical: '#F0836A',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 72,
} as const;

export const radius = {
  xs: 3,
  sm: 5,
  md: 9,
  lg: 16,
  pill: 999,
} as const;

export const fonts = {
  display: 'Fraunces_500Medium',
  displayRegular: 'Fraunces_400Regular',
  displaySemi: 'Fraunces_600SemiBold',
  displayItalic: 'Fraunces_400Regular_Italic',
  displayItalicMedium: 'Fraunces_500Medium_Italic',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemi: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
} as const;

type TypeToken = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
};

/** Editorial type scale. Display sizes are set for a slightly tight, printed look. */
export const type = {
  hero: { fontFamily: fonts.display, fontSize: 46, lineHeight: 46, letterSpacing: -0.8 },
  display: { fontFamily: fonts.display, fontSize: 34, lineHeight: 37, letterSpacing: -0.5 },
  title: { fontFamily: fonts.display, fontSize: 26, lineHeight: 30, letterSpacing: -0.3 },
  heading: { fontFamily: fonts.display, fontSize: 20, lineHeight: 25, letterSpacing: -0.2 },
  italic: { fontFamily: fonts.displayItalic, fontSize: 20, lineHeight: 28, letterSpacing: -0.1 },
  body: { fontFamily: fonts.sans, fontSize: 15.5, lineHeight: 24, letterSpacing: 0.1 },
  bodyStrong: { fontFamily: fonts.sansSemi, fontSize: 15, lineHeight: 22, letterSpacing: 0.1 },
  caption: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 19, letterSpacing: 0.1 },
  meta: { fontFamily: fonts.sansMedium, fontSize: 12, lineHeight: 17, letterSpacing: 0.3 },
  micro: { fontFamily: fonts.sansSemi, fontSize: 10.5, lineHeight: 14, letterSpacing: 1.6 },
  marker: { fontFamily: fonts.sansBold, fontSize: 10, lineHeight: 12, letterSpacing: 2.2 },
} satisfies Record<string, TypeToken>;

export type TypeTokenName = keyof typeof type;

export const motion = {
  duration: { fast: 180, base: 260, slow: 420 },
  spring: { damping: 18, stiffness: 190, mass: 0.9 },
  springSoft: { damping: 22, stiffness: 120, mass: 1 },
} as const;

export type AppTheme = {
  colors: Palette;
  scheme: 'light' | 'dark';
  isDark: boolean;
};

export function useAppTheme(): AppTheme {
  const scheme = useColorScheme();
  const resolved = scheme === 'dark' ? 'dark' : 'light';
  return {
    colors: palettes[resolved],
    scheme: resolved,
    isDark: resolved === 'dark',
  };
}
