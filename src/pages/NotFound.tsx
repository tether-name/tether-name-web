import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { StarField } from '../components/StarField';

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#1f1f1f] relative overflow-hidden">
      <StarField />
      <div className="relative z-10 min-h-[70vh] flex flex-col items-center justify-center">
        <img src={logo} alt="tether.name" className="h-16 w-16 rounded-lg mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">Nothing to see here</h1>
        <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="text-white hover:text-gray-300 font-medium text-sm"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
