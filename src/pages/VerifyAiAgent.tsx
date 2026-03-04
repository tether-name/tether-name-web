import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { StarField } from '../components/StarField';

export function VerifyAiAgent() {
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

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">How to Verify an AI Agent</h1>
        <p className="text-gray-300 text-lg leading-relaxed mb-10">
          If you need to verify an AI agent before trusting a message, this page is the quick checklist.
          Use a one-time challenge and a signed check link to confirm the agent is authentic and tied to
          a registered identity.
        </p>

        <section className="mb-10 border border-[#555] bg-[#333] rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Quick verification checklist</h2>
          <ol className="space-y-3 text-gray-300 list-decimal list-inside leading-relaxed">
            <li>Generate a one-time challenge code on tether.name.</li>
            <li>Send it directly to the AI agent you are talking to.</li>
            <li>Only trust the result if the returned check link shows verified identity and domain.</li>
          </ol>
        </section>

        <section className="mb-10 border border-[#555] bg-[#333] rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">What to look for on the result page</h2>
          <ul className="space-y-3 text-gray-300 list-disc list-inside leading-relaxed">
            <li>Verified status is successful.</li>
            <li>The agent name and verified domain match who you expect.</li>
            <li>The verification is recent and tied to the challenge you sent.</li>
          </ul>
        </section>

        <section className="mb-10 border border-[#555] bg-[#333] rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Related resources</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Need a deeper explanation of agentic verification?
            {' '}
            <Link to="/ai-agent-verification" className="text-[#f4b049] underline hover:no-underline">
              Read the AI agent verification guide
            </Link>
            .
          </p>
          <p className="text-gray-300 leading-relaxed mb-4">
            Want implementation details? Visit{' '}
            <a
              href="https://docs.tether.name"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f4b049] underline hover:no-underline"
            >
              docs.tether.name
            </a>
            .
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/challenge"
              className="bg-[#f4b049] hover:bg-[#e5a03a] text-[#333] px-5 py-3 rounded-md font-medium transition-colors"
            >
              Start Verification
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
