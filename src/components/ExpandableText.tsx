import { useState } from 'react';

interface ExpandableTextProps {
  text: string;
  lines?: number; // número de líneas antes de colapsar
  className?: string; // clases opcionales
}

export default function ExpandableText({ text, lines = 4, className = '' }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  return (
    <div>
      <p
        className={`text-justify text-gray-600 text-sm leading-relaxed whitespace-pre-line transition-all duration-300 ${expanded ? '' : `line-clamp-${lines}`
          } ${className}`}
      >
        {text}
      </p>

      {text.length > 200 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs font-medium text-blue-500 hover:underline"
        >
          {expanded ? 'Ver menos' : 'Ver más'}
        </button>
      )}
    </div>
  );
}
