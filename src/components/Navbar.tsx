import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext.tsx';

export default function Navbar() {
  const { user, setUser } = useUser();

  return (
    <nav className="flex flex-row justify-between items-center px-20 py-2">
      <div>
        <img src="/public/logo.png" alt="El logo de CragXchange" className="w-auto max-h-[64px]" />
      </div>
      <div className='flex flex-row gap-4'>
        {
          !user && (
            <>
              <Link to="/">Inicio</Link>
              <Link to="/">Como funciona</Link>
              <Link to="/">El proyecto</Link>
              <Link to="/">Blog</Link>
              <Link to="/">Contacto</Link>
              -
              <Link to="/">Iniciar sesión</Link>
              <Link to="/">Registrarse</Link>
            </>
          )
        }
        {user && (
          <>
            <span>Hola, {user.name}</span>
            <Link to="/perfil">Mi perfil</Link>
            <Link to="/explorar">Explorar</Link>
            <Link to="/mensajes">Mensajes</Link>
            <button onClick={() => setUser(null)}>Cerrar sesión</button>
          </>
        )}
      </div>
    </nav>
  );
}
