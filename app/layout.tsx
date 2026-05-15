import './globals.css';
import HomeElement from './page';

export const metadata = {
  title: 'Slate Workspace Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0808] text-[#F4EBE1]">
        {/* We call your components directly here to render them onto the window layout */}
        <HomeElement />
        {children}
      </body>
    </html>
  );
}