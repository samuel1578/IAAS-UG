import { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import GrowthStages from '../components/GrowthStages';
import QuickTools from '../components/QuickTools';
import StudentHighlights from '../components/StudentHighlights';
import Announcements from '../components/Announcements';
import Footer from '../components/Footer';
import {
  quickToolsData,
  announcementsData,
  footerData,
  highlightsData
} from '../data/homeData';

const LandingPage = () => {
  const [showLogoutNotification, setShowLogoutNotification] = useState(false);

  // Check for logout success and show notification
  useEffect(() => {
    const logoutSuccess = localStorage.getItem('logoutSuccess');
    if (logoutSuccess === 'true') {
      setShowLogoutNotification(true);
      localStorage.removeItem('logoutSuccess');
      // Auto-hide notification after 3 seconds
      const timer = setTimeout(() => setShowLogoutNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);
  return (
    <main>
      {/* Logout Success Notification */}
      {showLogoutNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slideIn">
          <span>✓</span>
          <p>You have been successfully logged out</p>
        </div>
      )}

      <HeroSection />
      <div className="h-2 w-full bg-[#1B4332]" aria-hidden="true" />
      <GrowthStages />
      <QuickTools tools={quickToolsData} />
      <StudentHighlights highlights={highlightsData} />
      <Announcements announcements={announcementsData} />
      <Footer footer={footerData} />
    </main>
  );
};

export default LandingPage;
