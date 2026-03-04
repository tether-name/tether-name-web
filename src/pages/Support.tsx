import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { StarField } from '../components/StarField';

const issueTrackers = [
  {
    name: 'CLI',
    url: 'https://github.com/tether-name/tether-name-cli/issues',
  },
  {
    name: 'JavaScript SDK (Node)',
    url: 'https://github.com/tether-name/tether-name-node/issues',
  },
  {
    name: 'Python SDK',
    url: 'https://github.com/tether-name/tether-name-python/issues',
  },
  {
    name: 'Go SDK',
    url: 'https://github.com/tether-name/tether-name-go/issues',
  },
  {
    name: 'MCP Server',
    url: 'https://github.com/tether-name/tether-name-mcp-server/issues',
  },
];

export function Support() {
  return (
    <div className="min-h-screen bg-[#1f1f1f] relative overflow-hidden">
      <StarField />
      <div className="max-w-3xl mx-auto px-4 py-16 relative">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 text-gray-500 hover:text-white transition-colors"
        >
          <img src={logo} alt="tether.name" className="h-6 w-6 rounded" />
          <span className="font-medium">tether.name</span>
        </Link>

        <h1 className="text-4xl font-bold text-white mb-4">Support</h1>
        <p className="text-gray-300 leading-relaxed mb-8">
          tether.name is an open source project, and we handle support in the open whenever possible.
          If you run into an SDK or CLI issue, please open an issue in the matching repository so we can
          track, discuss, and fix it transparently.
        </p>

        <div className="border border-[#555] bg-[#333] rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">SDK &amp; CLI issue trackers</h2>
          <ul className="space-y-3 text-gray-300">
            {issueTrackers.map((tracker) => (
              <li key={tracker.name}>
                <a
                  href={tracker.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f4b049] underline hover:no-underline"
                >
                  {tracker.name} issues
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-[#555] bg-[#333] rounded-2xl p-6 space-y-4 text-gray-300 leading-relaxed">
          <p>
            Looking for setup guides and API docs? Visit{' '}
            <a
              href="https://docs.tether.name"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f4b049] underline hover:no-underline"
            >
              docs.tether.name
            </a>{' '}
            and our{' '}
            <Link to="/ai-agent-verification" className="text-[#f4b049] underline hover:no-underline">
              AI agent verification guide
            </Link>{' '}
            plus the{' '}
            <Link to="/verify-ai-agent" className="text-[#f4b049] underline hover:no-underline">
              verify AI agent checklist
            </Link>
            .
          </p>
          <p>
            Need direct help or have account/service questions? Email us at{' '}
            <a href="mailto:support@tether.name" className="text-[#f4b049] underline hover:no-underline">
              support@tether.name
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
