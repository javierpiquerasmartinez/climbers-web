import { useUser } from '../context/UserContext.tsx';
import NavItem from './NavItem.tsx';

export default function Navbar() {
  const { user, setUser } = useUser();

  return (
    <nav className="flex flex-row justify-center md:justify-between items-center px-20 py-2">
      <a href="/">
        <img src="/logo.png" alt="El logo de CragXchange" className="w-auto max-h-[64px]" />
      </a>
      <div className='md:flex flex-row gap-4 hidden'>
        {
          !user && (
            <>
              <NavItem to="/">Inicio</NavItem>
              <NavItem to="/">Como funciona</NavItem>
              <NavItem to="/">El proyecto</NavItem>
              <NavItem to="/">Blog</NavItem>
              <NavItem to="/">Contacto</NavItem>
              -
              <NavItem to="/login">Iniciar sesión</NavItem>
              <NavItem to="/">Registrarse</NavItem>
            </>
          )
        }
        {user && (
          <>
            <NavItem to="/perfil">Mi perfil</NavItem>
            <NavItem to="/explorar">Explorar</NavItem>
            <NavItem to="/mensajes">Mensajes</NavItem>
            <span> - </span>
            <span className='flex items-center gap-2'>
              <img className="w-5 h-5 rounded-full object-cover" src={user.avatarUrl} alt="Logo del usuario logueado" />
              {user.name}
            </span>
            <button onClick={() => setUser(null)}>Cerrar sesión</button>
          </>
        )}
      </div>
    </nav>
  );
}
