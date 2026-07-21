import { Outlet } from 'react-router-dom';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { CheckInProvider } from '../../context/CheckInContext';
import { UserEmotionsProvider } from '../../context/UserEmotionsContext';
import GrainOverlay from '../ui/GrainOverlay';
import ThemeToggle from '../ui/ThemeToggle';
import BrandedLoadingScreen from '../ui/BrandedLoadingScreen';
import SidebarNav from './SidebarNav';
import BottomNav from './BottomNav';
import MobileBrandHeader from './MobileBrandHeader';
import CheckInOverlay from '../check-in/CheckInOverlay';

function LoadingScreen() {
  return <BrandedLoadingScreen message="Cargando aplicación..." />;
}

function AppShellInner() {
  const { loading } = useAuthGuard();

  if (loading) return <LoadingScreen />;

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      <GrainOverlay />
      <SidebarNav />

      <div className="flex-1 flex flex-col min-w-0 lg:max-h-screen lg:overflow-hidden">
        <div className="hidden lg:flex justify-end p-4 shrink-0">
          <ThemeToggle />
        </div>

        <MobileBrandHeader />

        <main className="flex-1 overflow-y-auto pb-28 lg:pb-8">
          <div className="w-full max-w-[480px] lg:max-w-6xl mx-auto px-0 lg:px-8">
            <Outlet />
          </div>
        </main>

        <BottomNav />
      </div>

      <CheckInOverlay />
    </div>
  );
}

export default function AppShell() {
  return (
    <CheckInProvider>
      <UserEmotionsProvider>
        <AppShellInner />
      </UserEmotionsProvider>
    </CheckInProvider>
  );
}
