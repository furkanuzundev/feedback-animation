export const fontFamilies = {
  regular: 'Roboto_400Regular',
  medium: 'Roboto_500Medium',
  bold: 'Roboto_700Bold',
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const typography = {
  h1: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['3xl'],
  },
  h2: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['2xl'],
  },
  h3: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.xl,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.md,
  },
  bodyBold: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.md,
  },
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.sm,
  },
  button: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.md,
  },
} as const;

export type Typography = typeof typography;
export type FontFamily = typeof fontFamilies;
export type FontSize = typeof fontSizes;
