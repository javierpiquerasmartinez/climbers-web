import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../lib/axios';

type User = {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  location?: string;
  climbingStyles: string[];
  level?: string;
};

export default function ExplorarEscaladores() {
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState({
    role: '',
    style: '',
    location: '',
    level: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const token = localStorage.getItem('googleToken');

      if (!token) return;

      const res = await axiosInstance.get(`/api/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(res.data);
    };

    fetchUsers();
  }, [filters]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Explorar escaladores</h2>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Rol</label>
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Todos</option>
            <option value="viajero">Viajero</option>
            <option value="anfitrión">Anfitrión</option>
            <option value="ambos">Ambos</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Estilo</label>
          <select
            value={filters.style}
            onChange={(e) => setFilters({ ...filters, style: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Cualquiera</option>
            <option value="boulder">Boulder</option>
            <option value="deportiva">Deportiva</option>
            <option value="trad">Trad</option>
            <option value="mixta">Mixta</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Localización</label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Ej: Valencia"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Nivel</label>
          <input
            type="text"
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Intermedio, Avanzado..."
          />
        </div>
      </div>

      {/* Resultados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length === 0 && <p>No se encontraron escaladores.</p>}

        {users.map(user => (
          <Link to={`/usuarios/${user.id}`} key={user.id}>
            <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition hover:-translate-y-1 bg-white flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <img src={user.avatarUrl || 'logo.png'} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.location}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">🎯 Nivel: <span className="font-medium">{user.level || 'N/A'}</span></p>
              <p className="text-sm text-gray-600">🧗 Estilos: {user.climbingStyles.join(', ')}</p>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full w-fit">
                {user.role}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

}
