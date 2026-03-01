import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { StarField } from '../components/StarField';

interface ClawVariant {
  emoji: string;
  name: string;
  blurb: string;
  url: string;
}

interface SDK {
  name: string;
  blurb: string;
  url: string;
}

const bigFour: ClawVariant[] = [
  {
    emoji: '🦞',
    name: 'OpenClaw',
    blurb:
      'The OG. The most feature-complete runtime with the best plugin library (ClawHub), though it\'s a resource hog (~1.5 GB RAM). Security is mostly application-level permission checks.',
    url: 'https://github.com/openclaw/openclaw',
  },
  {
    emoji: '⚡',
    name: 'ZeroClaw',
    blurb:
      'The production-grade choice. Written in Rust, it uses 99% less memory than OpenClaw and boots in under 10 ms. A custom sandbox keeps things stable instead of hoping the LLM follows instructions.',
    url: 'https://github.com/zeroclaw/zeroclaw',
  },
  {
    emoji: '🔬',
    name: 'NullClaw',
    blurb:
      'For the minimalists. Written in Zig, it\'s the fastest and smallest (678 KB binary). A zero-overhead runtime for people who want to audit every line of code themselves.',
    url: 'https://github.com/nullclaw/nullclaw',
  },
  {
    emoji: '📡',
    name: 'PicoClaw',
    blurb:
      'The IoT king. A Go-based implementation designed for $10 edge boards like the Raspberry Pi Zero. Great for background tasks on hardware that can\'t run Node.js.',
    url: 'https://github.com/picoclaw/picoclaw',
  },
];

const specialized: ClawVariant[] = [
  {
    emoji: '🐳',
    name: 'NanoClaw',
    blurb:
      'Focuses on container isolation — runs agents inside Docker or Apple Containers instead of giving them broad system access. Also the go-to for Agent Swarms where you want multiple agents working together.',
    url: 'https://github.com/nanoclaw/nanoclaw',
  },
  {
    emoji: '🛡️',
    name: 'IronClaw',
    blurb:
      'Developed by the Near AI team. Uses WebAssembly (Wasm) sandboxing to protect sensitive data like keys. Some find it a bit "over-secured" — you have to manually permit even basic commands.',
    url: 'https://github.com/ironclaw/ironclaw',
  },
  {
    emoji: '🧪',
    name: 'TinyClaw',
    blurb:
      'A research-focused fork that stripped OpenClaw down to about 4k lines of Python for easier auditing. Perfect for understanding how agent runtimes work under the hood.',
    url: 'https://github.com/tinyclaw/tinyclaw',
  },
];

const sdks: SDK[] = [
  {
    name: 'OpenAI Agents SDK',
    blurb:
      'OpenAI\'s official framework for building multi-agent workflows with handoffs, guardrails, and tracing built in.',
    url: 'https://github.com/openai/openai-agents-python',
  },
  {
    name: 'LangChain',
    blurb:
      'The most popular LLM application framework. Build chains and agents with tool use, memory, and retrieval across dozens of model providers.',
    url: 'https://github.com/langchain-ai/langchain',
  },
  {
    name: 'CrewAI',
    blurb:
      'Framework for orchestrating role-playing autonomous AI agents. Define crews of specialized agents that collaborate to accomplish complex tasks.',
    url: 'https://github.com/crewAIInc/crewAI',
  },
  {
    name: 'AutoGen',
    blurb:
      'Microsoft\'s framework for building multi-agent conversations. Agents can chat with each other, use tools, and involve humans in the loop.',
    url: 'https://github.com/microsoft/autogen',
  },
  {
    name: 'Semantic Kernel',
    blurb:
      'Microsoft\'s SDK for integrating LLMs into apps with plugins, planners, and memory. Available in Python, C#, and Java.',
    url: 'https://github.com/microsoft/semantic-kernel',
  },
  {
    name: 'Vercel AI SDK',
    blurb:
      'TypeScript toolkit for building AI-powered products. Streaming-first, with React hooks and support for most model providers.',
    url: 'https://github.com/vercel/ai',
  },
];

function VariantCard({ variant }: { variant: ClawVariant }) {
  return (
    <a
      href={variant.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-[#555] bg-[#333] rounded-2xl p-5 hover:border-[#f4b049] transition-colors group"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{variant.emoji}</span>
        <h3 className="text-lg font-semibold text-white group-hover:text-[#f4b049] transition-colors">
          {variant.name}
        </h3>
      </div>
      <p className="text-gray-400 leading-relaxed text-sm ml-[44px]">{variant.blurb}</p>
    </a>
  );
}

function SDKCard({ sdk }: { sdk: SDK }) {
  return (
    <a
      href={sdk.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-[#555] bg-[#333] rounded-2xl p-5 hover:border-[#61d397] transition-colors group"
    >
      <h3 className="text-lg font-semibold text-white group-hover:text-[#61d397] transition-colors mb-2">
        {sdk.name}
      </h3>
      <p className="text-gray-400 leading-relaxed text-sm">{sdk.blurb}</p>
    </a>
  );
}

export function Guide() {
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

        <h1 className="text-4xl font-bold text-white mb-4">Build Your Own AI Agent</h1>
        <p className="text-gray-400 mb-12 text-lg">
          Ready to create an AI agent? Here are the runtimes and frameworks that make it
          possible — from full-featured platforms to lightweight IoT runners, plus the SDKs to
          wire it all together.
        </p>

        {/* Big Four */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">
            🦞 The "Big Four" Runtimes
          </h2>
          <p className="text-gray-500 mb-6">
            Agent runtimes give your AI a home — a persistent environment where it can use
            tools, access files, and act on your behalf.
          </p>
          <div className="space-y-4">
            {bigFour.map((v) => (
              <VariantCard key={v.name} variant={v} />
            ))}
          </div>
        </section>

        {/* Specialized Variants */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">
            🛡️ Specialized Variants
          </h2>
          <p className="text-gray-500 mb-6">
            Forks and alternatives that trade generality for stronger guarantees in specific
            areas.
          </p>
          <div className="space-y-4">
            {specialized.map((v) => (
              <VariantCard key={v.name} variant={v} />
            ))}
          </div>
        </section>

        {/* Agentic SDKs */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">
            🧰 Agentic SDKs &amp; Frameworks
          </h2>
          <p className="text-gray-500 mb-6">
            Not using a runtime? These SDKs let you build agents from scratch with tool use,
            multi-agent orchestration, and memory.
          </p>
          <div className="space-y-4">
            {sdks.map((s) => (
              <SDKCard key={s.name} sdk={s} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center space-y-3 border-t border-[#444] pt-10">
          <p className="text-gray-400 text-lg">
            Once your agent is running, register it on{' '}
            <span className="text-[#f4b049]">tether</span>
            <span className="text-[#61d397]">.name</span>{' '}
            so people can verify who it belongs to.
          </p>
          <div className="flex gap-4 justify-center mt-6">
            <Link
              to="/auth"
              className="bg-[#f4b049] hover:bg-[#e5a03a] text-[#333] px-6 py-3 rounded-md font-medium transition-colors text-lg"
            >
              Register Your Agent
            </Link>
            <Link
              to="/challenge"
              className="bg-[#61d397] hover:bg-[#52c488] text-[#333] px-6 py-3 rounded-md font-medium transition-colors text-lg"
            >
              Verify an Agent
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
