import { GoogleLogin } from '@react-oauth/google';
import { useUser } from '../context/UserContext.tsx';
import axiosInstance from '../lib/axios.ts';

export default function Login() {
  const { setUser } = useUser();
  const handleLogin = async (credentialResponse: any) => {
    const token = credentialResponse.credential;

    try {
      const response = await axiosInstance.post(`/api/auth/google`, {
        token
      });

      localStorage.setItem('googleToken', token);
      setUser(response.data);
    } catch (err) {
      console.error('Error en login:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Iniciar sesión</h2>
      <GoogleLogin onSuccess={handleLogin} onError={() => console.log('Login fallido')} />
    </div>
  );
}
