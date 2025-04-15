import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axiosInstance from '../lib/axios';
import { FaInstagram } from 'react-icons/fa';
import ExpandableText from './ExpandableText';

type UserPublico = {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  location?: string;
  climbingStyles: any;
  level?: any;
  averageRating?: number;
  totalReviews?: number;
  instagramUrl: string;
  bio: string;
  languages: any;
  equipmentAvailable: any;
};

type Review = {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
};


export default function PerfilPublico() {

  const { id } = useParams();
  const [user, setUser] = useState<UserPublico | null>(null);
  const token = localStorage.getItem('googleToken');

  const { user: currentUser } = useUser();
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviewSent, setReviewSent] = useState(false);

  if (!token) return;
  useEffect(() => {
    axiosInstance.get(`/api/users/${id}`)
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const yaValorado = reviews.some(r => r.author.id === currentUser?.id);

  useEffect(() => {
    const token = localStorage.getItem('googleToken');
    if (!token) return;

    // fetch usuario
    axiosInstance.get(`/api/users/${id}`).then(res => setUser(res.data)).catch(console.error);

    // fetch reviews
    axiosInstance.get(`/api/reviews/${id}`).then(res => setReviews(res.data)).catch(console.error);
  }, [id]);

  const enviarReview = async () => {
    if (!currentUser || !user) return;

    try {
      const response = await axiosInstance.post('/api/reviews', {
        authorId: currentUser.id,
        targetId: user.id,
        rating: newReview.rating,
        comment: newReview.comment
      });

      const newReviewData = {
        ...response.data,
        author: {
          id: currentUser.id,
          name: currentUser.name,
          avatarUrl: currentUser.avatarUrl
        }
      }

      setReviews(prev => [...prev, newReviewData]);
      setReviewSent(true);
    } catch (error) {
      console.error('Error al enviar review:', error);
    }
  };

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Info básica */}
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        {user.avatarUrl && (
          <img
            src={user.avatarUrl}
            alt="avatar"
            className="w-24 h-24 mx-auto rounded-full shadow-md mb-4 object-cover"
          />
        )}
        <h2 className="text-2xl font-semibold text-gray-800">
          {user.name}
        </h2>
        <p className="text-gray-500">{user.role}</p>
        {user.bio && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Sobre mí</h3>
            <ExpandableText text={user.bio} />
          </div>
        )}
        {user.instagramUrl && (
          <>
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Redes Sociales</h3>
              <a
                href={user.instagramUrl.startsWith('http') ? user.instagramUrl : `https://${user.instagramUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-3xl flex justify-center"
              >
                <FaInstagram className="text-pink-600" />
              </a>
            </div>
          </>
        )}

        <div className="mt-4 text-sm text-gray-700 space-y-1">
          {user.languages && user.languages.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Idiomas</h3>
              <ul className="flex flex-wrap gap-2 justify-center mt-2">
                {user.languages.map((lang: any) => (
                  <li
                    key={'languages-' + lang.id}
                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full shadow-sm"
                  >
                    {lang.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {user.equipmentAvailable && user.equipmentAvailable.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Material disponible</h3>
              <ul className="flex flex-wrap gap-2 justify-center mt-2">
                {user.equipmentAvailable.map((item: any) => (
                  <li
                    key={item.id}
                    className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full shadow-sm"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {user.location && <p className="mt-4">📍 <span className="font-medium">{user.location}</span></p>}
          {user.level && <p>🎯 Nivel: <span className="font-medium">{user.level.name.replace('_', ' ').toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())}</span></p>}
          {user.climbingStyles.length > 0 && (
            <p>🧗 Estilos: {user.climbingStyles.map((style: { name: string; }) => style.name.replace('_', ' ').toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())).join(', ')}</p>
          )}
          {user.averageRating !== undefined && (
            <p>⭐ Valoración media: {user.averageRating?.toFixed(1)} ({user.totalReviews} valoraciones)</p>
          )}
        </div>

        {currentUser?.id !== user.id && (
          <Link to={`/mensajes/${user.id}`}>
            <button className="mt-6 bg-(--color-accent) text-white px-4 py-2 rounded-lg transition hover:-translate-y-0.5">
              Enviar mensaje
            </button>
          </Link>
        )}
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Valoraciones</h3>

        {reviews.length === 0 && <p className="text-gray-500">Este escalador aún no tiene valoraciones.</p>}

        <ul className="space-y-4">
          {reviews.map((review) => {
            const esPropia = review.author.id === currentUser?.id;

            return (
              <li
                key={review.id}
                className={`border rounded-md p-4 ${esPropia
                  ? 'bg-blue-50 border-blue-300 shadow-sm'
                  : 'bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {review.author.avatarUrl && (
                    <img
                      src={review.author.avatarUrl}
                      alt="autor"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <div className="text-sm">
                    <p className="font-medium">{review.author.name}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(review.createdAt).toLocaleDateString()}
                      {esPropia && ' · Tu valoración'}
                    </p>
                  </div>
                  <div className="ml-auto text-yellow-500 font-bold text-sm">
                    ⭐ {review.rating}/5
                  </div>
                </div>
                {review.comment && <p className="text-sm text-gray-700">{review.comment}</p>}
              </li>
            );
          })}
        </ul>

      </div>
      {currentUser && currentUser.id !== user.id && !yaValorado && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 border border-blue-100">
          <h4 className="text-lg font-semibold text-gray-800">Dejar una valoración</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Puntuación:</label>
            <select
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: parseInt(e.target.value) })
              }
              className="w-full border rounded-md px-3 py-2"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} estrella{n > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comentario (opcional):</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              rows={3}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Comparte tu experiencia..."
            />
          </div>

          <div className="text-right">
            <button
              onClick={enviarReview}
              className="bg-(--color-accent) text-white px-4 py-2 rounded-lg transition hover:-translate-y-0.5"
            >
              Enviar valoración
            </button>
          </div>
        </div>
      )}

      {reviewSent && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md text-sm">
          ✅ Valoración enviada con éxito.
        </div>
      )}

    </div>
  );

}
