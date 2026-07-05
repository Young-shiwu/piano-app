import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const items = [
  { to: '/', label: '首页', icon: '🏠', end: true },
  { to: '/library', label: '曲谱库', icon: '🎼', end: false },
  { to: '/me', label: '我的', icon: '👤', end: false },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map((it) => (
        <NavLink key={it.to} to={it.to} end={it.end}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon">{it.icon}</span>
          <span className="nav-label">{it.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
