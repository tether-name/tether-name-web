import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth';
const logo = '/logo.svg';
import { StarField } from '../components/StarField';

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
      <div className="min-h-screen flex items-center justify-center bg-[#1f1f1f] relative overflow-hidden">
      <StarField />
        <div className="max-w-md w-full bg-[#424242] p-8 rounded-lg border border-[#555] ">
          <div className="text-center mb-8">
            <img src={logo} alt="tether.name" className="h-10 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white">Confirm Sign In</h2>
            <p className="text-gray-400 mt-2">
              Signing in as <strong>{email}</strong>
            </p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <button
            onClick={handleMagicVerify}
            disabled={loading}
            className="w-full bg-[#f4b049] hover:bg-[#e5a03a] disabled:bg-gray-600 text-[#333] py-3 px-4 rounded-md font-medium transition-colors text-lg"
          >
            {loading ? 'Signing in...' : 'Sign in to tether.name'}
          </button>

          <div className="text-center mt-6">
            <button
              onClick={() => { setStep('email'); setEmail(''); setCode(''); setError(''); }}
              className="text-[#f4b049] hover:text-[#e5a03a] text-sm font-medium"
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1f1f1f] relative overflow-hidden">
      <StarField />
        <div className="max-w-md w-full relative">
          <img src="/robot-lurk.svg" alt="" className="absolute -top-14 left-2 w-16 h-16 z-20" />
          <div className="bg-[#424242] p-8 rounded-lg border border-[#555] relative">
          <div className="text-center mb-8">
            <img src={logo} alt="tether.name" className="h-10 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white">Sign In</h2>
            <p className="text-gray-400 mt-2">Enter your email to receive a verification code</p>
          </div>

          <form onSubmit={handleSendCode} className="space-y-6">
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#f4b049] focus:border-[#f4b049]"
                placeholder="your@email.com"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-[#f4b049] hover:bg-[#e5a03a] disabled:bg-gray-600 text-[#333] py-2 px-4 rounded-md font-medium transition-colors"
            >
              {loading ? 'Sending Code...' : 'Continue'}
            </button>
          </form>
        </div>
        </div>

        <div className="max-w-md w-full mt-6 px-2">
          <p className="text-sm text-gray-500 text-center leading-relaxed">
            All AI agent identities are tied to the email they're registered under. As an individual, register using the email people associate with you. As a business, we suggest using an email containing your business domain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1f1f1f] relative overflow-hidden">
      <StarField />
      <div className="max-w-md w-full relative">
        <img src="/robot-lurk.svg" alt="" className="absolute -top-14 left-2 w-16 h-16 z-20" />
        <div className="bg-[#424242] p-8 rounded-lg border border-[#555] relative">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Enter Verification Code</h2>
          <p className="text-gray-400 mt-2">
            We sent a code to <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="space-y-6">
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              6-digit code
            </label>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#f4b049] focus:border-[#f4b049] text-center text-2xl tracking-widest font-mono"
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
            className="w-full bg-[#f4b049] hover:bg-[#e5a03a] disabled:bg-gray-600 text-[#333] py-2 px-4 rounded-md font-medium transition-colors"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={handleBack}
            className="text-[#f4b049] hover:text-[#e5a03a] text-sm font-medium"
          >
            ← Back to email
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}