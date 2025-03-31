import { useState } from 'react';
import { useUser } from '../context/UserContext.tsx';
import axiosInstance from '../lib/axios.ts';

const estilosDisponibles = ['boulder', 'deportiva', 'trad', 'mixta'];

export default function PerfilEditable() {
  const { user, setUser } = useUser();

  const [form, setForm] = useState({
    role: user?.role ?? 'viajero',
    location: user?.location ?? '',
    climbingStyles: user?.climbingStyles ?? [],
    level: user?.level ?? ''
  });

  const toggleStyle = (style: string) => {
    setForm(prev => ({
      ...prev,
      climbingStyles: prev.climbingStyles.includes(style)
        ? prev.climbingStyles.filter(s => s !== style)
        : [...prev.climbingStyles, style]
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('googleToken');
    if (!token || !user) return;

    try {
      const response = await axiosInstance.patch(
        `/api/users/${user.id}`,
        form
      );
      setUser(response.data);
      alert('Perfil actualizado con éxito');
    } catch (err) {
      console.error(err);
      alert('Error al actualizar el perfil');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
      {user && (
        <div className="flex items-center gap-4 mb-4">
          {user.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt="avatar"
              className="w-14 h-14 rounded-full border shadow"
            />
          )}
          <div>
            <p className="font-semibold text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold text-center text-gray-800">Editar perfil</h2>

      {/* Rol */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rol:</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value as any })}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="viajero">Viajero</option>
          <option value="anfitrión">Anfitrión</option>
          <option value="ambos">Ambos</option>
        </select>
      </div>

      {/* Localización */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Localización:</label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      {/* Estilos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Estilos de escalada:</label>
        <div className="flex flex-wrap gap-3">
          {estilosDisponibles.map(style => (
            <label
              key={style}
              className="flex items-center gap-2 text-sm text-gray-800"
            >
              <input
                type="checkbox"
                checked={form.climbingStyles.includes(style)}
                onChange={() => toggleStyle(style)}
                className="accent-blue-600"
              />
              {style}
            </label>
          ))}
        </div>
      </div>

      {/* Nivel */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nivel:</label>
        <input
          type="text"
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value })}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      {/* Botón */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition transform hover:-translate-y-1"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}