import Footer from "../_components/footer/page";
import Navbar from "../_components/Navbar/page";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar/>
      {children}
      <Footer />
    </>
  );
}