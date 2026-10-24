import { extendTailwindMerge } from 'tailwind-merge';

// tailwind-merge only knows Tailwind's default scales. Without this, our type-scale classes
// (text-meta, text-body…) read as text colours and get dropped next to text-ink etc.
// Keep in sync with --text-* in src/styles/theme.css.
export const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'poster',
        'headline',
        'title',
        'heading',
        'eyebrow',
        'badge',
        'body',
        'body-strong',
        'meta',
        'button',
      ],
    },
  },
});
