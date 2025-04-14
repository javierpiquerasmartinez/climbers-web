import { useState } from 'react';
import { useUser } from '../context/UserContext.tsx';
import axiosInstance from '../lib/axios.ts';
import { useParams } from './../hooks/useParams';

export default function PerfilEditable() {
  const { user, setUser } = useUser();
  const { data: params } = useParams();

  const [successMessage, setSuccessMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    role: user?.role ?? 'viajero',
    location: user?.location ?? '',
    climbingStyles: user?.climbingStyles?.map((s: any) => s.id) ?? [],
    level: user?.level?.id ?? null,
  });

  const toggleStyle = (style: any) => {
    setForm(prev => ({
      ...prev,
      climbingStyles: prev.climbingStyles.includes(style.id)
        ? prev.climbingStyles.filter(id => id !== style.id)
        : [...prev.climbingStyles, style.id]
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

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


          <div className="overflow-hidden">
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
          {params?.climbingStyles.map(style => (
            <label
              key={'style-' + style.id}
              className="flex items-center gap-2 text-sm text-gray-800"
            >
              <input
                type="checkbox"
                checked={form.climbingStyles.includes(style.id)}
                onChange={() => toggleStyle(style)}
                className="accent-(--color-accent)"
              />
              {style.name.replace('_', ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase())}
            </label>
          ))}
        </div>
      </div>

      {/* Nivel */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nivel:</label>
        <select
          value={form.level ?? ''}
          onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
          className="w-full border rounded-md px-3 py-2">
          <option value="">Selecciona tu nivel</option>
          {params?.climbingLevels.map(level => (
            <option key={level.id} value={level.id}>
              {level.name.charAt(0) + level.name.slice(1).toLowerCase().replace('_', ' ')}
            </option>
          ))}
        </select>
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