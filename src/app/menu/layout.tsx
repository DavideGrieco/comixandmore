import '../globals.css';

export const metadata = {
  title: 'Menu – Comix&More',
  description: 'Scopri il nostro menu completo: birre artigianali, cocktail, panini gourmet e molto altro!',
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}