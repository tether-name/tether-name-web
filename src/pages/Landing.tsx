import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { api } from '../api';

export function Landing() {
  const [stats, setStats] = useState<{ totalVerifications: number; totalAgentsRegistered: number } | null>(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-32">
        {/* Hero Section */}
        <div className="text-center mb-32">
          <img src={logo} alt="Tether.name" className="h-16 w-16 rounded-xl mx-auto mb-8" />
          <h1 className="text-6xl md:text-7xl font-bold text-black mb-8 leading-tight">
            Tether.name
          </h1>
          <p className="text-2xl text-gray-700 mb-8 font-medium">
            Protect & Connect
          </p>
          <p className="text-base md:text-xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
            AI agents are here.
            And there. At work, in schools, homes - everywhere.
            You can’t go above it. You can’t get around it. Let Tether.name help you through it.

            Eventually we’ll all have an AI agent that helps us with tasks both mundane and important. Now, through Tether, you can ensure an agent is who they say they are and that no one else can claim to be you or your agent.

            Verification isn’t new to the tech world, but it just got a lot more accessible. Everyone can feel empowered in an increasingly complex environment with Tether.name

          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Link
              to="/challenge"
              className="bg-black hover:bg-gray-800 text-white px-12 py-4 rounded-lg font-semibold text-xl transition-colors"
            >
              Verify an Agent →
            </Link>
          </div>
          <p className="text-gray-500">
            Own an AI agent?{' '}
            <Link to="/auth" className="text-black hover:underline font-medium">
              Register it here
            </Link>
          </p>
          <p className="text-gray-500 mt-2">
            Developing an agent?{' '}
            <a href="https://docs.tether.name" className="text-black hover:underline font-medium">
              See our docs
            </a>
          </p>

          {stats && (stats.totalVerifications > 0 || stats.totalAgentsRegistered > 0) && (
            <div className="flex justify-center gap-12 mt-12">
              <div className="text-center">
                <p className="text-3xl font-bold text-black">{stats.totalVerifications.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Verifications</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-black">{stats.totalAgentsRegistered.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Agents Registered</p>
              </div>
            </div>
          )}
        </div>

        <div className="mb-32">
          <h2 className="text-4xl font-bold text-black mb-6 text-center">
            HOW IT WORKS:
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">No accounts. 30 seconds.</p>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-4">Click "Verify"</h3>
              <p className="text-gray-600 leading-relaxed">
                Tether.name generates a unique, one-time challenge code and lets you copy a message to send to the inquiring AI Agent.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-4">Send</h3>
              <p className="text-gray-600 leading-relaxed">
                Paste the message wherever you’re chatting with the agent. If it’s legit, it will know what to do.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-4">Done</h3>
              <p className="text-gray-600 leading-relaxed">
                The page will update in real time. You'll see the email that the agent is associated to. No links, no extra clicks.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-32">
          <h2 className="text-4xl font-bold text-black mb-6 text-center">
            HAVE AN AGENT:
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">One account. 2 minutes.</p>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-4">Create</h3>
              <p className="text-gray-600 leading-relaxed">
                Sign up using your email. No passwords, just codes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-4">Register</h3>
              <p className="text-gray-600 leading-relaxed">
                Name your agent and Tether.name generates secure credentials. Copy and paste it into your agent’s instructions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-4">Finish</h3>
              <p className="text-gray-600 leading-relaxed">
                That’s it. Every verification traces back to your email.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-32">
          <h2 className="text-4xl font-bold text-black mb-16 text-center">
            Why Tether.name?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border border-gray-200 p-8 rounded-lg">
              <h3 className="text-lg font-bold text-black mb-3">No fakes:</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Each verification gets a new challenge with zero repetition
              </p>
            </div>

            <div className="border border-gray-200 p-8 rounded-lg">
              <h3 className="text-lg font-bold text-black mb-3">No accounts:</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Anyone can verify an agent. Only those with an agent need an account
              </p>
            </div>

            <div className="border border-gray-200 p-8 rounded-lg">
              <h3 className="text-lg font-bold text-black mb-3">No waiting:</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                The page updates as soon as there's a response.
              </p>
            </div>

            <div className="border border-gray-200 p-8 rounded-lg">
              <h3 className="text-lg font-bold text-black mb-3">No Hiding:</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every agent links back to a real human's verified email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
