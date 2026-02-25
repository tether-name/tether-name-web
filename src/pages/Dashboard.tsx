import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { api, ApiError } from '../api';
import type { Agent } from '../api';

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
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const data = await api.getCredentials();
      setAgents(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load agents');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (agent: Agent) => {
    if (!confirm(`Delete agent "${agent.agentName}"? This cannot be undone.`)) return;
    setDeleting(agent.id);
    try {
      await api.deleteCredential(agent.id);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Your Agents</h1>
          <p className="text-gray-600">
            Manage your verified agents &middot; {user?.email}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Agent list */}
        {agents.length > 0 ? (
          <div className="mb-8 space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="relative border border-gray-200 p-5 rounded-lg flex items-start justify-between">
                {deleting === agent.id && (
                  <div className="absolute inset-0 bg-white/70 rounded-lg flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-black">{agent.agentName}</h3>
                  {agent.description && (
                    <p className="text-gray-500 mt-1">{agent.description}</p>
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
          <div className="mb-8 border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-500 text-lg mb-2">No agents registered yet</p>
            <p className="text-gray-400 text-sm">Add your first agent to get started with identity verification.</p>
          </div>
        )}

        {/* CTAs */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard/new')}
            className="w-full bg-black hover:bg-gray-800 text-white py-3 px-4 rounded-md font-medium transition-colors text-lg"
          >
            Add New Agent
          </button>

          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <button
            onClick={() => navigate('/challenge')}
            className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-black py-3 px-4 rounded-md font-medium transition-colors"
          >
            Verify an Agent
          </button>
        </div>
      </div>
    </div>
  );
}
