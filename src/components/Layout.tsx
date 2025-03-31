import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Contenido */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}