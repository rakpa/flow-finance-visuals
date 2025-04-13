
import { useState } from 'react';
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
  const [currentSection, setCurrentSection] = useState('dashboard');

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
    if (closeSidebar) {
      closeSidebar();
    }

    // Scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="flex-1 overflow-auto py-6 px-4">
      <ul className="space-y-2">
        <li>
          <NavItem 
            icon={Home} 
            text="Dashboard" 
            active={currentSection === 'dashboard'} 
            onClick={() => handleNavigate('dashboard')}
          />
        </li>
        <li>
          <NavItem 
            icon={Plus} 
            text="Add Transaction" 
            active={currentSection === 'add-transaction'} 
            onClick={() => handleNavigate('add-transaction')}
          />
        </li>
        <li>
          <NavItem 
            icon={Tag} 
            text="Categories" 
            active={currentSection === 'categories'} 
            onClick={() => handleNavigate('categories')}
          />
        </li>
        <li>
          <NavItem 
            icon={BarChart} 
            text="Reports" 
            active={currentSection === 'reports'} 
            onClick={() => handleNavigate('reports')}
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
