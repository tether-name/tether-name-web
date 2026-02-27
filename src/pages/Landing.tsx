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
            <span className="text-[#61d397]">tether</span>
            <span className="text-[#f4b049]">.</span>
            <span className="text-white">name</span>
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
            Let <Link to="/" className="text-[#f4b049] hover:underline">tether.name</Link> help you go through it.
          </p>
          <p className="text-base md:text-xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed">
            AI agents help us with tasks both mundane and important. Now, with tether.name,
            you can be sure an agent is who they claim to be and no one can claim to be you or your agent.
            Verification isn't new, but it just got a lot more accessible with <Link to="/" className="text-[#f4b049] hover:underline">tether.name</Link>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Link
              to="/challenge"
              className="bg-[#f4b049] hover:bg-[#e5a03a] text-white px-12 py-4 rounded-lg font-semibold text-xl transition-colors inline-flex items-center justify-center gap-2"
            >
              Verify an agent <span>→</span>
            </Link>
          </div>
          <p className="text-gray-500">
            Own an AI agent?{' '}
            <Link to="/auth" className="text-[#f4b049] hover:underline font-medium">
              Register it here
            </Link>
          </p>
          <p className="text-gray-500 mt-2">
            Developing an agent?{' '}
            <a href="https://docs.tether.name" className="text-[#f4b049] hover:underline font-medium">
              See our docs
            </a>
          </p>

          {stats && (stats.totalVerifications > 0 || stats.totalAgentsRegistered > 0) && (
            <div className="flex justify-center gap-12 mt-12">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{stats.totalVerifications.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Verifications</p>
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
            HOW IT WORKS:
          </h2>
          <p className="text-center text-gray-400 mb-16 text-lg">No accounts. 30 seconds.</p>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#f4b049] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Click "Verify"</h3>
              <p className="text-gray-400 leading-relaxed">
                Tether.name generates a unique, one-time challenge code and lets you copy a message to send to the inquiring AI Agent.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#f4b049] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Send</h3>
              <p className="text-gray-400 leading-relaxed">
                Paste the message wherever you're chatting with the agent. If it's legit, it will know what to do.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#f4b049] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Done</h3>
              <p className="text-gray-400 leading-relaxed">
                The page will update in real time. You'll see the email that the agent is associated to. No links, no extra clicks.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-32">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">
            HAVE AN AGENT:
          </h2>
          <p className="text-center text-gray-400 mb-16 text-lg">One account. 2 minutes.</p>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#61d397] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Create</h3>
              <p className="text-gray-400 leading-relaxed">
                Sign up using your email. No passwords, just codes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#61d397] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Register</h3>
              <p className="text-gray-400 leading-relaxed">
                Name your agent and Tether.name generates secure credentials. Copy and paste it into your agent's instructions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#61d397] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Finish</h3>
              <p className="text-gray-400 leading-relaxed">
                That's it. Every verification traces back to your email.
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
