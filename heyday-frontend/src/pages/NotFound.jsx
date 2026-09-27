import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mt-10">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center w-full">
        <h1 className="text-6xl font-black text-blue-600 mb-2">404</h1>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Page Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">
          Oops! The secret page you are looking for does not exist, has been deleted, or you don't have access to it.
        </p>
        <Link 
          to="/" 
          className="inline-block w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-sm shadow-sm"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}