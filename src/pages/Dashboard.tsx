import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { api, ApiError } from '../api';
import type { Agent, ApiKeyListItem, Domain } from '../api';
import { StarField } from '../components/StarField';
import { useSnackbar } from '../components/Snackbar';
import robotThreeSvg from '../assets/robot-three.svg';

function formatDate(timestamp: number): string {
  if (!timestamp) return 'Unknown';
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function timeAgo(timestamp: number): string {
  if (!timestamp) return 'Never verified';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(timestamp);
}

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyListItem[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [deletingDomain, setDeletingDomain] = useState<string | null>(null);
  const [verifyingDomain, setVerifyingDomain] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [agentsData, keysData, domainsData] = await Promise.all([
        api.getAgents(),
        api.getApiKeys(),
        api.getDomains(),
      ]);
      setAgents(agentsData);
      setApiKeys(keysData);
      setDomains(domainsData);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (agent: Agent) => {
    if (!confirm(`Delete agent "${agent.agentName}"? This cannot be undone.`)) return;
    setDeleting(agent.id);
    try {
      await api.deleteAgent(agent.id);
      setAgents((prev) => prev.filter((a) => a.id !== agent.id));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete agent');
      }
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteDomain = async (domain: Domain) => {
    if (!confirm(`Remove domain "${domain.domain}"? This cannot be undone.`)) return;
    setDeletingDomain(domain.id);
    try {
      await api.deleteDomain(domain.id);
      setDomains((prev) => prev.filter((d) => d.id !== domain.id));
      showSnackbar(`Domain "${domain.domain}" removed`, 'success');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to remove domain';
      showSnackbar(message, 'error');
    } finally {
      setDeletingDomain(null);
    }
  };

  const handleVerifyDomain = async (domain: Domain) => {
    setVerifyingDomain(domain.id);
    try {
      const result = await api.verifyDomain(domain.id);
      if (result.verified) {
        setDomains((prev) => prev.map((d) =>
          d.id === domain.id ? { ...d, verified: true, verifiedAt: Date.now(), lastCheckedAt: Date.now() } : d
        ));
        showSnackbar(`${domain.domain} verified!`, 'success');
      } else {
        setDomains((prev) => prev.map((d) =>
          d.id === domain.id ? { ...d, lastCheckedAt: Date.now() } : d
        ));
        showSnackbar(`DNS record not found for ${domain.domain}. It may take a few minutes to propagate.`, 'error');
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Verification check failed';
      showSnackbar(message, 'error');
    } finally {
      setVerifyingDomain(null);
    }
  };

  const handleRevoke = async (key: ApiKeyListItem) => {
    if (!confirm(`Revoke API key "${key.name}"? This cannot be undone.`)) return;
    setRevoking(key.id);
    try {
      await api.revokeApiKey(key.id);
      setApiKeys((prev) => prev.map((k) => k.id === key.id ? { ...k, revoked: true } : k));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to revoke API key');
      }
    } finally {
      setRevoking(null);
    }
  };

  function formatKeyPrefix(prefix: string): string {
    return `${prefix.slice(0, 9)}...${prefix.slice(-4)}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1f1f1f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#555]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1f1f1f] relative overflow-hidden">
      <StarField />
      <div className="max-w-4xl mx-auto px-4 py-16 relative">
        <div className="mb-8 flex items-center gap-4">
          <img src={robotThreeSvg} alt="" className="w-20 h-20" />
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-[#f4b049]">AI Agent</span>{' '}
              <span className="text-[#61d397]">Dashboard</span>
            </h1>
            <p className="text-gray-400">
              {user?.email}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Agent list */}
        {agents.length > 0 ? (
          <div className="mb-8 space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="relative bg-[#1f1f1f] border border-[#555] p-5 rounded-lg flex items-start justify-between">
                {deleting === agent.id && (
                  <div className="absolute inset-0 bg-[#1f1f1f]/70 rounded-lg flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#555]"></div>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-white">{agent.agentName}</h3>
                  {agent.description && (
                    <p className="text-gray-500 mt-1">{agent.description}</p>
                  )}
                  {agent.domain && (
                    <div className="mt-2">
                      <span className="text-xs bg-green-900/40 text-[#61d397] px-2 py-0.5 rounded-full border border-green-800 font-medium">
                        Domain: {agent.domain}
                      </span>
                    </div>
                  )}
                  <div className="mt-3 flex gap-6 text-sm text-gray-500">
                    <span>Registered: {formatDate(agent.createdAt)}</span>
                    <span>Last verified: {timeAgo(agent.lastVerifiedAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(agent)}
                  disabled={deleting === agent.id}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  title="Delete agent"
                >
                  <span className="material-icons text-xl">delete</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-8 flex gap-4">
            <button
              onClick={() => navigate('/dashboard/new')}
              className="flex-1 bg-[#f4b049] hover:bg-[#e5a03a] text-[#333] py-3 px-4 rounded-md font-medium transition-colors text-lg"
            >
              Add an AI Agent
            </button>
            <button
              onClick={() => navigate('/challenge')}
              className="flex-1 bg-[#61d397] hover:bg-[#52c488] text-[#333] py-3 px-4 rounded-md font-medium transition-colors text-lg"
            >
              Verify an AI Agent
            </button>
          </div>
        )}

        {/* CTAs */}
        {agents.length > 0 && (
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => navigate('/dashboard/new')}
              className="flex-1 bg-[#f4b049] hover:bg-[#e5a03a] text-[#333] py-3 px-4 rounded-md font-medium transition-colors text-lg"
            >
              Add an AI Agent
            </button>
            <button
              onClick={() => navigate('/challenge')}
              className="flex-1 bg-[#61d397] hover:bg-[#52c488] text-[#333] py-3 px-4 rounded-md font-medium transition-colors text-lg"
            >
              Verify an AI Agent
            </button>
          </div>
        )}

        {/* Domains section */}
        <div className="mb-8 mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Domains</h2>
            <button
              onClick={() => navigate('/dashboard/domains/new')}
              className="border border-[#555] hover:border-gray-500 text-gray-300 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Verify a Domain
            </button>
          </div>

          {domains.length > 0 ? (
            <div className="space-y-4">
              {domains.map((domain) => (
                <div
                  key={domain.id}
                  className="relative bg-[#1f1f1f] border border-[#555] p-5 rounded-lg flex items-start justify-between"
                >
                  {deletingDomain === domain.id && (
                    <div className="absolute inset-0 bg-[#1f1f1f]/70 rounded-lg flex items-center justify-center z-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#555]"></div>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{domain.domain}</h3>
                      {domain.verified ? (
                        <span className="text-xs bg-green-900/50 text-[#61d397] px-2 py-0.5 rounded-full font-medium border border-green-800">
                          Verified
                        </span>
                      ) : (
                        <span className="text-xs bg-yellow-900/50 text-[#f4b049] px-2 py-0.5 rounded-full font-medium border border-yellow-800">
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex gap-6 text-sm text-gray-500 flex-wrap">
                      <span>Added: {formatDate(domain.createdAt)}</span>
                      {domain.verified && <span>Verified: {formatDate(domain.verifiedAt)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!domain.verified && (
                      <button
                        onClick={() => handleVerifyDomain(domain)}
                        disabled={verifyingDomain === domain.id}
                        className="px-3 py-1.5 text-sm bg-[#61d397] hover:bg-[#52c488] text-[#333] rounded-md font-medium transition-colors disabled:opacity-50"
                      >
                        {verifyingDomain === domain.id ? 'Checking...' : 'Verify'}
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteDomain(domain)}
                      disabled={deletingDomain === domain.id}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Remove domain"
                    >
                      <span className="material-icons text-xl">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-[#555] rounded-lg p-12 text-center">
              <p className="text-gray-500 text-lg mb-2">No domains verified</p>
              <p className="text-gray-400 text-sm">Verify a domain to show it on verification results instead of your email address.</p>
            </div>
          )}
        </div>

        {/* API Keys section */}
        <div className="mb-8 mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">API Keys</h2>
            <button
              onClick={() => navigate('/dashboard/api-keys/new')}
              className="border border-[#555] hover:border-gray-500 text-gray-300 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Create API Key
            </button>
          </div>

          {apiKeys.length > 0 ? (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className={`relative border border-[#555] p-5 rounded-lg flex items-start justify-between ${key.revoked ? 'opacity-60' : ''}`}
                >
                  {revoking === key.id && (
                    <div className="absolute inset-0 bg-[#1f1f1f]/70 rounded-lg flex items-center justify-center z-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#555]"></div>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-lg font-semibold text-white ${key.revoked ? 'line-through' : ''}`}>
                        {key.name}
                      </h3>
                      {key.revoked && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                          Revoked
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 mt-1 font-mono text-sm">
                      {formatKeyPrefix(key.keyPrefix)}
                    </p>
                    <div className="mt-3 flex gap-6 text-sm text-gray-500 flex-wrap">
                      <span>Created: {formatDate(new Date(key.createdAt).getTime())}</span>
                      <span>Expires: {key.expiresAt ? formatDate(new Date(key.expiresAt).getTime()) : 'Never'}</span>
                      <span>Last used: {key.lastUsedAt ? timeAgo(new Date(key.lastUsedAt).getTime()) : 'Never'}</span>
                    </div>
                  </div>
                  {!key.revoked && (
                    <button
                      onClick={() => handleRevoke(key)}
                      disabled={revoking === key.id}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Revoke API key"
                    >
                      <span className="material-icons text-xl">delete</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-[#555] rounded-lg p-12 text-center">
              <p className="text-gray-500 text-lg mb-2">No API keys yet</p>
              <p className="text-gray-400 text-sm">Create an API key to access the tether.name API programmatically.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
