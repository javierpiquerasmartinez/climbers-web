import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Contenido */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}