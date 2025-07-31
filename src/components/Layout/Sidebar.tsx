import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Cloud, 
  AlertTriangle, 
  MessageCircle, 
  Users, 
  Settings,
  BarChart3,
  MapPin,
  User,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', icon: Home, href: '/dashboard' }
    ];

    switch (user?.role) {
      case 'farmer':
        return [
          ...baseItems,
          { name: 'Weather', icon: Cloud, href: '/weather' },
          { name: 'Alerts', icon: AlertTriangle, href: '/alerts' },
          { name: 'Advisories', icon: MessageCircle, href: '/advisories' },
          { name: 'Profile', icon: User, href: '/profile' }
        ];
      case 'officer':
        return [
          ...baseItems,
          { name: 'Region Stats', icon: BarChart3, href: '/region-stats' },
          { name: 'Send Alerts', icon: AlertTriangle, href: '/send-alerts' },
          { name: 'Weather Data', icon: Cloud, href: '/weather-data' },
          { name: 'Farmers', icon: Users, href: '/farmers' },
          { name: 'Profile', icon: User, href: '/profile' }
        ];
      case 'admin':
        return [
          ...baseItems,
          { name: 'System Stats', icon: BarChart3, href: '/system-stats' },
          { name: 'User Management', icon: Users, href: '/users' },
          { name: 'System Health', icon: Settings, href: '/system-health' },
          { name: 'Locations', icon: MapPin, href: '/locations' },
          { name: 'Profile', icon: User, href: '/profile' }
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 lg:hidden z-20"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <nav className="mt-4 px-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`
                  flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;