import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <img src={logo} alt="Tether.name" className="h-16 w-16 rounded-lg mb-6" />
      <h1 className="text-2xl font-bold text-black mb-2">Nothing to see here</h1>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="text-black hover:text-gray-700 font-medium text-sm"
      >
        ← Back to home
      </Link>
    </div>
  );
}
