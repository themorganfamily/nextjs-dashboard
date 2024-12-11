import '@/app/ui/global.css';
// import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import Script from 'next/script'

 
export const metadata: Metadata = {
  title: 'Testing Tools',
  description: 'Testing Tools.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`antialiased`} >{children}</body>    
      <Script src="https://static.zip.co/lib/js/zm-widget-js/dist/zip-widget.min.js" strategy="afterInteractive"/>
    </html>
  );
}
