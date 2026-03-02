import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { StarField } from '../components/StarField';

export function Support() {
  return (
    <div className="min-h-screen bg-[#1f1f1f] relative overflow-hidden">
      <StarField />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-gray-500 hover:text-white transition-colors">
          <img src={logo} alt="tether.name" className="h-6 w-6 rounded" />
          <span className="font-medium">tether.name</span>
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Support</h1>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            Please contact us via email if you are having any issues at{' '}
            <a href="mailto:support@tether.name" className="text-[#f4b049] underline hover:no-underline">support@tether.name</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
