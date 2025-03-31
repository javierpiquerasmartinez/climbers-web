import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axiosInstance from '../lib/axios';

type UserPublico = {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  location?: string;
  climbingStyles: string[];
  level?: string;
  averageRating?: number;
  totalReviews?: number;
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
    <div style={{ padding: '2rem' }}>
      <h2>{user.name}</h2>

      {user.avatarUrl && (
        <img src={user.avatarUrl} alt="avatar" width={100} style={{ borderRadius: '50%' }} />
      )}

      <p><strong>Rol:</strong> {user.role}</p>
      <p><strong>Ubicación:</strong> {user.location}</p>
      <p><strong>Nivel:</strong> {user.level}</p>
      <p><strong>Estilos:</strong> {user.climbingStyles.join(', ')}</p>
      <p><strong>⭐ Valoración media:</strong> {user.averageRating?.toFixed(1) ?? 'Sin valoraciones'} ({user.totalReviews} valoraciones)</p>

      <hr style={{ margin: '2rem 0' }} />
      <h3>Valoraciones recibidas ({reviews.length})</h3>

      {reviews.length === 0 && <p>Este escalador aún no tiene valoraciones.</p>}

      <ul>
        {reviews.map(review => (
          <li key={review.id} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {review.author.avatarUrl && (
                <img src={review.author.avatarUrl} alt="avatar" width={40} style={{ borderRadius: '50%' }} />
              )}
              <strong>{review.author.name}</strong> – ⭐ {review.rating}/5
            </div>
            {review.comment && <p style={{ marginLeft: '3rem' }}>{review.comment}</p>}
          </li>
        ))}
      </ul>

      {currentUser && currentUser.id !== user.id && !yaValorado && !reviewSent && (
        <div style={{ marginTop: '2rem' }}>
          <h4>¿Quieres dejar una valoración?</h4>
          <label>
            Puntuación:
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
            >
              {[5, 4, 3, 2, 1].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>

          <br /><br />

          <label>
            Comentario (opcional):
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              rows={3}
              style={{ width: '100%' }}
            />
          </label>

          <br />
          <button onClick={enviarReview}>Enviar valoración</button>
        </div>
      )}

      {reviewSent && <p>✅ ¡Valoración enviada con éxito!</p>}

      {currentUser && currentUser.id !== user.id && (
        <Link to={`/mensajes/${user.id}`}>
          <button>Enviar mensaje</button>
        </Link>
      )}

    </div>

  );
}
