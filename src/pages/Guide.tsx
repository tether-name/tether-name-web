import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { StarField } from '../components/StarField';

export function Guide() {
  return (
    <div className="min-h-screen bg-[#1f1f1f] relative overflow-hidden">
      <StarField />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-gray-500 hover:text-white transition-colors">
          <img src={logo} alt="tether.name" className="h-6 w-6 rounded" />
          <span className="font-medium">tether.name</span>
        </Link>

        <h1 className="text-4xl font-bold text-white mb-4">Quick-Start Guide</h1>
        <p className="text-gray-400 mb-12">
          Set up identity verification for your AI agent in three steps — no coding required.
        </p>

        <div className="space-y-10">
          {/* Step 1 */}
          <section className="border border-[#555] bg-[#333] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#61d397] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-[#1f1f1f]" style={{ fontFamily: "'Dosis', sans-serif" }}>1</span>
              </div>
              <h2 className="text-xl font-semibold text-white">Sign up and create a credential</h2>
            </div>
            <div className="text-gray-300 leading-relaxed space-y-2 ml-[52px]">
              <p>
                Head to{' '}
                <Link to="/auth" className="text-[#f4b049] hover:underline">My Agents</Link>{' '}
                and sign in with your email. Once you're in the dashboard, click{' '}
                <span className="font-semibold text-white">Register New Agent</span>.
              </p>
              <p>
                Give your agent a name (e.g. "Hotel Sol Agent") and you'll receive a{' '}
                <span className="font-semibold text-white">setup message</span>{' '}
                containing your agent's private key and API endpoint.
              </p>
            </div>
          </section>

          {/* Step 2 */}
          <section className="border border-[#555] bg-[#333] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#61d397] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-[#1f1f1f]" style={{ fontFamily: "'Dosis', sans-serif" }}>2</span>
              </div>
              <h2 className="text-xl font-semibold text-white">Give your agent the setup message</h2>
            </div>
            <div className="text-gray-300 leading-relaxed space-y-2 ml-[52px]">
              <p>
                Copy the setup message and paste it into your agent's system instructions or configuration.
                This tells the agent how to respond when someone asks it to verify its identity on{' '}
                <span className="text-[#f4b049]">tether</span><span className="text-[#61d396]">.name</span>.
              </p>
              <p className="text-gray-500 text-sm">
                The setup message includes everything the agent needs — no additional integration work required.
              </p>
            </div>
          </section>

          {/* Step 3 */}
          <section className="border border-[#555] bg-[#333] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#61d397] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-[#1f1f1f]" style={{ fontFamily: "'Dosis', sans-serif" }}>3</span>
              </div>
              <h2 className="text-xl font-semibold text-white">Users verify your agent with a challenge code</h2>
            </div>
            <div className="text-gray-300 leading-relaxed space-y-2 ml-[52px]">
              <p>
                When someone wants to verify your agent, they visit{' '}
                <Link to="/challenge" className="text-[#f4b049] hover:underline">tether.name/challenge</Link>{' '}
                and get a one-time verification code. They paste that code to your agent in chat,
                and the agent signs it automatically.
              </p>
              <p>
                The verification page updates to show who the agent is registered to — confirming its identity.
              </p>
            </div>
          </section>
        </div>

        {/* Footer links */}
        <div className="mt-12 text-center space-y-3">
          <p className="text-gray-500">
            Ready to get started?{' '}
            <Link to="/auth" className="text-[#f4b049] hover:underline font-medium">
              Register your agent
            </Link>
          </p>
          <p className="text-gray-500">
            Building a custom integration?{' '}
            <a href="https://docs.tether.name" className="text-[#f4b049] hover:underline font-medium">
              See the developer docs
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
