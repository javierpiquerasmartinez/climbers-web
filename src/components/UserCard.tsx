import { Link } from "react-router-dom";
import { User } from "../context/UserContext";
import axiosInstance from "../lib/axios";

type Props = {
  user: User;
  isFavorite: boolean;
  onToggleFavorite: (userId: string, add: boolean) => void;
};

export default function UserCard({ user, isFavorite, onToggleFavorite }: Props) {

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (isFavorite) {
        await axiosInstance.delete(`/api/favorites/${user.id}`);
        onToggleFavorite(user.id, false);
      } else {
        await axiosInstance.post(`/api/favorites/${user.id}`);
        onToggleFavorite(user.id, true);
      }
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
    }
  };

  return (
    <Link to={`/usuarios/${user.id}`} key={user.id}>
      <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition hover:-translate-y-1 bg-white flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <img src={user.avatarUrl || 'logo.png'} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="font-semibold text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-500">{user.location}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">🎯 Nivel: <span className="font-medium">{user.level || 'N/A'}</span></p>
        <p className="text-sm text-gray-600">🧗 Estilos: {user.climbingStyles.join(', ')}</p>
        <div className="flex justify-between items-center">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full w-fit">
            {user.role}
          </span>
          {
            <>
              <button onClick={handleFavoriteClick} className="text-red-500">
                {isFavorite ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M12 .587l3.668 7.568L24 9.167l-6,5.848L19,24l-7-3.688L5,24l1-8L0,9l8-.845z" />
                  </svg>
                )}
              </button></>
          }
        </div>
      </div>
    </Link>
  )
}