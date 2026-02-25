import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth';
import logo from '../assets/logo.svg';

type AuthStep = 'email' | 'code' | 'magic';

export function Auth() {
  const [searchParams] = useSearchParams();
  const magicEmail = searchParams.get('email') || '';
  const magicCode = searchParams.get('code') || '';
  const hasMagicLink = !!(magicEmail && magicCode);

  const [step, setStep] = useState<AuthStep>(hasMagicLink ? 'magic' : 'email');
  const [email, setEmail] = useState(magicEmail || '');
  const [code, setCode] = useState(magicCode || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendCode, verifyCode } = useAuth();
  const navigate = useNavigate();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendCode(email);
      setStep('code');
    } catch (error) {
      console.error('Send code error:', error);
      setError('Something went wrong sending the code. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyCode(email, code);
      navigate('/dashboard');
    } catch (error) {
      console.error('Verify code error:', error);
      setError('Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('email');
    setCode('');
    setError('');
  };

  const formatCodeInput = (value: string) => {
    // Remove any non-digits and limit to 6 characters
    const digits = value.replace(/\D/g, '').slice(0, 6);
    return digits;
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCodeInput(e.target.value);
    setCode(formatted);
  };

  const handleMagicVerify = async () => {
    setError('');
    setLoading(true);

    try {
      await verifyCode(email, code);
      navigate('/dashboard');
    } catch (error) {
      console.error('Magic link verify error:', error);
      setError('Verification failed. The link may have expired — try signing in again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'magic') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md w-full bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-center mb-8">
            <img src={logo} alt="Tether.name" className="h-12 w-12 rounded-lg mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-black">Confirm Sign In</h2>
            <p className="text-gray-600 mt-2">
              Signing in as <strong>{email}</strong>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <button
            onClick={handleMagicVerify}
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-3 px-4 rounded-md font-medium transition-colors text-lg"
          >
            {loading ? 'Signing in...' : 'Sign in to Tether.name'}
          </button>

          <div className="text-center mt-6">
            <button
              onClick={() => { setStep('email'); setEmail(''); setCode(''); setError(''); }}
              className="text-black hover:text-gray-700 text-sm font-medium"
            >
              ← Use a different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'email') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="max-w-md w-full bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-center mb-8">
            <img src={logo} alt="Tether.name" className="h-12 w-12 rounded-lg mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-black">Sign In</h2>
            <p className="text-gray-600 mt-2">Enter your email to receive a verification code</p>
          </div>

          <form onSubmit={handleSendCode} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                placeholder="your@email.com"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              {loading ? 'Sending Code...' : 'Continue'}
            </button>
          </form>
        </div>

        <div className="max-w-md w-full mt-6 px-2">
          <p className="text-sm text-gray-500 text-center leading-relaxed">
            An agent's identity is tied to the email they are registered under. If you are a person with a personal agent, you should use the email address that your friends and family will recognize as "you". If you are a business, this should likely be an email address that contains your business domain within it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black">Enter Verification Code</h2>
          <p className="text-gray-600 mt-2">
            We sent a code to <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              6-digit code
            </label>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-center text-2xl tracking-widest font-mono"
              placeholder="000000"
              maxLength={6}
              required
              autoFocus
              autoComplete="one-time-code"
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={handleBack}
            className="text-black hover:text-gray-700 text-sm font-medium"
          >
            ← Back to email
          </button>
        </div>
      </div>
    </div>
  );
}