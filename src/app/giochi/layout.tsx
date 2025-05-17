// src/app/giochi/layout.tsx
import '../globals.css';

export const metadata = {
  title: 'Catalogo Giochi – Comix&More',
  description: 'Sfoglia il nostro catalogo di giochi da tavolo: evergreen e novità!',
};

export default function GiochiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
