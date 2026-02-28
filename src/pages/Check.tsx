import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, ApiError } from '../api';
import { VerifiedResult } from '../components/VerifiedResult';
import { StarField } from '../components/StarField';

interface ChallengeResult {
  challenge: string;
  status: 'pending' | 'verified' | 'invalid' | 'not_found';
  createdAt?: number;
  agentName?: string;
  registeredSince?: number;
  verifiedAt?: number;
}

export function Check() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ChallengeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const challengeCode = searchParams.get('challenge') || '';

  useEffect(() => {
    if (challengeCode) {
      lookupChallenge(challengeCode);
    } else {
      setLoading(false);
    }
  }, [challengeCode]);

  const lookupChallenge = async (code: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await api.getChallengeStatus(code);
      setResult(data);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) {
          setResult({ challenge: code, status: 'not_found' });
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to look up challenge. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    const date = timestamp > 1e12 ? new Date(timestamp) : new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1f1f1f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#555] mx-auto mb-4"></div>
          <p className="text-gray-400">Looking up code...</p>
        </div>
      </div>
    );
  }

  // No challenge code provided
  if (!challengeCode) {
    return (
      <div className="min-h-screen bg-[#1f1f1f] relative overflow-hidden">
      <StarField />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Code verification</h1>
            <p className="text-gray-400 mb-8">
              To verify an agent, go to the{' '}
              <a href="/challenge" className="text-[#f4b049] underline font-medium">
                Verify an Agent
              </a>{' '}
              page to generate a code.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1f1f1f] relative overflow-hidden">
      <StarField />
      <div className="max-w-4xl mx-auto px-4 py-16">

        {error && (
          <div className="bg-red-900/30 border border-red-700 p-6 rounded-lg mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-700 mb-2">Error</h2>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {result && result.status === 'verified' && (
          <VerifiedResult
            challenge={result.challenge}
            agentName={result.agentName}
            registeredSince={result.registeredSince}
            createdAt={result.createdAt}
            verifiedAt={result.verifiedAt}
          />
        )}

        {result && result.status === 'pending' && (
          <div className="space-y-6">
            <div className="bg-yellow-900/30 border border-yellow-600 p-8 rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-900/300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-yellow-700 mb-2">Pending</h2>
                <p className="text-yellow-700">
                  Code <code className="font-mono font-semibold">{result.challenge}</code> has been issued but not yet signed by an agent.
                </p>
                <p className="text-yellow-600 text-sm mt-2">
                  Issued: {formatDateTime(result.createdAt)}
                </p>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/challenge"
                className="inline-block border border-[#f4b049] text-white px-6 py-3 rounded-lg hover:bg-[#444] transition-colors font-medium"
              >
                Verify another agent
              </a>
            </div>
          </div>
        )}

        {result && result.status === 'invalid' && (
          <div className="space-y-6">
            <div className="bg-red-900/30 border border-red-700 p-8 rounded-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-red-700 mb-2">Verification Failed</h2>
                <p className="text-red-700">
                  The agent's signature for this code was invalid. This agent could not prove its identity.
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-red-700">
                <h4 className="text-sm font-semibold text-red-700 mb-2">Code details</h4>
                <div className="grid md:grid-cols-3 gap-3 text-sm text-red-800">
                  <div>
                    <span className="font-medium">Code:</span>{' '}
                    <code className="font-mono">{result.challenge}</code>
                  </div>
                  <div>
                    <span className="font-medium">Issued:</span>{' '}
                    {formatDateTime(result.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Attempted:</span>{' '}
                    {formatDateTime(result.verifiedAt)}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-red-700 bg-red-900/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-3">What does this mean?</h3>
              <div className="text-red-800 space-y-3 text-sm">
                <p>
                  A failed verification means the agent could not cryptographically prove it controls the private key associated with its claimed identity. This could mean:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>The agent is not who it claims to be</li>
                  <li>The agent's credentials have been revoked or rotated</li>
                  <li>There was a technical error in the signing process</li>
                </ul>
              </div>
            </div>

            <div className="border border-[#555] p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">Recommended Next Steps</h3>
              <div className="text-gray-300 space-y-3 text-sm">
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    <strong>Do not trust this agent's claimed identity.</strong> Treat any claims it made about who it represents with skepticism.
                  </li>
                  <li>
                    <strong>Contact the human directly.</strong> If the agent claimed to represent a specific person, reach out to that person through a known, trusted channel to confirm.
                  </li>
                  <li>
                    <strong>Share these details.</strong> Give them this verification link and the context of how the agent contacted you so they can investigate.
                  </li>
                  <li>
                    <strong>Try again.</strong> If you believe this was a technical error, generate a new code and ask the agent to verify once more.
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/challenge"
                className="inline-block border border-[#f4b049] text-white px-6 py-3 rounded-lg hover:bg-[#444] transition-colors font-medium"
              >
                Verify another agent
              </a>
            </div>
          </div>
        )}

        {result && result.status === 'not_found' && (
          <div className="space-y-6">
            <div className="bg-[#333] border border-[#555] p-8 rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-300 mb-2">Not Found</h2>
                <p className="text-gray-400">
                  Code <code className="font-mono font-semibold">{challengeCode}</code> was not found. It may have expired or never existed.
                </p>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/challenge"
                className="inline-block border border-[#f4b049] text-white px-6 py-3 rounded-lg hover:bg-[#444] transition-colors font-medium"
              >
                Verify another agent
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
