import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import { LanguageProvider } from '@/lib/i18n';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Colombo MC Operations',
  description: 'Colombo Municipal Council — Street Lights and Waste Management.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <body
        className="bg-slate-50 text-slate-800 min-h-screen flex antialiased overflow-hidden selection:bg-emerald-100 selection:text-emerald-800"
        suppressHydrationWarning
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_105%,transparent_100%)] opacity-35 pointer-events-none -z-50" />
        <LanguageProvider>
          <div id="app-root-layout" className="flex w-full h-screen overflow-hidden">
            <Sidebar />
            <main id="main-content-stage" className="flex-1 h-screen overflow-y-auto flex flex-col relative">
              {children}
            </main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
