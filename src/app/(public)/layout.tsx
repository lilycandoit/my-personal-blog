import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container">
      <Navbar />
      <main style={{ flex: 1, width: '100%' }}>{children}</main>
      <Footer />
    </div>
  );
}
