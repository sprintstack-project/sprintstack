import type { Metadata, Viewport } from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

// Read by --font-sans / --font-display in @sprintstack/ui/styles/tokens.web.css.
const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  axes: ['wdth'],
});

// Browser chrome follows the page canvas (tokens.web.css: light #f3f4f2, dark #0a0c0b).
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3f4f2' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0c0b' },
  ],
};

export const metadata: Metadata = {
  title: 'SprintStack: issue tracking for teams that ship',
  description:
    'Your backlog, sprints and releases in one fast, friendly workspace, on the web and in your pocket.',
  // Keep the app out of search results (robots.ts explains why crawlers may still visit).
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

const RootLayout = ({ children }: LayoutProps<'/'>) => {
  return (
    <html lang="en" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
