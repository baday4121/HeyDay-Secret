import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="bg-gray-100 flex flex-col min-h-screen text-gray-800 antialiased">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center pt-8 px-4 pb-12 w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
}