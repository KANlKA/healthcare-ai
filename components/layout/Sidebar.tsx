import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Info, Shield } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/profiles', label: 'Profiles', icon: Users },
  { href: '/about', label: 'About', icon: Info },
  { href: '/about/safety', label: 'Safety', icon: Shield }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-gray-50 p-4">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                isActive 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}