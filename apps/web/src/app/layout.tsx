import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

// Read by --font-sans / --font-display in @sprintstack/ui/styles/tokens.web.css.
const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  axes: ['wdth'],
});

export const metadata: Metadata = {
  title: 'SprintStack: issue tracking for teams that ship',
  description:
    'Your backlog, sprints and releases in one fast, friendly workspace, on the web and in your pocket.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
