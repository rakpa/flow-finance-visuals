
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Home, 
  Plus, 
  PlusCircle, 
  DollarSign, 
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  closeSidebar?: () => void;
}

const Navbar = ({ closeSidebar }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Update current path when location changes
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (closeSidebar) {
      closeSidebar();
    }
  };

  return (
    <nav className="flex-1 overflow-auto py-6 px-4">
      <ul className="space-y-2">
        <li>
          <NavItem 
            icon={Home} 
            text="Dashboard" 
            active={currentPath === '/'} 
            onClick={() => handleNavigate('/')}
          />
        </li>
        <li>
          <NavItem 
            icon={Plus} 
            text="Transactions" 
            active={currentPath === '/transactions'} 
            onClick={() => handleNavigate('/transactions')}
          />
        </li>
        <li>
          <NavItem 
            icon={Tag} 
            text="Categories" 
            active={currentPath === '/categories'} 
            onClick={() => handleNavigate('/categories')}
          />
        </li>
      </ul>
    </nav>
  );
};

interface NavItemProps {
  icon: React.ElementType;
  text: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon: Icon, text, active, onClick }: NavItemProps) => {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all",
        active 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{text}</span>
    </button>
  );
};

export default Navbar;
