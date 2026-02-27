import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

/* Scattered floating dots — pure CSS positioned elements */
const DOTS = [
  { top: '5%', left: '8%', size: 3, opacity: 0.3 },
  { top: '12%', left: '85%', size: 2, opacity: 0.25 },
  { top: '18%', left: '45%', size: 2, opacity: 0.2 },
  { top: '22%', left: '92%', size: 3, opacity: 0.35 },
  { top: '28%', left: '15%', size: 2, opacity: 0.2 },
  { top: '32%', left: '72%', size: 3, opacity: 0.3 },
  { top: '38%', left: '5%', size: 2, opacity: 0.25 },
  { top: '42%', left: '55%', size: 2, opacity: 0.15 },
  { top: '48%', left: '88%', size: 3, opacity: 0.3 },
  { top: '52%', left: '30%', size: 2, opacity: 0.2 },
  { top: '58%', left: '78%', size: 2, opacity: 0.25 },
  { top: '62%', left: '12%', size: 3, opacity: 0.3 },
  { top: '68%', left: '60%', size: 2, opacity: 0.2 },
  { top: '72%', left: '95%', size: 2, opacity: 0.25 },
  { top: '78%', left: '40%', size: 3, opacity: 0.3 },
  { top: '82%', left: '20%', size: 2, opacity: 0.2 },
  { top: '88%', left: '70%', size: 2, opacity: 0.25 },
  { top: '92%', left: '50%', size: 3, opacity: 0.15 },
  { top: '7%', left: '35%', size: 2, opacity: 0.2 },
  { top: '15%', left: '65%', size: 3, opacity: 0.25 },
  { top: '35%', left: '25%', size: 2, opacity: 0.2 },
  { top: '45%', left: '10%', size: 2, opacity: 0.3 },
  { top: '55%', left: '48%', size: 3, opacity: 0.2 },
  { top: '65%', left: '82%', size: 2, opacity: 0.25 },
  { top: '75%', left: '3%', size: 3, opacity: 0.3 },
  { top: '85%', left: '58%', size: 2, opacity: 0.2 },
  { top: '95%', left: '25%', size: 2, opacity: 0.15 },
];

export function Landing() {
  const [stats, setStats] = useState<{ totalVerifications: number; totalAgentsRegistered: number } | null>(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#1f1f1f] relative overflow-hidden">
      {/* Floating dots */}
      {DOTS.map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            opacity: dot.opacity,
          }}
        />
      ))}

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center mb-4">
          {/* Combined hero graphic: robot + logotype + tether line */}
          <img
            src="/hero.svg"
            alt="tether.name — verify AI agents are who they claim to be"
            className="w-full max-w-3xl mx-auto object-contain"
          />
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 font-medium max-w-lg text-center mt-4">
            catch the drift: verify AI agents are who they claim to be.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-row gap-4 justify-center mb-20">
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
        <div className="mb-28 flex flex-col md:flex-row items-center gap-4 md:gap-3 max-w-5xl mx-auto">
          {/* Left Card — Chat bubbles */}
          <div className="border border-[#555] bg-[#2a2a2a] rounded-2xl p-5 flex-1 min-w-0 w-full">
            <p className="text-gray-500 text-xs mb-4 uppercase tracking-wide">Example</p>
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

          {/* Arrow cursor between cards */}
          <div className="flex-shrink-0">
            <img
              src="/arrow-cursor.png"
              alt=""
              className="hidden md:block w-10 h-10 object-contain"
            />
            <img
              src="/arrow-cursor.png"
              alt=""
              className="block md:hidden w-10 h-10 object-contain rotate-90"
            />
          </div>

          {/* Right Card — Verification result */}
          <div className="border border-[#555] bg-[#2a2a2a] rounded-2xl p-5 flex-1 min-w-0 w-full">
            <p className="text-gray-500 text-xs mb-4 uppercase tracking-wide">What you'll see</p>
            <div className="bg-[#1f1f1f] border border-[#555] p-6 rounded-lg">
              <div className="text-center mb-5">
                <div className="w-14 h-14 bg-[#f4b049] rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Challenge Complete</h2>
                <p className="text-gray-400 text-sm">The agent signed this challenge</p>
              </div>

              <div className="bg-[#2a2a2a] p-5 rounded-lg border-2 border-[#61d397]">
                <p className="text-center text-gray-400 text-sm mb-2">This agent represents</p>
                <p className="text-center text-xl font-bold text-white mb-1">concierge@hotelsol.com</p>
                <p className="text-center text-gray-500 text-sm">Agent name: Hotel Sol Agent</p>
                <p className="text-center text-gray-400 text-xs mt-2">Member since 1/15/2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Verify — Steps with wavy rope */}
        <div className="mb-24">
          <h2 className="text-center text-2xl font-bold text-white mb-12">How to verify</h2>
          <div className="relative">
            {/* Wavy rope connector — desktop only */}
            <svg
              className="hidden md:block absolute top-6 left-[15%] w-[70%] h-12 pointer-events-none"
              viewBox="0 0 700 48"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 24 C50 8, 100 40, 175 24 S300 8, 350 24 S475 40, 525 24 S650 8, 700 24"
                stroke="#f4b049"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Vertical connector — mobile only */}
            <div className="md:hidden absolute left-1/2 top-10 bottom-10 w-0.5 bg-[#f4b049] -translate-x-1/2 opacity-40" />

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
                <img
                  src="/robot-small.png"
                  alt="Robot"
                  className="w-16 h-16 mx-auto mt-3 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* How to Register — Steps with wavy rope */}
        <div className="mb-24">
          <h2 className="text-center text-2xl font-bold text-white mb-12">How to register</h2>
          <div className="relative">
            {/* Wavy rope connector — desktop only */}
            <svg
              className="hidden md:block absolute top-6 left-[15%] w-[70%] h-12 pointer-events-none"
              viewBox="0 0 700 48"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 24 C50 8, 100 40, 175 24 S300 8, 350 24 S475 40, 525 24 S650 8, 700 24"
                stroke="#61d397"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Vertical connector — mobile only */}
            <div className="md:hidden absolute left-1/2 top-10 bottom-10 w-0.5 bg-[#61d397] -translate-x-1/2 opacity-40" />

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
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-6">
            <Link to="/auth" className="text-[#f4b049] hover:underline font-medium text-lg">
              Register
            </Link>
            <a href="https://docs.tether.name" className="text-[#f4b049] hover:underline font-medium text-lg">
              Docs
            </a>
            <Link to="/guide" className="text-[#f4b049] hover:underline font-medium text-lg">
              Guide
            </Link>
          </div>

          {stats && (stats.totalVerifications > 0 || stats.totalAgentsRegistered > 0) && (
            <div className="flex justify-center gap-12 mt-8">
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

      {/* Bottom robot mascots */}
      <div className="relative h-24 md:h-32 pointer-events-none">
        <img
          src="/robot-bottom-left.png"
          alt=""
          className="absolute bottom-0 left-4 md:left-12 w-20 md:w-28 object-contain"
        />
        <img
          src="/robot-bottom-right.png"
          alt=""
          className="absolute bottom-0 right-4 md:right-12 w-20 md:w-28 object-contain"
        />
      </div>
    </div>
  );
}
