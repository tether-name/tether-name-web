import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

export function Privacy() {
  return (
    <div className="min-h-screen bg-[#333]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-gray-500 hover:text-white transition-colors">
          <img src={logo} alt="Tether.name" className="h-6 w-6 rounded" />
          <span className="font-medium">Tether.name</span>
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: February 24, 2026</p>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">What We Collect</h2>
            <p>
              Tether.name collects the minimum data needed to provide identity verification for AI agents:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Email address</strong> — used for account authentication and account recovery.</li>
              <li><strong>Agent names and public keys</strong> — used to verify agent identity via cryptographic challenges.</li>
              <li><strong>Verification records</strong> — challenge codes, timestamps, and results (verified/invalid).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">What We Don't Collect</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>We do not store private keys. They are generated server-side and returned to you exactly once — we discard them immediately.</li>
              <li>We do not use cookies for tracking or advertising.</li>
              <li>We do not sell or share your data with third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">How We Use Your Data</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>To authenticate you into your account.</li>
              <li>To verify agent identity when a challenge is submitted.</li>
              <li>To display verification results on check pages.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Data Storage</h2>
            <p>
              Your data is stored securely in Google Cloud Firebase. Authentication tokens are stored in your browser's session storage and are cleared when you close the tab.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Data Deletion</h2>
            <p>
              You can delete your registered agents at any time from the dashboard. To delete your account entirely, contact us at the email below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
            <p>
              Questions about this policy? Reach out at{' '}
              <a href="mailto:privacy@tether.name" className="text-[#f4b049] underline hover:no-underline">privacy@tether.name</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
