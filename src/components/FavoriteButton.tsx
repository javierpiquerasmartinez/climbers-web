import { Heart } from 'lucide-react';
import { useState } from 'react';

export default function FavoriteButton({ isFavorite, handleFavoriteClick }: { isFavorite: boolean, handleFavoriteClick: (e: React.MouseEvent) => Promise<void> }) {
  const [animate, setAnimate] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    handleFavoriteClick(e);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 200); // dura 200ms
  };

  return (
    <button
      onClick={toggleFavorite}
      aria-label="Marcar como favorito"
      className='p-2 rounded-full transition-colors duration-300 ease-in-out hover:bg-pink-100'
    >
      <Heart
        className={`w-5 h-5 transition-all duration-200 ease-in-out transform ${animate ? 'scale-125' : 'scale-100'
          } ${isFavorite
            ? 'fill-pink-500 stroke-pink-500'
            : 'stroke-gray-400 hover:stroke-pink-500'
          }`}
      />
    </button>
  );
}
