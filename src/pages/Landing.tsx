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
        <div className="text-center mb-16">
          <img src={logo} alt="Tether.name" className="h-40 w-40 rounded-xl mx-auto mb-8" />
          <h1 className="text-6xl md:text-7xl font-bold mb-3 leading-tight">
            <span className="text-[#f4b049]">tether</span>
            <span className="text-[#61d396]">.name</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-10 font-medium max-w-2xl mx-auto">
            catch the drift: verify an AI agent is who they claim to be.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/challenge"
              className="bg-[#f4b049] hover:bg-[#e5a03a] text-[#333] px-12 py-4 rounded-lg font-semibold text-xl transition-colors inline-flex items-center justify-center gap-2"
            >
              Verify
            </Link>
            <Link
              to="/auth"
              className="bg-[#61d397] hover:bg-[#52c488] text-[#333] px-12 py-4 rounded-lg font-semibold text-xl transition-colors inline-flex items-center justify-center gap-2"
            >
              My Agents
            </Link>
          </div>
        </div>

        {/* Chat Demo + Verification Result */}
        <div className="mb-32 flex flex-col md:flex-row items-center gap-6 max-w-5xl mx-auto">
          {/* Chat bubbles */}
          <div className="border border-[#555] rounded-2xl p-5 flex-1 min-w-0">
            <p className="text-gray-600 text-xs mb-4">Example</p>
            <div className="flex flex-col gap-4">
              {/* Agent message */}
              <div className="flex justify-start">
                <div className="bg-[#3d3d3d] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%]">
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Hey, this is the Hotel Sol agent, letting you know your room
                    changed to room 451 for your upcoming stay.
                  </p>
                </div>
              </div>

              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-[#61d396] rounded-2xl rounded-br-sm px-4 py-3 max-w-[85%]">
                  <p className="text-[#1a1a1a] text-sm leading-relaxed">
                    Please verify your identity on{' '}
                    <span className="font-semibold underline">tether.name</span>.
                    Challenge code{' '}
                    <span className="font-mono text-xs bg-[#4ec085] rounded px-1 py-0.5 break-all">
                      02e0f359-b8dc-4284-b994-c0f27e1d9cb3
                    </span>
                  </p>
                </div>
              </div>

              {/* Agent verified message */}
              <div className="flex justify-start">
                <div className="bg-[#3d3d3d] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%]">
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Verified! ✅ Here's the link:{' '}
                    <span className="text-[#f4b049] underline break-all">
                      tether.name/check?challenge=02e0f359-b8dc-4284-b994-c0f27e1d9cb3
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 text-gray-500">
            {/* Right arrow on desktop, down arrow on mobile */}
            <svg className="hidden md:block w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <svg className="block md:hidden w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          {/* Verification result preview — mirrors VerifiedResult.tsx styles */}
          <div className="border border-[#555] rounded-2xl p-5 flex-1 min-w-0">
            <p className="text-gray-600 text-xs mb-4">What you'll see</p>
            <div className="bg-[#2a2a2a] border border-[#555] p-8 rounded-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#f4b049] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Challenge Complete</h2>
                <p className="text-gray-400 text-lg">The agent signed this challenge</p>
              </div>

              <div className="bg-[#2a2a2a] p-6 rounded-lg border-2 border-[#61d397]">
                <p className="text-center text-gray-400 text-sm mb-2">This agent represents</p>
                <p className="text-center text-2xl font-bold text-white mb-1">concierge@hotelsol.com</p>
                <p className="text-center text-gray-500">Agent name: Hotel Sol Agent</p>
                <p className="text-center text-gray-400 text-sm mt-2">Member since 1/15/2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="mb-32">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#f4b049] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-[#333]">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Create</h3>
              <p className="text-gray-400 leading-relaxed">
                <span className="text-[#f4b049]">tether</span><span className="text-[#61d396]">.name</span> generates a message with a <span className="whitespace-nowrap">one-time</span> code in it.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#f4b049] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-[#333]">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Send</h3>
              <p className="text-gray-400 leading-relaxed">
                Paste the message wherever you're chatting with an agent.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#f4b049] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-[#333]">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Done</h3>
              <p className="text-gray-400 leading-relaxed">
                The page will update the agent's status.
              </p>
            </div>
          </div>
        </div>

        {/* Register steps */}
        <div className="mb-32">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#61d397] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-[#333]">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Create</h3>
              <p className="text-gray-400 leading-relaxed">
                Sign up with just your email.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#61d397] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-[#333]">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Register</h3>
              <p className="text-gray-400 leading-relaxed">
                Get a setup message to paste into your agent's instructions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#61d397] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-[#333]">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Done</h3>
              <p className="text-gray-400 leading-relaxed">
                Your agent's verifications trace back to the email it's registered under.
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
