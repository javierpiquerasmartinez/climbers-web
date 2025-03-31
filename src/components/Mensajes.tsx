import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext.tsx';
import axiosInstance from '../lib/axios';

type Message = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
};

export default function Mensajes() {
  const { id: otherUserId } = useParams();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !otherUserId) return;

    axiosInstance
      .get(`/api/messages?user1=${user.id}&user2=${otherUserId}`)
      .then((res) => setMessages(res.data))
      .catch(console.error);
  }, [user, otherUserId]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [messages]);

  const enviarMensaje = async () => {
    if (!user || !content.trim()) return;

    try {
      const res = await axiosInstance.post('/api/messages', {
        senderId: user.id,
        receiverId: otherUserId,
        content
      });

      setMessages((prev) => [...prev, res.data]);
      setContent('');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Conversación</h2>

      <div
        ref={chatRef}
        style={{
          height: '300px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '1rem',
          marginBottom: '1rem'
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: '1rem', textAlign: msg.senderId === user?.id ? 'right' : 'left' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                backgroundColor: msg.senderId === user?.id ? '#d1e7dd' : '#f1f1f1'
              }}
            >
              {msg.content}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#888' }}>
              {new Date(msg.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      <button onClick={enviarMensaje}>Enviar</button>
    </div>
  );
}
