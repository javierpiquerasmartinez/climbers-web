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
    <div style={{ padding: '2rem' }}>
      <h2>Mensajes</h2>

      {contactos.length === 0 && <p>Aún no has chateado con nadie.</p>}

      <ul>
        {contactos.map((c) => (
          <li key={c.id} style={{ marginBottom: '1rem' }}>
            <Link to={`/mensajes/${c.id}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {c.avatarUrl && (
                  <img src={c.avatarUrl} alt="avatar" width={40} style={{ borderRadius: '50%' }} />
                )}
                <div>
                  <strong>{c.name}</strong> ({c.role})<br />
                  {c.location && <small>{c.location}</small>}
                  <p style={{ fontStyle: 'italic', color: '#666', marginTop: '0.5rem' }}>
                    {c.lastMessage ? `"${c.lastMessage}"` : 'Sin mensajes aún'}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
