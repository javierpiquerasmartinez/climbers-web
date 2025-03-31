import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext.tsx';
import axiosInstance from '../lib/axios';

type Contacto = {
  id: string;
  name: string;
  avatarUrl?: string;
  location?: string;
  role: string;
  lastMessage?: string;
  lastDate?: string;
};

export default function BandejaMensajes() {
  const { user } = useUser();
  const [contactos, setContactos] = useState<Contacto[]>([]);

  useEffect(() => {
    if (!user) return;

    axiosInstance
      .get(`/api/users/${user.id}/conversations`)
      .then((res) => setContactos(res.data))
      .catch(console.error);
  }, [user]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Mensajes</h2>

      {contactos.length === 0 && (
        <p className="text-gray-500">Aún no has chateado con nadie.</p>
      )}

      <ul className="space-y-4">
        {contactos.map((c) => (
          <li key={c.id}>
            <Link
              to={`/mensajes/${c.id}`}
              className="flex items-center gap-4 p-4 rounded-xl border hover:bg-gray-100 transition"
            >
              {c.avatarUrl ? (
                <img
                  src={c.avatarUrl}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                  {c.name[0]}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">{c.name}</span>
                  {c.lastDate && (
                    <span className="text-sm text-gray-400 whitespace-nowrap">
                      {new Date(c.lastDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="italic">
                    {c.lastMessage ? `"${c.lastMessage}"` : 'Sin mensajes aún'}
                  </span>
                </div>
                {c.location && (
                  <div className="text-xs text-gray-400 mt-1">{c.location}</div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
