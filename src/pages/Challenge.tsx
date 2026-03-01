import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api';
import { VerifiedResult } from '../components/VerifiedResult';
import { StarField } from '../components/StarField';

type Status = 'idle' | 'generating' | 'waiting' | 'verified' | 'invalid' | 'expired';

interface VerifiedResult {
  agentName?: string;
  registeredSince?: number;
  createdAt?: number;
  verifiedAt?: number;
}

export function Challenge() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('idle');
  const [challenge, setChallenge] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<VerifiedResult | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(60);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  const startPolling = useCallback((code: string, intervalMs: number, maxAtt: number) => {
    setMaxAttempts(maxAtt);
    let attempts = 0;

    pollRef.current = setInterval(async () => {
      attempts++;
      setPollCount(attempts);

      if (attempts >= maxAtt) {
        stopPolling();
        setStatus('expired');
        return;
      }

      try {
        const data = await api.getChallengeStatus(code);

        if (data.status === 'verified') {
          stopPolling();
          navigate(`/check?challenge=${code}`);
          return;
        } else if (data.status === 'invalid') {
          stopPolling();
          setResult({
            agentName: data.agentName,
            createdAt: data.createdAt,
            verifiedAt: data.verifiedAt,
          });
          setStatus('invalid');
        }
      } catch {
        // Silently retry on network errors
      }
    }, intervalMs);
  }, [stopPolling]);

  const generateChallenge = async () => {
    setStatus('generating');
    setError(null);
    setResult(null);
    setPollCount(0);
    stopPolling();

    try {
      const response = await api.generateChallenge();
      setChallenge(response.code);
      setStatus('waiting');

      // Fetch initial status to get poll config
      try {
        const statusData = await api.getChallengeStatus(response.code);
        const interval = statusData.poll?.intervalMs ?? 3000;
        const max = statusData.poll?.maxAttempts ?? 60;
        startPolling(response.code, interval, max);
      } catch {
        // Fallback to defaults
        startPolling(response.code, 3000, 60);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to generate challenge. Please try again.');
      }
      setStatus('idle');
    }
  };

  const agentMessage = challenge
    ? `Please verify your identity on tether.name. Sign this challenge and return the verification link.\n\nChallenge code: ${challenge}\nVerify endpoint: POST https://api.tether.name/challenge/verify\nDocs: https://tether.name/AGENTS.md`
    : '';

  const copyToClipboard = () => {
    if (agentMessage) {
      navigator.clipboard.writeText(agentMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetFlow = () => {
    stopPolling();
    setChallenge(null);
    setStatus('idle');
    setError(null);
    setResult(null);
    setPollCount(0);
  };

  const formatDateTime = (ts?: number) => {
    if (!ts) return 'N/A';
    const date = ts > 1e12 ? new Date(ts) : new Date(ts * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#1f1f1f] relative overflow-hidden">
      <StarField />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Verify an AI Agent</h1>

        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Step 1: Generate */}
        {status === 'idle' && (
          <div className="space-y-10">
            <div className="text-center relative">
              <button
                onClick={generateChallenge}
                className="bg-[#f4b049] hover:bg-[#e5a03a] text-[#333] px-10 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Verify
              </button>
            </div>

            <div className="relative grid md:grid-cols-4 gap-8 md:gap-10">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#f4b049] rounded-full mx-auto mb-5 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#1f1f1f]" style={{ fontFamily: "'Dosis', sans-serif" }}>1</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Generate</h3>
                <p className="text-gray-400 leading-relaxed text-base">
                  Click Verify to create a one-time use code.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#f4b049] rounded-full mx-auto mb-5 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#1f1f1f]" style={{ fontFamily: "'Dosis', sans-serif" }}>2</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Send</h3>
                <p className="text-gray-400 leading-relaxed text-base">
                  Copy the message into your chat with the AI agent you're verifying.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#f4b049] rounded-full mx-auto mb-5 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#1f1f1f]" style={{ fontFamily: "'Dosis', sans-serif" }}>3</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Wait</h3>
                <p className="text-gray-400 leading-relaxed text-base">
                  If they're registered with <span className="text-[#f4b049]">tether</span><span className="text-[#61d396]">.name</span>, the AI agent will sign the code.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#f4b049] rounded-full mx-auto mb-5 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#1f1f1f]" style={{ fontFamily: "'Dosis', sans-serif" }}>4</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Done</h3>
                <p className="text-gray-400 leading-relaxed text-base">
                  You will see who the AI agent is, who registered it and when, or if they aren't verifiable.
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'generating' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#555] mx-auto mb-4"></div>
            <p className="text-gray-400">Generating challenge...</p>
          </div>
        )}

        {/* Step 2: Waiting for agent */}
        {status === 'waiting' && (
          <div className="space-y-6">
            <div className="border border-[#555] p-6 rounded-lg">
              <p className="text-gray-400 text-sm mb-3">Copy this message and send it to the agent:</p>
              <pre className="text-sm font-mono text-white whitespace-pre-wrap bg-[#333] border border-[#555] rounded-md p-4">
                {agentMessage}
              </pre>
              <div className="mt-4">
                <button
                  onClick={copyToClipboard}
                  className="w-full bg-[#f4b049] hover:bg-[#e5a03a] text-[#333] py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {copied ? 'Copied!' : 'Copy Message'}
                </button>
              </div>
            </div>

            <div className="border border-[#555] p-6 rounded-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="animate-pulse flex items-center gap-3">
                  <div className="h-3 w-3 bg-[#f4b049] rounded-full animate-bounce"></div>
                  <span className="text-lg font-medium text-gray-300">Waiting for agent to respond...</span>
                </div>
              </div>
              <div className="w-full bg-[#444] rounded-full h-1.5">
                <div
                  className="bg-[#61d397] h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((pollCount / maxAttempts) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">
                This page updates automatically • {Math.max(0, Math.ceil((maxAttempts - pollCount) * 3 / 60))} min remaining
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={resetFlow}
                className="text-gray-400 hover:text-white text-sm underline transition-colors"
              >
                Cancel and start over
              </button>
            </div>
          </div>
        )}

        {/* Step 3a: Verified */}
        {status === 'verified' && result && (
          <VerifiedResult
            challenge={challenge || ''}
            agentName={result.agentName}
            registeredSince={result.registeredSince}
            createdAt={result.createdAt}
            verifiedAt={result.verifiedAt}
            onVerifyAnother={resetFlow}
          />
        )}

        {/* Step 3b: Invalid */}
        {status === 'invalid' && (
          <div className="space-y-6">
            <div className="bg-red-900/30 border border-red-700 p-8 rounded-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-red-700 mb-2">Verification Failed</h2>
                <p className="text-red-700">This agent could not prove its identity.</p>
              </div>

              <div className="mt-4 pt-4 border-t border-red-700">
                <h4 className="text-sm font-semibold text-red-700 mb-2">Code details</h4>
                <div className="grid md:grid-cols-3 gap-3 text-sm text-red-800">
                  <div>
                    <span className="font-medium">Code:</span>{' '}
                    <code className="font-mono text-xs">{challenge}</code>
                  </div>
                  <div>
                    <span className="font-medium">Issued:</span> {formatDateTime(result?.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Attempted:</span> {formatDateTime(result?.verifiedAt)}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#555] p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">What should you do?</h3>
              <ul className="text-gray-300 space-y-2 text-sm list-disc list-inside ml-2">
                <li><strong>Don't trust this agent's claimed identity.</strong> They failed to prove who they are.</li>
                <li><strong>Contact the human directly</strong> if the agent claimed to represent a specific person.</li>
                <li><strong>Try again</strong> — it could be a technical error. Generate a new challenge.</li>
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={resetFlow}
                className="border border-[#555] hover:border-gray-500 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Expired */}
        {status === 'expired' && (
          <div className="space-y-6">
            <div className="bg-[#333] border border-[#555] p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-300 mb-2">Timed Out</h2>
              <p className="text-gray-400">
                The agent didn't respond in time. The challenge has expired.
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={resetFlow}
                className="bg-[#f4b049] hover:bg-[#e5a03a] text-[#333] px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Generate New Challenge
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
