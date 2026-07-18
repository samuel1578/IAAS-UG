import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import AcademicHub from '../components/modules/AcademicHub';
import LabLogbook from '../components/modules/LabLogbook';
import CampusMap from '../components/modules/CampusMap';
import Faculty from '../components/modules/Faculty';
import SRCNoticeboard from '../components/modules/SRCNoticeboard';
import DashboardHome from '../components/modules/DashboardHome';
import CourseMaterialsNavigator from '../components/admin/CourseMaterialsNavigator';
import CourseCatalogManager from '../components/admin/CourseCatalogManager';
import UserManagement from '../components/admin/UserManagement';
import AnalyticsPanel from '../components/admin/AnalyticsPanel';
import SettingsPanel from '../components/admin/SettingsPanel';
import NoticeManagement from '../components/admin/NoticeManagement';
import { useAuth } from '../contexts/AuthContext';
import Skeleton from '../components/skeletons/Skeleton';
import SkeletonText from '../components/skeletons/SkeletonText';
import SkeletonAvatar from '../components/skeletons/SkeletonAvatar';
import desktopHero from '../assets/newhor.jpg';
import mobileHero from '../assets/mobbar.jpg';

// Skeleton shell mimicking DashboardLayout's header + sidebar, shown briefly
// while the authenticated user's profile is still being resolved. The main
// content area is intentionally left empty — each module renders its own
// loading skeleton once it actually mounts.
const DashboardShellSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* DESKTOP HEADER */}
      <div className="fixed top-0 left-0 right-0 bg-[#F9FAFB] z-30 border-b border-[#E5E7EB] hidden lg:block lg:p-4">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          {/* LEFT PILL: Logo + Title */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-3 border border-[#E5E7EB] flex-shrink-0">
            <SkeletonAvatar size={32} />
            <Skeleton width="11rem" height="1rem" rounded="md" />
          </div>

          {/* CENTER PILL: Weather */}
          <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-3 border border-[#E5E7EB] flex-1">
            <Skeleton width="7rem" height="1rem" rounded="md" />
            <Skeleton width="4rem" height="1rem" rounded="md" />
            <Skeleton width="3rem" height="1rem" rounded="md" />
          </div>

          {/* RIGHT PILL: User Profile + Level Badge */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-3 border border-[#E5E7EB] flex-shrink-0">
            <Skeleton width="5rem" height="1.25rem" rounded="full" />
            <SkeletonAvatar size={32} />
          </div>
        </div>
      </div>

      {/* MOBILE HEADER (simplified mirror of real mobile header) */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 shadow-sm lg:hidden">
        <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 gap-3">
          <Skeleton width="1.5rem" height="1.5rem" rounded="md" />
          <Skeleton width="11rem" height="1rem" rounded="md" />
          <Skeleton width="2.5rem" height="1.25rem" rounded="full" />
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="hidden md:block fixed left-0 top-[73px] bottom-0 bg-white border-r border-gray-200 overflow-hidden z-20 lg:bg-white/90 lg:backdrop-blur-sm w-[280px]">
        <nav className="p-4 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg">
              <Skeleton width="1.25rem" height="1.25rem" rounded="md" />
              <Skeleton width="60%" height="1rem" rounded="md" />
            </div>
          ))}
        </nav>
      </div>

      {/* MOBILE BOTTOM TABS (simplified) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur-sm pb-[calc(0.35rem+env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center gap-1 py-2.5">
              <Skeleton width="1.25rem" height="1.25rem" rounded="md" />
            </div>
          ))}
        </div>
      </nav>

      {/* MAIN — intentionally blank during this window */}
      <div className="flex pt-[73px] lg:pt-[120px]">
        <main className="flex-1 md:ml-[280px]">
          <div className="p-3 lg:p-4"></div>
        </main>
      </div>
    </div>
  );
};

const Dashboard = ({ highlights, onApproveHighlight, onRejectHighlight, removeHighlight }) => {
  const { level } = useParams();
  const { user, isAdmin, userProfile, isLoading } = useAuth();

  // Default module: students land on the personalized Home module; admins land
  // on the Academic Hub (Course Materials Navigator). Set ONCE via the
  // initializer so it only applies to the initial render and never hijacks a
  // manual navigation click (e.g. clicking "Academic Hub" in the sidebar).
  const [activeModule, setActiveModule] = useState(() => (isAdmin ? 'academic' : 'home'));

  // Profile/dashboard data isn't ready until userProfile has resolved
  // AND the full auth check has completed. Waiting on !isLoading guarantees
  // isAdmin is in its final state, preventing a Home -> admin-module flicker.
  const isDataReady = userProfile !== null && !isLoading;

  const renderModule = () => {
    const modules = {
      home: <DashboardHome onNavigate={setActiveModule} />,
      academic: isAdmin ? <CourseMaterialsNavigator /> : <AcademicHub level={level} />,
      logbook: <LabLogbook />,
      map: <CampusMap />,
      faculty: <Faculty />,
      noticeboard: <SRCNoticeboard />,
      users: <UserManagement />,
      analytics: <AnalyticsPanel />,
      settings: <SettingsPanel />,
      catalog: <CourseCatalogManager />,
      notices: <NoticeManagement />
    };

    const moduleVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule}
          variants={moduleVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {modules[activeModule]}
        </motion.div>
      </AnimatePresence>
    );
  };

  if (!isDataReady) {
    return <DashboardShellSkeleton />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Fixed Background with Ken Burns Effect - Desktop Only */}
      <motion.div
        aria-hidden="true"
        initial={{ scale: 1.1, opacity: 0.84 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 8, ease: 'easeOut' }}
        className="hidden lg:block fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: `url(${desktopHero})`,
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Golden Radial Gradient Overlay - Desktop Only */}
      <div
        aria-hidden="true"
        className="hidden lg:block fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 28%, rgba(242,169,0,0.1), transparent 58%)'
        }}
      />

      {/* Mobile Background - Normal Background */}
      <motion.div
        aria-hidden="true"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: 'easeOut' }}
        className="lg:hidden absolute inset-0 -z-10 overflow-hidden"
      >
        <picture>
          <source media="(min-width: 768px)" srcSet={desktopHero} />
          <img src={mobileHero} alt="field background" className="w-full h-full object-cover absolute inset-0" />
        </picture>
      </motion.div>

      {/* Mobile Radial Gradient Overlay */}
      <div
        aria-hidden="true"
        className="lg:hidden absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 28%, rgba(242,169,0,0.1), transparent 58%)'
        }}
      />

      {/* Dashboard Content */}
      <DashboardLayout
        level={level}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
      >
        {renderModule()}
      </DashboardLayout>
    </div>
  );
};

export default Dashboard;
