import { useUser } from '../context/UserContext.tsx';
import NavItem from './NavItem.tsx';
import { useState } from 'react';

export default function Navbar() {
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex flex-row justify-center md:justify-between items-center px-20 py-2">
      {/* Botón móvil */}
      <button
        className="md:hidden p-2 focus:outline-none"
        onClick={() => setOpen(true)}
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2"
          viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

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
              <NavItem to="/login">Acceder</NavItem>
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
      {/* Menú móvil deslizante */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
    ${open ? 'translate-x-0' : '-translate-x-full'} md:hidden`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <span className="font-bold text-blue-600 text-lg">Menú</span>
          <button onClick={() => setOpen(false)} className="text-gray-700">
            ✕
          </button>
        </div>

        <div className="flex flex-col p-4 gap-4">
          {!user ? (
            <>
              <NavItem to="/" onClick={() => setOpen(false)}>Inicio</NavItem>
              <NavItem to="/" onClick={() => setOpen(false)}>Como funciona</NavItem>
              <NavItem to="/" onClick={() => setOpen(false)}>El proyecto</NavItem>
              <NavItem to="/" onClick={() => setOpen(false)}>Blog</NavItem>
              <NavItem to="/" onClick={() => setOpen(false)}>Contacto</NavItem>
              <NavItem to="/login" onClick={() => setOpen(false)}>Acceder</NavItem>
            </>
          ) : (
            <>
              <NavItem to="/perfil" onClick={() => setOpen(false)}>Mi perfil</NavItem>
              <NavItem to="/explorar" onClick={() => setOpen(false)}>Explorar</NavItem>
              <NavItem to="/mensajes" onClick={() => setOpen(false)}>Mensajes</NavItem>
              <button
                onClick={() => {
                  setUser(null);
                  setOpen(false);
                }}
                className="text-left text-red-500 hover:underline"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>

    </nav>
  );
}
