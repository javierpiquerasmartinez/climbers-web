import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useUser } from './context/UserContext';
import Layout from './components/Layout';
import Login from './components/Login';
import PerfilEditable from './components/PerfilEditable';
import ExplorarEscaladores from './components/ExplorarEscaladores';
import BandejaMensajes from './components/BandejaMensajes';
import Mensajes from './components/Mensajes';
import PerfilPublico from './components/PerfilPublico';

function App() {
  const { user } = useUser();

  return (
    <BrowserRouter>
      <Routes>
        {!user && (
          <Route path="/" element={<Login />} />
        )}

        {user && (
          <Route element={<Layout />}>
            <Route path="/" element={<ExplorarEscaladores />} />
            <Route path="/perfil" element={<PerfilEditable />} />
            <Route path="/explorar" element={<ExplorarEscaladores />} />
            <Route path="/mensajes" element={<BandejaMensajes />} />
            <Route path="/mensajes/:id" element={<Mensajes />} />
            <Route path="/usuarios/:id" element={<PerfilPublico />} />
          </Route>
        )}

        <Route path="*" element={<div className="p-10 text-center text-gray-500">Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
