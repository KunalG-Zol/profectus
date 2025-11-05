import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Store the token in localStorage
      localStorage.setItem('token', token);

      // Redirect to the profile page
      navigate('/profile', { replace: true });
    } else {
      // Handle the case where there is no token
      // Redirect to the login page or show an error
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  // You can render a loading spinner here while the redirect is happening
  return <div>Loading...</div>;
};

export default AuthCallback;
