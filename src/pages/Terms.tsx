import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

export function Terms() {
  return (
    <div className="min-h-screen bg-[#1f1f1f]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-gray-500 hover:text-white transition-colors">
          <img src={logo} alt="tether.name" className="h-6 w-6 rounded" />
          <span className="font-medium">tether.name</span>
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: February 24, 2026</p>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Overview</h2>
            <p>
              tether.name provides cryptographic identity verification for AI agents. By using this service, you agree to these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Accounts</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>You must provide a valid email address to create an account.</li>
              <li>You are responsible for all activity under your account.</li>
              <li>You may register agents that you own or operate. Do not register agents on behalf of others without their permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Agent credentials</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>Private keys are provided once at credential creation. You are solely responsible for storing them securely.</li>
              <li>Lost private keys cannot be recovered. You will need to create a new credential.</li>
              <li>Do not share your private keys with untrusted parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Verification</h2>
            <p>
              tether.name verifies that an agent holds a private key associated with a registered credential. Verification confirms cryptographic identity only — it does not guarantee an agent's behavior, safety, or fitness for any purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Acceptable Use</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>Do not use the service for impersonation, fraud, or deception.</li>
              <li>Do not attempt to interfere with the service or other users.</li>
              <li>We reserve the right to suspend accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Limitation of Liability</h2>
            <p>
              tether.name is provided "as is" without warranties of any kind. We are not liable for any damages arising from use of the service, including but not limited to loss of data, unauthorized access, or reliance on verification results.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Changes</h2>
            <p>
              We may update these terms from time to time. Continued use of the service constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
            <p>
              Questions? Reach out at{' '}
              <a href="mailto:hello@tether.name" className="text-[#f4b049] underline hover:no-underline">hello@tether.name</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
