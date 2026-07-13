import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import AcademicHub from '../components/modules/AcademicHub';
import LabLogbook from '../components/modules/LabLogbook';
import CampusMap from '../components/modules/CampusMap';
import Faculty from '../components/modules/Faculty';
import SRCNoticeboard from '../components/modules/SRCNoticeboard';
import CourseMaterialsNavigator from '../components/admin/CourseMaterialsNavigator';
import CourseCatalogManager from '../components/admin/CourseCatalogManager';
import UserManagement from '../components/admin/UserManagement';
import AnalyticsPanel from '../components/admin/AnalyticsPanel';
import SettingsPanel from '../components/admin/SettingsPanel';
import { useAuth } from '../contexts/AuthContext';
import desktopHero from '../assets/newhor.jpg';
import mobileHero from '../assets/mobbar.jpg';

const Dashboard = ({ highlights, onApproveHighlight, onRejectHighlight, removeHighlight }) => {
  const { level } = useParams();
  const { user, isAdmin } = useAuth();
  const [activeModule, setActiveModule] = useState('academic');

  const renderModule = () => {
    const modules = {
      academic: isAdmin ? <CourseMaterialsNavigator /> : <AcademicHub level={level} />,
      logbook: <LabLogbook />,
      map: <CampusMap />,
      faculty: <Faculty />,
      noticeboard: <SRCNoticeboard />,
      users: <UserManagement />,
      analytics: <AnalyticsPanel />,
      settings: <SettingsPanel />,
      catalog: <CourseCatalogManager />
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
