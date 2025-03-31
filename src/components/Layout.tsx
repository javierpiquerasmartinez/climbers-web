import { Link, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Layout() {
  const { user, setUser } = useUser();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          🧗 Climbers
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <Link to="/perfil" className="text-sm hover:underline">Mi perfil</Link>
              <Link to="/explorar" className="text-sm hover:underline">Explorar</Link>
              <Link to="/mensajes" className="text-sm hover:underline">Mensajes</Link>
              <button
                onClick={() => setUser(null)}
                className="text-sm text-red-500 hover:underline"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Contenido */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}