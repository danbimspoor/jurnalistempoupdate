import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-red-600/30 selection:text-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="h-10 border-t border-white/5 px-8 flex items-center justify-between text-[10px] font-medium text-white/30 bg-black shrink-0">
        <div>&copy; 2024 JurnalisTempo Update. Seluruh hak cipta dilindungi.</div>
        <div className="flex gap-6 uppercase tracking-tighter">
          <span>Deploy: CF Pages</span>
          <span>DB: D1 Instance v2</span>
          <span>Region: ID-JKT-1</span>
        </div>
      </footer>
    </div>
  );
}
