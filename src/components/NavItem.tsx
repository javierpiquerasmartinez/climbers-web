import { Link } from 'react-router-dom';

type NavItemProps = {
  to: string;
  children: React.ReactNode;
};

export default function NavItem({ to, children }: NavItemProps) {
  return (
    <Link
      to={to}
      className="relative group text-gray-700 hover:text-(--color-accent) transition font-medium"
    >
      {children}
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-(--color-accent) transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
