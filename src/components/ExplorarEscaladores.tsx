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
    <div style={{ padding: '2rem' }}>
      <h2>Explorar escaladores</h2>

      {/* Filtros */}
      <div style={{ marginBottom: '2rem' }}>
        <label>
          Rol:
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          >
            <option value="">Todos</option>
            <option value="viajero">Viajero</option>
            <option value="anfitrión">Anfitrión</option>
            <option value="ambos">Ambos</option>
          </select>
        </label>

        <label style={{ marginLeft: '1rem' }}>
          Estilo:
          <select
            value={filters.style}
            onChange={(e) => setFilters({ ...filters, style: e.target.value })}
          >
            <option value="">Cualquiera</option>
            <option value="boulder">Boulder</option>
            <option value="deportiva">Deportiva</option>
            <option value="trad">Trad</option>
            <option value="mixta">Mixta</option>
          </select>
        </label>

        <label style={{ marginLeft: '1rem' }}>
          Localización:
          <input
            type="text"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            placeholder="Ej: Valencia"
          />
        </label>

        <label style={{ marginLeft: '1rem' }}>
          Nivel:
          <input
            type="text"
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            placeholder="intermedio, avanzado..."
          />
        </label>
      </div>

      {/* Resultados */}
      <ul>
        {users.length === 0 && <p>No se encontraron escaladores</p>}
        {users.map(user => (
          <li key={user.id} style={{ marginBottom: '1rem' }}>
            <Link to={`/usuarios/${user.id}`}>
              <strong>{user.name}</strong>
            </Link>
            ({user.role})<br />
            {user.avatarUrl && (
              <img src={user.avatarUrl} alt="avatar" width={40} style={{ borderRadius: '50%' }} />
            )}
            <p>📍 {user.location} | Nivel: {user.level}</p>
            <p>🧗 Estilos: {user.climbingStyles.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
