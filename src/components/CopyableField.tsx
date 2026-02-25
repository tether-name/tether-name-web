import { useState } from 'react';

interface CopyableFieldProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyableField({ value, label, className = '' }: CopyableFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          value={value}
          readOnly
          className="w-full h-32 p-3 bg-gray-50 border border-gray-300 rounded-md text-black font-mono text-sm resize-none focus:ring-2 focus:ring-black focus:border-black"
        />
        <button
          onClick={handleCopy}
          className={`absolute top-2 right-2 px-3 py-1 text-sm rounded transition-colors ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}