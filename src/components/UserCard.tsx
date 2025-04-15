import { Link } from "react-router-dom";
import { User, useUser } from "../context/UserContext";
import axiosInstance from "../lib/axios";
import FavoriteButton from "./FavoriteButton";

type Props = {
  user: User;
  isFavorite: boolean;
  onToggleFavorite: (userId: string, add: boolean) => void;
};

export default function UserCard({ user, isFavorite, onToggleFavorite }: Props) {

  const { user: self } = useUser();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (isFavorite) {
        await axiosInstance.delete(`/api/favorites/${user.id}`);
        onToggleFavorite(user.id, false);
        return
      }
      await axiosInstance.post(`/api/favorites/${user.id}`);
      onToggleFavorite(user.id, true);
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
    }
  };

  return (
    <Link className="flex-1 h-full" to={`/usuarios/${user.id}`} key={user.id}>
      <div className="h-full p-4 border rounded-lg shadow-sm hover:shadow-md transition hover:-translate-y-1 flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <img src={user.avatarUrl || 'logo.png'} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="font-semibold text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-500">{user.location}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">🎯 Nivel: <span className="font-medium">{user.level?.name.charAt(0) + user.level?.name.slice(1).toLowerCase().replace('_', ' ') || 'N/A'}</span></p>
        <p className="text-sm text-gray-600">🧗 Estilos: {user.climbingStyles.map(style => style.name.replace('_', ' ').toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())).join(', ')}</p>
        <div className="flex justify-between items-center">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full w-fit">
            {user.role}
          </span>
          {
            user.id !== self?.id &&
            <FavoriteButton isFavorite={isFavorite} handleFavoriteClick={handleFavoriteClick} />
          }
        </div>
      </div>
    </Link>
  )
}