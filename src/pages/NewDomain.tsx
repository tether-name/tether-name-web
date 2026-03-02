import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api';
import type { ClaimDomainResponse } from '../api';
import { StarField } from '../components/StarField';
import { useSnackbar } from '../components/Snackbar';

type Step = 'input' | 'dns' | 'verifying' | 'verified';

export function NewDomain() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [step, setStep] = useState<Step>('input');
  const [domain, setDomain] = useState('');
  const [claimData, setClaimData] = useState<ClaimDomainResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    setError('');
    const cleaned = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!cleaned) {
      setError('Please enter a domain');
      return;
    }
    setLoading(true);
    try {
      const result = await api.claimDomain(cleaned);
      setClaimData(result);
      setDomain(cleaned);
      setStep('dns');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to claim domain');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!claimData) return;
    setError('');
    setStep('verifying');
    try {
      const result = await api.verifyDomain(claimData.id);
      if (result.verified) {
        setStep('verified');
      } else {
        setStep('dns');
        setError('DNS record not found yet. It may take a few minutes to propagate. Try again shortly.');
      }
    } catch (err) {
      setStep('dns');
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Verification failed');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1f1f1f] relative overflow-hidden">
      <StarField />
      <div className="max-w-2xl mx-auto px-4 py-16 relative">

        {/* Step: Input */}
        {step === 'input' && (
          <>
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-[#f4b049]">Verify</span>{' '}
              <span className="text-[#61d397]">Your Domain</span>
            </h1>
            <p className="text-gray-400 mb-8">
              Prove you own a domain to show it on verification results instead of your email address.
              Perfect for organizations and businesses.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Domain</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleClaim()}
                  placeholder="example.com"
                  className="w-full bg-[#2a2a2a] border border-[#555] rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#f4b049]"
                />
                <p className="text-gray-500 text-sm mt-1">Just the domain — no https:// or paths</p>
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleClaim}
                disabled={loading || !domain.trim()}
                className="w-full bg-[#f4b049] hover:bg-[#e5a03a] text-[#333] py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Claiming...' : 'Claim Domain'}
              </button>
            </div>
          </>
        )}

        {/* Step: DNS Instructions */}
        {step === 'dns' && claimData && (
          <>
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-[#f4b049]">Add</span>{' '}
              <span className="text-[#61d397]">DNS Record</span>
            </h1>
            <p className="text-gray-400 mb-8">
              Add this TXT record to your domain's DNS settings to prove ownership.
            </p>

            <div className="bg-[#2a2a2a] border border-[#555] rounded-lg p-6 mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Record Type</label>
                <p className="text-white font-mono">TXT</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Host / Name</label>
                <div className="flex items-center gap-2">
                  <code className="text-[#61d397] font-mono text-lg">{claimData.txtHost}</code>
                  <button
                    onClick={() => { navigator.clipboard.writeText(claimData.txtHost); showSnackbar('Host copied to clipboard', 'success'); }}
                    className="text-gray-500 hover:text-white transition-colors text-sm"
                    title="Copy"
                  >
                    <span className="material-icons text-base">content_copy</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Value</label>
                <div className="flex items-center gap-2">
                  <code className="text-[#f4b049] font-mono break-all">{claimData.txtRecord}</code>
                  <button
                    onClick={() => { navigator.clipboard.writeText(claimData.txtRecord); showSnackbar('TXT record copied to clipboard', 'success'); }}
                    className="text-gray-500 hover:text-white transition-colors text-sm flex-shrink-0"
                    title="Copy"
                  >
                    <span className="material-icons text-base">content_copy</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#2a2a2a] border border-[#444] rounded-lg p-4 mb-6">
              <p className="text-gray-400 text-sm">
                <strong className="text-gray-300">Tip:</strong> DNS changes can take anywhere from a few seconds to 48 hours to propagate,
                though most providers update within 5 minutes. You can come back and verify later from your dashboard.
              </p>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded text-sm mb-4">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleVerify}
                className="flex-1 bg-[#61d397] hover:bg-[#52c488] text-[#333] py-3 px-4 rounded-md font-medium transition-colors"
              >
                Verify Now
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 border border-[#555] hover:border-gray-500 text-gray-300 hover:text-white py-3 px-4 rounded-md font-medium transition-colors"
              >
                I'll Verify Later
              </button>
            </div>
          </>
        )}

        {/* Step: Verifying */}
        {step === 'verifying' && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#61d397] mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Checking DNS...</h2>
            <p className="text-gray-400">Looking up TXT records for {domain}</p>
          </div>
        )}

        {/* Step: Verified */}
        {step === 'verified' && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-[#61d397]">{domain}</span>{' '}
              <span className="text-white">Verified!</span>
            </h2>
            <p className="text-gray-400 mb-8">
              Your agents will now show <strong className="text-[#61d397]">{domain}</strong> on verification results
              instead of your email address.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#f4b049] hover:bg-[#e5a03a] text-[#333] py-3 px-8 rounded-md font-medium transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
