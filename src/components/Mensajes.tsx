import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext.tsx';
import axiosInstance from '../lib/axios';
import { Link } from 'react-router-dom';

type Message = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
};

type OtherUser = {
  name: string;
  avatarUrl?: string;
};

export default function Mensajes() {
  const { id: otherUserId } = useParams();
  const { user } = useUser();
  const location = useLocation();
  const locationState = location.state as OtherUser | undefined;

  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [otherUser, setOtherUser] = useState<OtherUser | null>(
    locationState ?? null
  );

  const chatRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  useEffect(() => {
    if (!user || !otherUserId) return;

    axiosInstance
      .get(`/api/messages?user1=${user.id}&user2=${otherUserId}`)
      .then((res) => setMessages(res.data))
      .catch(console.error);
  }, [user, otherUserId]);

  // Scroll to bottom
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Fetch other user if not passed in state
  useEffect(() => {
    if (!otherUser && otherUserId) {
      axiosInstance
        .get(`/api/users/${otherUserId}`)
        .then((res) => setOtherUser({ name: res.data.name, avatarUrl: res.data.avatarUrl }))
        .catch(console.error);
    }
  }, [otherUser, otherUserId]);

  const enviarMensaje = async () => {
    if (!user || !content.trim()) return;

    try {
      const res = await axiosInstance.post('/api/messages', {
        senderId: user.id,
        receiverId: otherUserId,
        content,
      });

      setMessages((prev) => [...prev, res.data]);
      setContent('');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 h-[80vh] flex flex-col">
      {/* Cabecera con nombre y avatar */}
      <Link
        to={`/usuarios/${otherUserId}`}
        className="flex items-center gap-3 mb-4 hover:underline hover:text-green-600 transition"
      >
        {otherUser?.avatarUrl ? (
          <img
            src={otherUser.avatarUrl}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
            {otherUser?.name?.[0] ?? '?'}
          </div>
        )}
        <h2 className="text-xl font-semibold">{otherUser?.name ?? '...'}</h2>
      </Link>


      {/* Mensajes */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto bg-gray-100 rounded-lg p-4 space-y-4"
      >
        {messages.map((msg) => {
          const isOwn = msg.senderId === user?.id;
          return (
            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div>
                <div
                  className={`inline-block px-4 py-2 rounded-2xl text-sm ${isOwn
                    ? 'bg-green-100 text-gray-800'
                    : 'bg-white text-gray-800 border'
                    }`}
                >
                  {msg.content}
                </div>
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input de mensaje */}
      <div className="mt-4 flex items-center gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          className="flex-1 border rounded-md p-2 resize-none focus:outline-none focus:ring focus:ring-green-200"
          placeholder="Escribe un mensaje..."
        />
        <button
          onClick={enviarMensaje}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
