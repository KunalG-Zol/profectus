import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Handle OAuth callback from backend
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const errorParam = searchParams.get('error');

    // Only run if we have callback params
    if (!token && !userParam && !errorParam) {
      return;
    }

    if (errorParam) {
      const errorMessages = {
        'token_exchange_failed': 'Failed to exchange authorization code. Please try again.',
        'no_access_token': 'GitHub did not provide an access token. Please try again.',
        'failed_to_get_user': 'Failed to retrieve user information from GitHub.',
        'authentication_failed': 'Authentication failed. Please try again.'
      };

      setError(errorMessages[errorParam] || 'Authentication failed. Please try again.');
      setLoading(false);

      // Clear error from URL
      window.history.replaceState({}, '', '/login');
      return;
    }

    if (token && userParam) {
      try {
        setLoading(true);
        const userData = JSON.parse(decodeURIComponent(userParam));

        // Save authentication data
        login(token, userData);

        // Redirect to home page
        navigate('/', { replace: true });
      } catch (err) {
        setError('Failed to process authentication. Please try again.');
        console.error('Auth processing error:', err);
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only depend on searchParams, not login or navigate

  const handleGitHubLogin = () => {
    setLoading(true);
    setError('');

    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const redirectUri = `${apiUrl}/auth/github/callback`;
    const scope = 'read:user user:email repo';
    const state = encodeURIComponent(window.location.origin);

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    window.location.href = authUrl;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-rich-black to-[#071a2a]">
        <div className="bg-[#01080e]/60 p-12 rounded-2xl border border-orange-500/20 text-center backdrop-blur-sm">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="font-josefin text-white-smoke text-lg">Authenticating with GitHub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rich-black to-[#071a2a] flex items-center justify-center px-4 py-12">
      <div className="bg-[#01080e]/60 p-8 md:p-10 rounded-2xl border border-orange-500/20 w-full max-w-md backdrop-blur-sm shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-k95 text-3xl md:text-4xl text-white-smoke mb-3">
            Welcome Back
          </h1>
          <p className="font-josefin text-white-smoke/80 text-base md:text-lg">
            Sign in to continue your journey
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-josefin text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* GitHub Login Button */}
        <button
          onClick={handleGitHubLogin}
          disabled={loading}
          className="w-full bg-[#24292e] hover:bg-[#2f363d] disabled:bg-[#24292e]/50 text-white-smoke font-josefin font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="text-base">Continue with GitHub</span>
        </button>

        {/* Features/Benefits */}
        <div className="mt-8 pt-6 border-t border-orange-500/20">
          <p className="font-josefin text-white-smoke/60 text-sm text-center mb-4">
            By signing in, you'll be able to:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-white-smoke/70 font-josefin text-sm">
              <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Create AI-powered project roadmaps</span>
            </li>
            <li className="flex items-center gap-2 text-white-smoke/70 font-josefin text-sm">
              <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Track your progress with streaks</span>
            </li>
            <li className="flex items-center gap-2 text-white-smoke/70 font-josefin text-sm">
              <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Sync with your GitHub repositories</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <p className="font-josefin text-white-smoke/50 text-center mt-8 text-xs">
          By continuing, you agree to our{' '}
          <a href="#" className="text-orange-500 hover:text-orange-400 transition-colors">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="#" className="text-orange-500 hover:text-orange-400 transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
    