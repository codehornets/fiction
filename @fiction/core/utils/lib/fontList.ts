export type FontEntry = {
  family: string
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace'
  variants: string[]
}

export const fonts: FontEntry[] = [
  // Versatile Modern Sans
  {
    family: 'Poppins',
    category: 'sans-serif',
    variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  },
  {
    family: 'Plus Jakarta Sans',
    category: 'sans-serif',
    variants: ['200', '300', '400', '500', '600', '700', '800'],
  },
  // Premium Serifs
  {
    family: 'Fraunces',
    category: 'serif',
    variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  },
  {
    family: 'Playfair Display',
    category: 'serif',
    variants: ['400', '500', '600', '700', '800', '900'],
  },
  // Modern Tech-Forward
  {
    family: 'Space Grotesk',
    category: 'sans-serif',
    variants: ['300', '400', '500', '600', '700'],
  },
  // Statement & Display
  {
    family: 'Bebas Neue',
    category: 'display',
    variants: ['400'],
  },
  {
    family: 'Syne',
    category: 'sans-serif',
    variants: ['400', '500', '600', '700', '800'],
  },
  // Modern Workhorses
  {
    family: 'Inter',
    category: 'sans-serif',
    variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  },
  {
    family: 'DM Sans',
    category: 'sans-serif',
    variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  },
  // Elegant Serifs
  {
    family: 'Cormorant',
    category: 'serif',
    variants: ['300', '400', '500', '600', '700'],
  },
  {
    family: 'Spectral',
    category: 'serif',
    variants: ['200', '300', '400', '500', '600', '700', '800'],
  },
  // Classic Serifs
  {
    family: 'Libre Baskerville',
    category: 'serif',
    variants: ['400', '700'],
  },
  {
    family: 'Lora',
    category: 'serif',
    variants: ['400', '500', '600', '700'],
  },
  // Distinctive Sans
  {
    family: 'Oswald',
    category: 'sans-serif',
    variants: ['200', '300', '400', '500', '600', '700'],
  },
  {
    family: 'Work Sans',
    category: 'sans-serif',
    variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  },
  // Personality & Accent
  {
    family: 'Caveat',
    category: 'handwriting',
    variants: ['400', '500', '600', '700'],
  },
  {
    family: 'Architects Daughter',
    category: 'handwriting',
    variants: ['400'],
  },
  // Technical/Code
  {
    family: 'Fira Code',
    category: 'monospace',
    variants: ['300', '400', '500', '600', '700'],
  },
  {
    family: 'Space Mono',
    category: 'monospace',
    variants: ['400', '700'],
  },
  {
    family: 'DM Mono',
    category: 'monospace',
    variants: ['300', '400', '500', '500italic'],
  },
  // Additional Workhorses
  {
    family: 'Manrope',
    category: 'sans-serif',
    variants: ['200', '300', '400', '500', '600', '700', '800'],
  },
  {
    family: 'IBM Plex Sans',
    category: 'sans-serif',
    variants: ['100', '200', '300', '400', '500', '600', '700'],
  },
]
