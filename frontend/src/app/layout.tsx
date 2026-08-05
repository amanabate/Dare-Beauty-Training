import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dare Beauty Training Institute | ደሬ የውበት ማሰልጠኛ ተቋም',
  description:
    "Dare Women's & Men's Beauty Training Institute provides professional beauty vocational training in Hair Dressing, Barbering, Makeup Artistry, Nail Tech, Beauty Therapy, Lash Extensions and Waxing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className="scroll-smooth dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Geist+Mono:wght@100..900&family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&family=Manrope:wght@300;400;500;600;700;800&family=Noto+Sans+Ethiopic:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
        {/* Inline theme script — runs before React hydration to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('hc-theme')||'dark';document.documentElement.setAttribute('data-theme',t);if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-[var(--bg-base)] text-[var(--text-primary)] font-sans antialiased selection:bg-[#E9C349] selection:text-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
