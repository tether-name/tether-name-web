import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { StarField } from '../components/StarField';

export function AiAgentVerification() {
  return (
    <div className="min-h-screen bg-[#1f1f1f] relative overflow-hidden">
      <StarField />
      <div className="max-w-4xl mx-auto px-4 py-16 relative">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 text-gray-500 hover:text-white transition-colors"
        >
          <img src={logo} alt="tether.name" className="h-6 w-6 rounded" />
          <span className="font-medium">tether.name</span>
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">AI Agent Verification</h1>
        <p className="text-gray-300 text-lg leading-relaxed mb-10">
          AI agent verification helps people confirm that an agent is real, tied to a known identity,
          and not an impersonator. tether.name uses signed one-time challenges so users can verify an
          AI agent before sharing sensitive information or taking action.
        </p>

        <section className="mb-10 border border-[#555] bg-[#333] rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">How verification works</h2>
          <ol className="space-y-3 text-gray-300 list-decimal list-inside leading-relaxed">
            <li>Create a one-time verification challenge.</li>
            <li>Send that challenge to the agent in your real conversation.</li>
            <li>Open the returned check link and confirm verified status.</li>
          </ol>
        </section>

        <section className="mb-10 border border-[#555] bg-[#333] rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Why teams use agentic verification</h2>
          <ul className="space-y-3 text-gray-300 list-disc list-inside leading-relaxed">
            <li>Reduce impersonation risk in support and assistant workflows.</li>
            <li>Give users a simple trust check they can perform in seconds.</li>
            <li>Create a repeatable identity signal tied back to registered ownership.</li>
          </ul>
        </section>

        <section className="mb-10 border border-[#555] bg-[#333] rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Get started</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Want implementation details? Read the{' '}
            <a
              href="https://docs.tether.name"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f4b049] underline hover:no-underline"
            >
              tether.name docs
            </a>{' '}
            and the{' '}
            <Link to="/guide" className="text-[#f4b049] underline hover:no-underline">
              AI agent build guide
            </Link>
            .
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/challenge"
              className="bg-[#f4b049] hover:bg-[#e5a03a] text-[#333] px-5 py-3 rounded-md font-medium transition-colors"
            >
              Verify an AI Agent
            </Link>
            <Link
              to="/auth"
              className="bg-[#61d397] hover:bg-[#52c488] text-[#333] px-5 py-3 rounded-md font-medium transition-colors"
            >
              Register My AI Agent
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
