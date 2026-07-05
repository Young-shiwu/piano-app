import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Library from './pages/Library';
import Detail from './pages/Detail';
import Reader from './pages/Reader';
import Practice from './pages/Practice';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';

// 只有主页面显示底部导航；详情/看谱/练习是全屏子页面
const NAV_PATHS = ['/', '/library', '/me'];

function Shell() {
  const { pathname } = useLocation();
  const showNav = NAV_PATHS.includes(pathname);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/me" element={<Profile />} />
        <Route path="/score/:id" element={<Detail />} />
        <Route path="/score/:id/reader" element={<Reader />} />
        <Route path="/score/:id/practice" element={<Practice />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}
