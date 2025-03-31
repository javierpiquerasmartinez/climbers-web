import { useState } from 'react';
import { useUser } from '../context/UserContext.tsx';
import axiosInstance from '../lib/axios.ts';

const estilosDisponibles = ['boulder', 'deportiva', 'trad', 'mixta'];

export default function PerfilEditable() {
  const { user, setUser } = useUser();

  const [successMessage, setSuccessMessage] = useState('');

  const [form, setForm] = useState({
    role: user?.role ?? 'viajero',
    location: user?.location ?? '',
    climbingStyles: user?.climbingStyles ?? [],
    level: user?.level ?? ''
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    const formData = new FormData();
    formData.append('avatar', file);

    const token = localStorage.getItem('googleToken');

    axiosInstance
      .post(`/api/users/${user.id}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setForm(prev => ({ ...prev, avatarUrl: res.data.avatarUrl }));
        setUser({ ...user, avatarUrl: res.data.avatarUrl });
        // Notificación que añadimos luego 👇
        setSuccessMessage('✅ Avatar actualizado correctamente');
      })
      .catch(err => {
        console.error('Error al subir avatar', err);
        alert('Error al subir avatar');
      });
  };


  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
      {user && (
        <div className="flex items-center gap-4 mb-4">
          {user.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover border shadow"
            />
          )}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Cambiar avatar:</label>

            <div className="relative w-fit">
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <label
                htmlFor="avatarInput"
                className="inline-block bg-(--color-accent) text-white text-sm font-medium px-4 py-2 rounded-lg 
             transition transform hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
              >
                Seleccionar imagen
              </label>

            </div>

            {previewUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-1">Vista previa:</p>
                <img
                  src={previewUrl}
                  alt="Vista previa del avatar"
                  className="w-20 h-20 rounded-full object-cover border shadow"
                />
              </div>
            )}
          </div>


          <div>
            <p className="font-semibold text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      )}
      {successMessage && (
        <div className="mt-2 text-green-600 text-sm font-medium">{successMessage}</div>
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
                className="accent-(--color-accent)"
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
          className="bg-(--color-accent) text-white px-5 py-2 rounded-lg transition transform hover:-translate-y-1"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}