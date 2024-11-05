export type FontEntry = {
  family: string
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace'
  variants: string[]
  recommended: {
    usage: ('logo' | 'heading' | 'body' | 'accent' | 'tech')[]
    weights: string[]
  }
}

export const fonts: FontEntry[] = [
  // Versatile Modern Sans
  {
    family: 'Poppins',
    category: 'sans-serif',
    variants: ['100', '100italic', '200', '200italic', '300', '300italic', 'regular', 'italic', '500', '500italic', '600', '600italic', '700', '700italic', '800', '800italic', '900', '900italic'],
    recommended: {
      usage: ['heading', 'logo', 'body'],
      weights: ['400', '500', '600', '700'],
    },
  },
  {
    family: 'Plus Jakarta Sans',
    category: 'sans-serif',
    variants: ['200', '300', 'regular', '500', '600', '700', '800', '200italic', '300italic', 'italic', '500italic', '600italic', '700italic', '800italic'],
    recommended: {
      usage: ['heading', 'body'],
      weights: ['400', '500', '700'],
    },
  },
  // Premium Serifs
  {
    family: 'Fraunces',
    category: 'serif',
    variants: ['100', '200', '300', 'regular', '500', '600', '700', '800', '900', '100italic', '200italic', '300italic', 'italic', '500italic', '600italic', '700italic', '800italic', '900italic'],
    recommended: {
      usage: ['logo', 'heading', 'accent'],
      weights: ['600', '700', '900'],
    },
  },
  {
    family: 'Playfair Display',
    category: 'serif',
    variants: ['regular', '500', '600', '700', '800', '900', 'italic', '500italic', '600italic', '700italic', '800italic', '900italic'],
    recommended: {
      usage: ['logo', 'heading'],
      weights: ['600', '700', '800'],
    },
  },
  // Modern Tech-Forward
  {
    family: 'Space Grotesk',
    category: 'sans-serif',
    variants: ['300', 'regular', '500', '600', '700'],
    recommended: {
      usage: ['tech', 'heading', 'logo'],
      weights: ['500', '600', '700'],
    },
  },
  // Statement & Display
  {
    family: 'Bebas Neue',
    category: 'display',
    variants: ['regular'],
    recommended: {
      usage: ['logo', 'heading'],
      weights: ['regular'],
    },
  },
  {
    family: 'Syne',
    category: 'sans-serif',
    variants: ['regular', '500', '600', '700', '800'],
    recommended: {
      usage: ['logo', 'heading'],
      weights: ['600', '700', '800'],
    },
  },
  // Modern Workhorses
  {
    family: 'Inter',
    category: 'sans-serif',
    variants: ['100', '200', '300', 'regular', '500', '600', '700', '800', '900'],
    recommended: {
      usage: ['body', 'heading', 'tech'],
      weights: ['400', '500', '600'],
    },
  },
  {
    family: 'DM Sans',
    category: 'sans-serif',
    variants: ['100', '200', '300', 'regular', '500', '600', '700', '800', '900'],
    recommended: {
      usage: ['body', 'heading'],
      weights: ['400', '500', '700'],
    },
  },
  // Elegant Serifs
  {
    family: 'Cormorant',
    category: 'serif',
    variants: ['300', '300italic', 'regular', 'italic', '500', '500italic', '600', '600italic', '700', '700italic'],
    recommended: {
      usage: ['logo', 'heading', 'accent'],
      weights: ['300', '600', '700'],
    },
  },
  {
    family: 'Spectral',
    category: 'serif',
    variants: ['200', '200italic', '300', '300italic', 'regular', 'italic', '500', '500italic', '600', '600italic', '700', '700italic', '800', '800italic'],
    recommended: {
      usage: ['body', 'heading'],
      weights: ['300', '500', '600'],
    },
  },
  // Classic Serifs
  {
    family: 'Libre Baskerville',
    category: 'serif',
    variants: ['regular', 'italic', '700'],
    recommended: {
      usage: ['body', 'heading'],
      weights: ['regular', '700'],
    },
  },
  {
    family: 'Lora',
    category: 'serif',
    variants: ['regular', 'italic', '500', '500italic', '600', '600italic', '700', '700italic'],
    recommended: {
      usage: ['body', 'heading'],
      weights: ['regular', '600'],
    },
  },
  // Distinctive Sans
  {
    family: 'Oswald',
    category: 'sans-serif',
    variants: ['200', '300', 'regular', '500', '600', '700'],
    recommended: {
      usage: ['heading', 'logo'],
      weights: ['500', '600', '700'],
    },
  },
  {
    family: 'Work Sans',
    category: 'sans-serif',
    variants: ['100', '200', '300', 'regular', '500', '600', '700', '800', '900'],
    recommended: {
      usage: ['body', 'heading'],
      weights: ['400', '500', '600'],
    },
  },
  // Personality & Accent
  {
    family: 'Caveat',
    category: 'handwriting',
    variants: ['regular', '500', '600', '700'],
    recommended: {
      usage: ['accent', 'logo'],
      weights: ['500', '600'],
    },
  },
  {
    family: 'Architects Daughter',
    category: 'handwriting',
    variants: ['regular'],
    recommended: {
      usage: ['accent', 'logo'],
      weights: ['regular'],
    },
  },
  // Technical/Code
  {
    family: 'Fira Code',
    category: 'monospace',
    variants: ['300', 'regular', '500', '600', '700'],
    recommended: {
      usage: ['tech'],
      weights: ['400', '500'],
    },
  },
  {
    family: 'Space Mono',
    category: 'monospace',
    variants: ['regular', 'italic', '700', '700italic'],
    recommended: {
      usage: ['tech', 'accent'],
      weights: ['regular', '700'],
    },
  },
  {
    family: 'DM Mono',
    category: 'monospace',
    variants: ['300', '300italic', 'regular', 'italic', '500', '500italic'],
    recommended: {
      usage: ['tech'],
      weights: ['400', '500'],
    },
  },
  // Additional Workhorses
  {
    family: 'Manrope',
    category: 'sans-serif',
    variants: ['200', '300', 'regular', '500', '600', '700', '800'],
    recommended: {
      usage: ['body', 'heading', 'tech'],
      weights: ['400', '600', '700'],
    },
  },
  {
    family: 'IBM Plex Sans',
    category: 'sans-serif',
    variants: ['100', '200', '300', 'regular', '500', '600', '700'],
    recommended: {
      usage: ['body', 'tech'],
      weights: ['400', '500', '600'],
    },
  },
]
