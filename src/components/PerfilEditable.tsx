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
    <div style={{ padding: '2rem', maxWidth: '500px' }}>
      <h2>Editar perfil</h2>

      <label>Rol:</label>
      <select
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value as any })}
      >
        <option value="viajero">Viajero</option>
        <option value="anfitrión">Anfitrión</option>
        <option value="ambos">Ambos</option>
      </select>

      <br /><br />

      <label>Localización:</label>
      <input
        type="text"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />

      <br /><br />

      <label>Estilos:</label><br />
      {estilosDisponibles.map(style => (
        <label key={style} style={{ marginRight: '1rem' }}>
          <input
            type="checkbox"
            checked={form.climbingStyles.includes(style)}
            onChange={() => toggleStyle(style)}
          />
          {style}
        </label>
      ))}

      <br /><br />

      <label>Nivel:</label>
      <input
        type="text"
        value={form.level}
        onChange={(e) => setForm({ ...form, level: e.target.value })}
      />

      <br /><br />

      <button onClick={handleSubmit}>Guardar cambios</button>
    </div>
  );
}
