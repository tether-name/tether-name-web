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
      <div className="max-w-6xl mx-auto px-4 py-32">
        {/* Hero Section */}
        <div className="text-center mb-32">
          <img src={logo} alt="Tether.name" className="h-40 w-40 rounded-xl mx-auto mb-8" />
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="text-[#f4b049]">tether</span>
            <span className="text-[#61d396]">.name</span>
          </h1>
          <p className="text-2xl text-gray-300 mb-8 font-medium">
            connect and protect
          </p>
          <p className="text-base md:text-xl text-gray-400 mb-6 max-w-3xl mx-auto leading-relaxed">
            AI is here.
          </p>
          <p className="text-base md:text-xl text-gray-400 mb-6 max-w-3xl mx-auto leading-relaxed">
            And there. At work, in schools, homes - soon, everywhere.
            <br />
            You can't go above it. You can't get around it.
            <br />
            <Link to="/" className="hover:underline"><span className="text-[#f4b049]">tether</span><span className="text-[#61d396]">.name</span></Link> can help you get through it.
          </p>
          <p className="text-base md:text-xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed">
            Sooner rather than later, everyone will have an AI agent to help get things done.
            With <Link to="/" className="hover:underline"><span className="text-[#f4b049]">tether</span><span className="text-[#61d396]">.name</span></Link> you
            can be sure whoever you're interacting with is who they claim to be and no one is impersonating you or your agent.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Link
              to="/challenge"
              className="bg-[#f4b049] hover:bg-[#e5a03a] text-[#333] px-12 py-4 rounded-lg font-semibold text-xl transition-colors inline-flex items-center justify-center gap-2"
            >
              Verify Agent <span>→</span>
            </Link>
          </div>
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

          {stats && (stats.totalVerifications > 0 || stats.totalAgentsRegistered > 0) && (
            <div className="flex justify-center gap-12 mt-12">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{stats.totalVerifications.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Agent Verifications</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{stats.totalAgentsRegistered.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Agents Registered</p>
              </div>
            </div>
          )}
        </div>

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
                <span className="text-[#f4b049]">tether</span><span className="text-[#61d396]">.name</span> creates a message with a one-time use code in it.
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
                The page updates. Green means verified; red means unverified.
              </p>
            </div>
          </div>
        </div>

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
                Name your agent and <span className="text-[#f4b049]">tether</span><span className="text-[#61d396]">.name</span> gives you a setup message to paste into your agent.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#61d397] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Done</h3>
              <p className="text-gray-400 leading-relaxed">
                Every verification for your agent traces back to your email.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-32">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">
            Why Tether.name?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border border-[#555] p-8 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-3">No fakes:</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Each verification gets a new challenge with zero repetition
              </p>
            </div>

            <div className="border border-[#555] p-8 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-3">No accounts:</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Anyone can verify an agent. Only those with an agent need an account
              </p>
            </div>

            <div className="border border-[#555] p-8 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-3">No waiting:</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The page updates as soon as there's a response.
              </p>
            </div>

            <div className="border border-[#555] p-8 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-3">No Hiding:</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every agent links back to a real human's verified email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
