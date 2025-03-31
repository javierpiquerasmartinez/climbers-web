import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext.tsx';

export default function Navbar() {
  const { user, setUser } = useUser();

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      {user && (
        <>
          <span>Hola, {user.name}</span> |&nbsp;
          <Link to="/perfil">Mi perfil</Link> |&nbsp;
          <Link to="/explorar">Explorar</Link> |&nbsp;
          <Link to="/mensajes">Mensajes</Link> |&nbsp;
          <button onClick={() => setUser(null)}>Cerrar sesión</button>
        </>
      )}
    </nav>
  );
}
