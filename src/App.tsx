import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext.tsx';
import Login from './components/Login.tsx';
import PerfilEditable from './components/PerfilEditable.tsx';
import Navbar from './components/Navbar.tsx';
import ExplorarEscaladores from './components/ExplorarEscaladores.tsx';
import PerfilPublico from './components/PerfilPublico.tsx';
import Mensajes from './components/Mensajes.tsx';
import BandejaMensajes from './components/BandejaMensajes.tsx';

function App() {
  const { user } = useUser();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/perfil" /> : <Login />} />
        <Route path="/perfil" element={user ? <PerfilEditable /> : <Navigate to="/" />} />
        <Route path="/explorar" element={user ? <ExplorarEscaladores /> : <Navigate to="/" />} />
        <Route path="/usuarios/:id" element={user ? <PerfilPublico /> : <Navigate to="/" />} />
        <Route path="/mensajes/:id" element={user ? <Mensajes /> : <Navigate to="/" />} />
        <Route path="/mensajes" element={user ? <BandejaMensajes /> : <Navigate to="/" />} />
        {/* Aquí más rutas futuras: /explorar, /mensajes, etc. */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
