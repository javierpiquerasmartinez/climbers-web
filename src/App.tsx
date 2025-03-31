import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import PerfilEditable from './components/PerfilEditable';
import ExplorarEscaladores from './components/ExplorarEscaladores';
import BandejaMensajes from './components/BandejaMensajes';
import Mensajes from './components/Mensajes';
import PerfilPublico from './components/PerfilPublico';
import ProtectedRoute from './components/ProtectedRoute';
import MainPage from './components/MainPage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<MainPage />} />
          <Route path='/login' element={<Login />} />
          <Route path="/perfil"
            element={
              <ProtectedRoute>
                <PerfilEditable />
              </ProtectedRoute>
            } />
          <Route path="/explorar"
            element={
              <ProtectedRoute>
                <ExplorarEscaladores />
              </ProtectedRoute>
            } />
          <Route path="/mensajes"
            element={
              <ProtectedRoute>
                <BandejaMensajes />
              </ProtectedRoute>
            } />
          <Route path="/mensajes/:id"
            element={
              <ProtectedRoute>
                <Mensajes />
              </ProtectedRoute>
            } />
          <Route path="/usuarios/:id"
            element={
              <ProtectedRoute>
                <PerfilPublico />
              </ProtectedRoute>
            } />
        </Route>
        <Route path="*" element={<div className="p-10 text-center text-gray-500">Página no encontrada</div>} />

      </Routes>
    </BrowserRouter >
  );
}

export default App;
