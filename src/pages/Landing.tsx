import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { api } from '../api';

export function Landing() {
  const [stats, setStats] = useState<{ totalVerifications: number; totalAgentsRegistered: number } | null>(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#333]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-32">
          <img src={logo} alt="Tether.name" className="h-40 w-40 rounded-xl mx-auto mb-8" />
          <h1 className="text-6xl md:text-7xl font-bold mb-3 leading-tight">
            <span className="text-[#f4b049]">tether</span>
            <span className="text-[#61d396]">.name</span>
          </h1>
          <p className="text-3xl md:text-4xl text-gray-300 mb-8 font-medium">
            catch the drift
          </p>
          <p className="text-base md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Verify that everyone is who they claim to be.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/challenge"
              className="bg-[#f4b049] hover:bg-[#e5a03a] text-[#333] px-12 py-4 rounded-lg font-semibold text-xl transition-colors inline-flex items-center justify-center gap-2"
            >
              Verify Agent <span>→</span>
            </Link>
          </div>
        </div>

        {/* Verify an agent */}
        <div className="mb-32">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">
            verify an agent:
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#f4b049] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Verify</h3>
              <p className="text-gray-400 leading-relaxed">
                <span className="text-[#f4b049]">tether</span><span className="text-[#61d396]">.name</span> creates a message with a <span className="whitespace-nowrap">one-time</span> use code in it.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#f4b049] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Send</h3>
              <p className="text-gray-400 leading-relaxed">
                Paste the message wherever you're chatting with an agent.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#f4b049] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Done</h3>
              <p className="text-gray-400 leading-relaxed">
                The page updates. <span className="whitespace-nowrap">Green means verified;</span> <span className="whitespace-nowrap">red means unverified.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Register an agent */}
        <div className="mb-32">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">
            register an agent:
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#61d397] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Create</h3>
              <p className="text-gray-400 leading-relaxed">
                Sign up with just your email.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#61d397] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Register</h3>
              <p className="text-gray-400 leading-relaxed">
                Get a setup message to paste into your agent's instructions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#61d397] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Done</h3>
              <p className="text-gray-400 leading-relaxed">
                Your agent's verifications trace back to your email.
              </p>
            </div>
          </div>
        </div>

        {/* Links and stats */}
        <div className="text-center mb-32">
          <p className="text-gray-500">
            Have an AI Agent?{' '}
            <Link to="/auth" className="text-[#f4b049] hover:underline font-medium">
              Register it here
            </Link>
          </p>
          <p className="text-gray-500 mt-2">
            Developing an AI Agent?{' '}
            <a href="https://docs.tether.name" className="text-[#f4b049] hover:underline font-medium">
              See our docs
            </a>
          </p>
          <p className="text-gray-500 mt-2">
            Need help setting up an agent?{' '}
            <Link to="/guide" className="text-[#f4b049] hover:underline font-medium">
              Click here
            </Link>
          </p>

          {stats && (stats.totalVerifications > 0 || stats.totalAgentsRegistered > 0) && (
            <div className="flex justify-center gap-12 mt-12">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{stats.totalVerifications.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Agents Verified</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{stats.totalAgentsRegistered.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Agents Registered</p>
              </div>
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
}
