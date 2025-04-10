import { useEffect, useState } from 'react';
import axiosInstance from '../lib/axios';
import { User } from '../context/UserContext';
import UserCard from './UserCard';

export default function ExplorarEscaladores() {

  const [favorites, setFavorites] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState({
    role: '',
    style: '',
    location: '',
    level: ''
  });

  const handleFavoriteClick = async (id: string, add: boolean) => {
    {
      const updated = add
        ? [...favorites, id]
        : favorites.filter(favId => favId !== id);
      setFavorites(updated);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const res = await axiosInstance.get(`/api/users?${params.toString()}`);
      setUsers(res.data);
    };

    fetchUsers();
  }, [filters]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const res = await axiosInstance.get('/api/favorites');
      setFavorites(res.data.map((favorite: { id: string }) => favorite.id));
    }
    fetchFavorites();
  }, []);

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
          <UserCard
            key={'usercard-' + user.id}
            user={user}
            isFavorite={favorites.includes(user.id)}
            onToggleFavorite={handleFavoriteClick}
          />
        ))}
      </div>
    </div>
  );

}
