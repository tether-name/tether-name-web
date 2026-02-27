import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api';
import type { ApiKeyCreateResponse } from '../api';

const EXPIRATION_OPTIONS = [
  { label: 'Never', value: undefined },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
  { label: '180 days', value: 180 },
  { label: '1 year', value: 365 },
] as const;

export function NewApiKey() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [expiresInDays, setExpiresInDays] = useState<number | undefined>(undefined);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ApiKeyCreateResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      const data = await api.createApiKey(name, expiresInDays);
      setResult(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create API key');
      }
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // After creation — show the key
  if (result) {
    return (
      <div className="min-h-screen bg-[#333]">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="border border-[#555] p-8 rounded-lg">
            <h1 className="text-2xl font-bold text-white mb-2">API Key Created</h1>
            <p className="text-gray-400 mb-6">
              Your new API key <strong>{result.name}</strong> has been created.
            </p>

            {/* Warning banner */}
            <div className="bg-amber-900/30 border border-amber-600 text-amber-800 px-4 py-3 rounded-md mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <strong>This key will only be shown once.</strong>
              </div>
              <p className="mt-1 ml-7">Copy it now — you will not be able to see it again.</p>
            </div>

            {/* Key display */}
            <div className="relative mb-6">
              <div className="bg-[#2a2a2a] border border-[#555] rounded-md p-4 font-mono text-sm text-gray-800 break-all select-all">
                {result.key}
              </div>
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
                    Copy API Key
                  </>
                )}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full border border-[#555] hover:border-gray-500 text-gray-300 hover:text-white py-3 px-4 rounded-md font-medium transition-colors"
              >
                Done — Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form phase
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

        <h1 className="text-3xl font-bold text-white mb-2">Create API Key</h1>
        <p className="text-gray-400 mb-8">
          Generate a new API key for programmatic access.
        </p>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="border border-[#555] p-6 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Key Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#555] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#f4b049] focus:border-[#f4b049]"
                placeholder="e.g. Production API, CI/CD Pipeline"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Expiration
              </label>
              <select
                value={expiresInDays ?? ''}
                onChange={(e) => setExpiresInDays(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#555] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#f4b049] focus:border-[#f4b049]"
              >
                {EXPIRATION_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.value ?? ''}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full bg-[#f4b049] hover:bg-[#e5a03a] disabled:bg-gray-600 text-white py-3 px-4 rounded-md font-medium transition-colors"
            >
              {creating ? 'Creating...' : 'Create API Key'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
