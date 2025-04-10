import { Link } from "react-router-dom";
import { User } from "../context/UserContext";
import axiosInstance from "../lib/axios";
import FavoriteButton from "./FavoriteButton";

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
            <FavoriteButton isFavorite={isFavorite} handleFavoriteClick={handleFavoriteClick} />
          }
        </div>
      </div>
    </Link>
  )
}