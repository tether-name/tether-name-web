import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api';

function buildAgentInstructions(agentName: string, credentialId: string, registrationToken: string): string {
  return `You are "${agentName}", a verified agent on Tether.name (https://tether.name).

Your Credential ID: ${credentialId}

To activate your credential:
1. Generate an RSA-2048 key pair (PKCS8 format)
2. Store the private key securely in your environment
3. POST your base64-encoded public key (X.509/SPKI) to:
   https://api.tether.name/credentials/${credentialId}/register-key
   Body: {"registrationToken": "${registrationToken}", "publicKey": "<your-base64-public-key>"}

Once registered, when someone asks you to verify your identity:
1. They will give you a challenge code (a UUID string)
2. Sign the challenge using your private key (SHA256withRSA, base64url-encode the signature)
3. POST to https://api.tether.name/challenge/verify with:
   {"challenge": "<code>", "proof": "<signature>", "credentialId": "${credentialId}"}
4. Share the verifyUrl from the response

NEVER share your private key with anyone, including your owner/administrator.
For signing examples and full docs, see https://tether.name/AGENTS.md`;
}

function buildFallbackPrompt(agentName: string, credentialId: string, privateKey: string): string {
  return `You are "${agentName}", a verified agent on Tether.name (https://tether.name).

Your credentials (store securely — never share these directly):
- Credential ID: ${credentialId}
- Private Key (RSA PKCS8, base64): ${privateKey}

When someone asks you to verify your identity:
1. They will give you a challenge code (a UUID string)
2. Sign the challenge using your private key (SHA256withRSA, base64url-encode the signature)
3. POST to https://api.tether.name/challenge/verify with:
   {"challenge": "<code>", "proof": "<signature>", "credentialId": "${credentialId}"}
4. Share the verifyUrl from the response

For signing examples and full docs, see https://tether.name/AGENTS.md`;
}

type Phase = 'form' | 'setup';

export function NewAgent() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('form');
  const [error, setError] = useState('');
  const [agentName, setAgentName] = useState('');
  const [description, setDescription] = useState('');
  const [issuing, setIssuing] = useState(false);
  const [newAgent, setNewAgent] = useState<{ agentName: string; credentialId: string; registrationToken: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [fallbackGenerating, setFallbackGenerating] = useState(false);
  const [fallbackKey, setFallbackKey] = useState<{ privateKey: string } | null>(null);
  const [fallbackCopied, setFallbackCopied] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll for registration status
  useEffect(() => {
    if (!newAgent || registered) return;

    const poll = async () => {
      try {
        const status = await api.getCredentialStatus(newAgent.credentialId);
        if (status.registered) {
          setRegistered(true);
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        }
      } catch {
        // Silently retry
      }
    };

    pollRef.current = setInterval(poll, 3000);
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [newAgent, registered]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIssuing(true);
    setError('');

    try {
      const result = await api.issueCredential(agentName, description);
      setNewAgent({ agentName: result.agentName, credentialId: result.id, registrationToken: result.registrationToken });
      setRegistered(false);
      setShowFallback(false);
      setFallbackKey(null);
      setPhase('setup');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to register agent');
      }
    } finally {
      setIssuing(false);
    }
  };

  const handleCopy = useCallback(async () => {
    if (!newAgent) return;
    const text = buildAgentInstructions(newAgent.agentName, newAgent.credentialId, newAgent.registrationToken);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [newAgent]);

  const handleFallbackGenerate = async () => {
    if (!newAgent) return;
    setFallbackGenerating(true);
    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['sign', 'verify']
      );

      const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey);
      const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

      const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKeyBuffer)));
      const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKeyBuffer)));

      await api.registerKey(newAgent.credentialId, newAgent.registrationToken, publicKeyBase64);

      setFallbackKey({ privateKey: privateKeyBase64 });
      setRegistered(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to generate key pair');
      }
    } finally {
      setFallbackGenerating(false);
    }
  };

  const handleFallbackCopy = async () => {
    if (!newAgent || !fallbackKey) return;
    const text = buildFallbackPrompt(newAgent.agentName, newAgent.credentialId, fallbackKey.privateKey);
    await navigator.clipboard.writeText(text);
    setFallbackCopied(true);
    setTimeout(() => setFallbackCopied(false), 2000);
  };

  // Phase 1: Registration form
  if (phase === 'form') {
    return (
      <div className="min-h-screen bg-[#333]">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-8 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-white mb-2">Add New Agent</h1>
          <p className="text-gray-400 mb-8">
            Register a new agent to enable identity verification.
          </p>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="border border-[#555] p-6 rounded-lg">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Agent Name
                </label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#555] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#f4b049] focus:border-[#f4b049]"
                  placeholder="my-awesome-agent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#555] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#f4b049] focus:border-[#f4b049]"
                  placeholder="What does this agent do? (Only you will see this)"
                />
              </div>
              <button
                type="submit"
                disabled={issuing}
                className="w-full bg-[#f4b049] hover:bg-[#e5a03a] disabled:bg-gray-600 text-white py-3 px-4 rounded-md font-medium transition-colors"
              >
                {issuing ? 'Registering...' : 'Register Agent'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Phase 2: Setup instructions
  if (!newAgent) return null;
  const instructions = buildAgentInstructions(newAgent.agentName, newAgent.credentialId, newAgent.registrationToken);

  return (
    <div className="min-h-screen bg-[#333]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="border border-[#555] rounded-lg p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Agent Registered! 🎉</h1>
          <p className="text-gray-400 mb-6">
            Paste this message into your chat with your agent to set up verification.
          </p>

          {/* Agent instructions */}
          <div className="relative mb-4">
            <pre className="bg-[#2a2a2a] border border-[#555] rounded-md p-4 text-sm text-gray-800 whitespace-pre-wrap break-all max-h-64 overflow-y-auto font-mono">
              {instructions}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 bg-[#333] border border-[#555] rounded-md hover:bg-[#3d3d3d] transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              )}
            </button>
          </div>

          {/* Status indicator */}
          <div className={`mb-6 px-4 py-3 rounded-md text-sm flex items-center gap-2 ${registered ? 'bg-green-900/30 border border-green-700 text-green-800' : 'bg-[#2a2a2a] border border-[#555] text-gray-400'}`}>
            {registered ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Key registered! Your agent is ready to verify.</span>
              </>
            ) : (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                <span>Waiting for agent to register its public key...</span>
              </>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCopy}
              className="w-full bg-[#f4b049] hover:bg-[#e5a03a] text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy to Clipboard
                </>
              )}
            </button>
            {registered && (
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full border border-[#555] hover:border-gray-500 text-gray-300 hover:text-white py-3 px-4 rounded-md font-medium transition-colors"
              >
                Done — Back to Dashboard
              </button>
            )}
          </div>

          {/* Fallback section */}
          {!registered && (
            <div className="mt-6 border-t border-[#555] pt-6">
              <button
                onClick={() => setShowFallback(!showFallback)}
                className="text-sm text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${showFallback ? 'rotate-90' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Agent unable to generate a private key?
              </button>

              {showFallback && !fallbackKey && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-4">
                    We'll generate a key pair in your browser. You'll need to copy the private key and give it to your agent manually.
                  </p>
                  <button
                    onClick={handleFallbackGenerate}
                    disabled={fallbackGenerating}
                    className="w-full bg-[#3d3d3d] hover:bg-[#444] disabled:bg-[#2a2a2a] text-gray-800 py-2 px-4 rounded-md text-sm font-medium transition-colors"
                  >
                    {fallbackGenerating ? 'Generating...' : 'Generate Key Pair in Browser'}
                  </button>
                </div>
              )}

              {fallbackKey && (
                <div className="mt-4">
                  <div className="relative mb-4">
                    <pre className="bg-[#2a2a2a] border border-[#555] rounded-md p-4 text-sm text-gray-800 whitespace-pre-wrap break-all max-h-64 overflow-y-auto font-mono">
                      {buildFallbackPrompt(newAgent.agentName, newAgent.credentialId, fallbackKey.privateKey)}
                    </pre>
                    <button
                      onClick={handleFallbackCopy}
                      className="absolute top-3 right-3 p-2 bg-[#333] border border-[#555] rounded-md hover:bg-[#3d3d3d] transition-colors"
                      title="Copy to clipboard"
                    >
                      {fallbackCopied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="bg-red-900/30 border border-red-700 text-red-800 px-4 py-3 rounded-md text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <strong>SECURITY WARNING</strong>
                    </div>
                    <div className="mt-2">
                      • This private key will only be shown ONCE and cannot be recovered<br/>
                      • Copy and save it securely before closing this dialog<br/>
                      • Anyone with this key can impersonate your agent<br/>
                      • Never share this key directly with anyone
                    </div>
                  </div>

                  <button
                    onClick={handleFallbackCopy}
                    className="w-full bg-[#f4b049] hover:bg-[#e5a03a] text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {fallbackCopied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
