interface VerifiedResultProps {
  challenge: string;
  email?: string;
  agentName?: string;
  registeredSince?: number;
  createdAt?: number;
  verifiedAt?: number;
  onVerifyAnother?: () => void;
  verifyAnotherHref?: string;
}

const formatDateTime = (timestamp?: number) => {
  if (!timestamp) return 'N/A';
  const date = timestamp > 1e12 ? new Date(timestamp) : new Date(timestamp * 1000);
  return date.toLocaleString();
};

const formatDate = (timestamp?: number) => {
  if (!timestamp) return 'N/A';
  const date = timestamp > 1e12 ? new Date(timestamp) : new Date(timestamp * 1000);
  return date.toLocaleDateString();
};

const getAgeWarning = (timestamp?: number): { stale: boolean; label: string } | null => {
  if (!timestamp) return null;
  const ms = timestamp > 1e12 ? timestamp : timestamp * 1000;
  const ageMs = Date.now() - ms;
  const ageHours = ageMs / (1000 * 60 * 60);
  const ageDays = Math.floor(ageHours / 24);

  if (ageHours < 48) return null;
  if (ageDays === 1) return { stale: true, label: 'yesterday' };
  if (ageDays < 30) return { stale: true, label: `${ageDays} days ago` };
  return { stale: true, label: `over ${Math.floor(ageDays / 30)} month${Math.floor(ageDays / 30) > 1 ? 's' : ''} ago` };
};

export function VerifiedResult({
  challenge,
  email,
  agentName,
  registeredSince,
  createdAt,
  verifiedAt,
  onVerifyAnother,
  verifyAnotherHref = '/challenge',
}: VerifiedResultProps) {
  const ageWarning = getAgeWarning(verifiedAt);

  return (
    <div className="space-y-6">
      <div className="bg-[#2a2a2a] border border-[#555] p-8 rounded-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#f4b049] rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Verification Complete</h2>
          <p className="text-gray-400 text-lg">The agent signed this code</p>
        </div>

        <div className="bg-[#2a2a2a] p-6 rounded-lg border-2 border-[#61d397]">
          <p className="text-center text-gray-400 text-sm mb-2">This agent represents</p>
          <p className="text-center text-2xl font-bold text-white mb-1">{email || 'Unknown'}</p>
          {agentName && (
            <p className="text-center text-gray-500">Agent name: {agentName}</p>
          )}
          <p className="text-center text-gray-400 text-sm mt-2">
            Member since {formatDate(registeredSince)}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-[#555]">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">Code details</h4>
          <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-400">
            <div>
              <span className="font-medium">Code:</span>{' '}
              <code className="font-mono">{challenge}</code>
            </div>
            <div>
              <span className="font-medium">Issued:</span>{' '}
              {formatDateTime(createdAt)}
            </div>
            <div>
              <span className="font-medium">Completed:</span>{' '}
              {formatDateTime(verifiedAt)}
            </div>
          </div>
        </div>
      </div>

      {ageWarning && (
        <div className="bg-amber-900/30 border border-amber-600 p-5 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-800 mb-1">Outdated verification</h4>
              <p className="text-sm text-amber-700">
                This code was completed <strong>{ageWarning.label}</strong>. A lot can change — credentials can be revoked, accounts can be compromised. You should request a fresh verification to confirm this agent's current identity.
              </p>
              <a
                href="/challenge"
                className="inline-block mt-3 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
              >
                Generate a new code
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="border border-[#555] bg-[#2a2a2a] p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">What does this mean?</h3>
        <div className="text-gray-300 space-y-3 text-sm">
          <p>
            This code confirms that the agent holds a valid cryptographic credential linked to the email address shown above. It does <strong>not</strong> automatically mean this agent is safe to trust.
          </p>
          <p className="font-medium text-white">You should now ask yourself:</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>
              <strong>Do I recognize this email?</strong> Does it belong to the person or organization the agent claimed to represent?
            </li>
            <li>
              <strong>Does the agent name match?</strong> Is this the agent I expected to be talking to?
            </li>
            <li>
              <strong>Am I comfortable?</strong> If anything looks off — wrong email, unfamiliar name, unexpected timing — do not trust the agent and contact the person directly through a channel you already trust.
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        {onVerifyAnother ? (
          <button
            onClick={onVerifyAnother}
            className="inline-block border border-[#f4b049] text-white px-6 py-3 rounded-lg hover:bg-[#3d3d3d] transition-colors font-medium"
          >
            Verify another agent
          </button>
        ) : (
          <a
            href={verifyAnotherHref}
            className="inline-block border border-[#f4b049] text-white px-6 py-3 rounded-lg hover:bg-[#3d3d3d] transition-colors font-medium"
          >
            Verify another agent
          </a>
        )}
      </div>
    </div>
  );
}
