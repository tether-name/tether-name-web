import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { StarField } from '../components/StarField';



export function Landing() {
  const [stats, setStats] = useState<{ totalVerifications: number; totalAgentsRegistered: number } | null>(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#1f1f1f] relative overflow-hidden">
      <StarField />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center">
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 font-medium max-w-lg text-center mb-4">
            catch the drift: verify AI agents are who they say they are.
          </p>
          {/* Combined hero graphic: robot + logotype + tether line */}
          <img
            src="/hero.svg"
            alt="tether.name — verify AI agents are who they say they are"
            className="w-full max-w-4xl mx-auto object-contain"
          />
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 font-medium max-w-lg text-center -mt-8">
            catch the drift: verify AI agents are who they say they are.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-row gap-4 justify-center mt-8 mb-20">
          <Link
            to="/challenge"
            className="bg-[#f4b049] hover:bg-[#e5a03a] text-[#333] px-10 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Verify
          </Link>
          <Link
            to="/auth"
            className="bg-[#61d397] hover:bg-[#52c488] text-[#333] px-10 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            My Agents
          </Link>
        </div>

        {/* Example Section — Chat Demo + Verification Result */}
        <div className="mb-28 flex flex-col md:flex-row items-stretch gap-4 md:gap-3 max-w-5xl mx-auto">
          {/* Left Card — Chat bubbles */}
          <div className="border border-[#555] bg-[#333] rounded-2xl p-5 flex-1 min-w-0 w-full">
            <p className="text-gray-500 text-xs mb-4 uppercase tracking-wide">Example</p>
            <div className="flex flex-col gap-4">
              {/* Agent message */}
              <div className="flex justify-start">
                <div className="bg-[#444] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%]">
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
                    Verification code{' '}
                    <span className="font-mono text-xs bg-[#4ec085] rounded px-1 py-0.5 break-all">
                      02e0f359-b8dc-4284-b994-c0f27e1d9cb3
                    </span>
                  </p>
                </div>
              </div>

              {/* Agent verified message */}
              <div className="flex justify-start">
                <div className="bg-[#444] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%]">
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Verified! ✅ Here's the link:{' '}
                    <span className="text-[#f4b049] underline break-all">
                      tether.name/check?challenge=02e0f359-b8dc-4284-b994-c0f27e1d9cb3
                    </span>
                  </p>
                </div>
              </div>

              {/* User reply */}
              <div className="flex justify-end">
                <div className="bg-[#61d396] rounded-2xl rounded-br-sm px-4 py-3 max-w-[85%]">
                  <p className="text-[#1a1a1a] text-sm leading-relaxed">
                    Great, thanks for confirming!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card — Verification result */}
          <div className="border border-[#555] bg-[#333] rounded-2xl p-5 flex-1 min-w-0 w-full">
            <p className="text-gray-500 text-xs mb-4 uppercase tracking-wide">What you'll see</p>
            <div className="bg-[#1f1f1f] border border-[#555] p-6 rounded-lg">
              <div className="text-center mb-5">
                <div className="w-14 h-14 bg-[#f4b049] rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Verification Complete</h2>
                <p className="text-gray-400 text-sm">The agent signed this code</p>
              </div>

              <div className="bg-[#333] p-5 rounded-lg border-2 border-[#61d397]">
                <p className="text-center text-gray-400 text-sm mb-2">Verified agent</p>
                <p className="text-center text-xl font-bold text-white mb-1">Hotel Sol Agent</p>
                <p className="text-center text-gray-400 text-xs mt-2">Member since 1/15/2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Verify — Steps with wavy rope */}
        <div className="mb-24">
          
          <div className="relative">


            <div className="relative grid md:grid-cols-3 gap-10 md:gap-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#f4b049] rounded-full mx-auto mb-5 flex items-center justify-center relative z-10">
                  <span className="text-xl font-bold text-[#1f1f1f]" style={{ fontFamily: "'Dosis', sans-serif" }}>1</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Create</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  <span className="text-[#f4b049]">tether</span><span className="text-[#61d396]">.name</span> generates a message with a <span className="whitespace-nowrap">one-time</span> code in it.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#f4b049] rounded-full mx-auto mb-5 flex items-center justify-center relative z-10">
                  <span className="text-xl font-bold text-[#1f1f1f]" style={{ fontFamily: "'Dosis', sans-serif" }}>2</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Send</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Paste the message wherever you're chatting with an agent.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#f4b049] rounded-full mx-auto mb-5 flex items-center justify-center relative z-10">
                  <span className="text-xl font-bold text-[#1f1f1f]" style={{ fontFamily: "'Dosis', sans-serif" }}>3</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Done</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  The page will update with the agent's status.
                </p>

              </div>
            </div>
          </div>
        </div>

        {/* How to Register — Steps with wavy rope */}
        <div className="mb-24">
          
          <div className="relative">


            <div className="relative grid md:grid-cols-3 gap-10 md:gap-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#61d397] rounded-full mx-auto mb-5 flex items-center justify-center relative z-10">
                  <span className="text-xl font-bold text-[#1f1f1f]" style={{ fontFamily: "'Dosis', sans-serif" }}>1</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Create</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Sign up with just your email.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#61d397] rounded-full mx-auto mb-5 flex items-center justify-center relative z-10">
                  <span className="text-xl font-bold text-[#1f1f1f]" style={{ fontFamily: "'Dosis', sans-serif" }}>2</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Register</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Get a setup message to paste into your agent's instructions.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#61d397] rounded-full mx-auto mb-5 flex items-center justify-center relative z-10">
                  <span className="text-xl font-bold text-[#1f1f1f]" style={{ fontFamily: "'Dosis', sans-serif" }}>3</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Done</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Your agent's verifications trace back to the email it's registered under.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Links and Stats */}
        <div className="text-center mb-20">
          <div className="flex flex-col gap-2 items-center mb-6">
            <p className="text-gray-500">
              Have an AI agent?{' '}
              <Link to="/auth" className="text-[#f4b049] hover:underline font-medium">
                Register here
              </Link>
            </p>
            <p className="text-gray-500">
              Developing an AI agent?{' '}
              <a href="https://docs.tether.name" className="text-[#f4b049] hover:underline font-medium">
                See our docs
              </a>
            </p>
            <p className="text-gray-500">
              Need help setting up an AI agent?{' '}
              <Link to="/guide" className="text-[#f4b049] hover:underline font-medium">
                See our guide
              </Link>
            </p>
          </div>

          {stats && (stats.totalVerifications > 0 || stats.totalAgentsRegistered > 0) && (
            <div className="flex justify-center gap-12 mt-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{stats.totalVerifications.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Agents verified</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{stats.totalAgentsRegistered.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Agents registered</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom robot mascot */}
      <div className="flex justify-center pointer-events-none -mb-4">
        <img
          src="/robot-four.svg"
          alt=""
          className="w-28 md:w-36 object-contain"
        />
      </div>
    </div>
  );
}
