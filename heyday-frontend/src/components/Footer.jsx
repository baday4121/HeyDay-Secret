export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-4 text-center">
        <p className="text-sm text-gray-500">© {currentYear} HeyDay Secret. All rights reserved.</p>
      </div>
    </footer>
  );
}