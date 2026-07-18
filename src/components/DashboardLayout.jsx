import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MdBook,
  MdScience,
  MdMap,
  MdPeople,
  MdNotifications,
  MdAdminPanelSettings,
  MdMenu,
  MdClose,
  MdMoreHoriz,
  MdDashboard,
  MdExpandMore,
  MdLogout,
  MdPerson,
  MdSettings,
  MdAnalytics,
  MdLibraryBooks,
  MdCampaign
} from 'react-icons/md';
import { FaTemperatureHigh, FaTint } from 'react-icons/fa';
import {
  WiDaySunny,
  WiDayCloudy,
  WiCloudy,
  WiFog,
  WiRainMix,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiNa
} from 'react-icons/wi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeather } from '../hooks/useWeather';
import SkeletonText from './skeletons/SkeletonText';
import ugLogo from '../assets/uglogo.png';
import agricLogo from '../assets/lln.jpeg';
import BottomTabMoreMenu from './BottomTabMoreMenu';

const DashboardLayout = ({ level, activeModule, setActiveModule, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAdmin } = useAuth();
  const { temperature, humidity, description, isLoading, error, lastUpdated } = useWeather();
  const navigate = useNavigate();

  // Map the live weather description (derived from Open-Meteo's WMO code
  // groupings in useWeather.ts) to a specific Weather Icons (react-icons/wi)
  // glyph. Temperature/humidity keep their fixed Fa icons.
  const WEATHER_ICONS = {
    Clear: WiDaySunny,
    'Mainly Clear': WiDaySunny,
    'Partly Cloudy': WiDayCloudy,
    Overcast: WiCloudy,
    Fog: WiFog,
    Drizzle: WiRainMix,
    'Freezing Drizzle': WiRainMix,
    Rain: WiRain,
    'Freezing Rain': WiRain,
    'Rain Showers': WiRain,
    Snow: WiSnow,
    'Snow Grains': WiSnow,
    'Snow Showers': WiSnow,
    Thunderstorm: WiThunderstorm,
    Unknown: WiNa
  };
  const WeatherConditionIcon = WEATHER_ICONS[description] ?? WiNa;

  // Relative "Updated Xm ago" label for the live-data indicator.
  const updatedLabel = (() => {
    if (!lastUpdated) return '';
    const mins = Math.floor((Date.now() - lastUpdated) / 60000);
    if (mins < 1) return 'Updated just now';
    if (mins < 60) return `Updated ${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `Updated ${hrs}h ago`;
    return `Updated ${Math.floor(hrs / 24)}d ago`;
  })();

  const baseMenuItems = [
    { id: 'home', label: 'Home', mobileLabel: 'Home', icon: MdDashboard },
    { id: 'academic', label: 'Academic Hub', mobileLabel: 'Academic', icon: MdBook },
    { id: 'noticeboard', label: 'SRC Noticeboard', mobileLabel: 'Notice', icon: MdNotifications },
    { id: 'logbook', label: 'Lab Logbook', mobileLabel: 'Logbook', icon: MdScience },
    { id: 'map', label: 'Campus Map', mobileLabel: 'Map', icon: MdMap },
    { id: 'faculty', label: 'Faculty', mobileLabel: 'Faculty', icon: MdPeople },
  ];

  const adminMenuItems = [
    { id: 'academic', label: 'Academic Hub', mobileLabel: 'Academic', icon: MdBook },
    { id: 'users', label: 'User Management', mobileLabel: 'Users', icon: MdPeople },
    { id: 'notices', label: 'Notice Management', mobileLabel: 'Notices', icon: MdCampaign },
    { id: 'analytics', label: 'Analytics', mobileLabel: 'Analytics', icon: MdAnalytics },
    { id: 'settings', label: 'Settings', mobileLabel: 'Settings', icon: MdSettings },
    { id: 'catalog', label: 'Course Catalog', mobileLabel: 'Catalog', icon: MdLibraryBooks },
  ];

  const menuItems = isAdmin ? adminMenuItems : baseMenuItems;

  const mobilePrimaryTabs = isAdmin
    ? menuItems.slice(0, 3)
    : menuItems.filter((item) => ['home', 'academic', 'noticeboard', 'logbook'].includes(item.id));

  const mobileOverflowTabs = isAdmin
    ? menuItems.slice(3)
    : menuItems.filter((item) => !['home', 'academic', 'noticeboard', 'logbook'].includes(item.id));

  return (
    <div className="min-h-screen bg-[#F8F9FA] lg:bg-transparent">
      {/* DESKTOP BENTO HEADER */}
      <div className="fixed top-0 left-0 right-0 bg-[#F9FAFB] z-30 border-b border-[#E5E7EB] hidden lg:block lg:p-4">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          {/* LEFT PILL: Logo + Title */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-3 border border-[#E5E7EB] flex-shrink-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <MdClose className="w-5 h-5 text-[#004721]" />
              ) : (
                <MdMenu className="w-5 h-5 text-[#004721]" />
              )}
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-1.5">
                <img src={ugLogo} alt="UG logo" className="h-8 object-contain" />
                <img src={agricLogo} alt="IAAS logo" className="h-8 object-contain" />
              </div>
              <h1 className="text-base font-bold text-[#004721] leading-tight whitespace-nowrap">
                UG School of Agriculture
              </h1>
            </button>
          </div>

          {/* CENTER PILL: Weather */}
          {error ? null : (
            <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-3 border border-[#E5E7EB] flex-1">
                <div className="flex items-center gap-2">
                  <WeatherConditionIcon className="w-5 h-5 text-[#F2A900]" />
                  {isLoading ? (
                    <div className="w-24">
                      <SkeletonText lines={1} lineHeight="1rem" />
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-gray-700">{description}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <FaTemperatureHigh className="w-5 h-5 text-[#004721]" />
                  {isLoading ? (
                    <div className="w-10">
                      <SkeletonText lines={1} lineHeight="1rem" />
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-gray-700">
                      {temperature !== null ? `${Math.round(temperature)}°C` : ''}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <FaTint className="w-5 h-5 text-blue-500" />
                  {isLoading ? (
                    <div className="w-8">
                      <SkeletonText lines={1} lineHeight="1rem" />
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-gray-700">
                      {humidity !== null ? `${Math.round(humidity)}%` : ''}
                    </span>
                  )}
                </div>
                {!isLoading && !error && updatedLabel && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full border-l border-[#E5E7EB] pl-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {updatedLabel}
                  </span>
                )}
              </div>
          )}

          {/* RIGHT PILL: User Profile + Level Badge */}
          {user && (
            <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-3 border border-[#E5E7EB] flex-shrink-0">
              <span className="px-3 py-1 bg-[#E6F4EA] text-[#1E4620] text-sm font-semibold rounded-full">
                Level {level}
              </span>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                >
                  <div className="w-8 h-8 bg-[#004721] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm text-left">
                    <div className="font-medium text-gray-800">{user.name}</div>
                    {isAdmin && <div className="text-xs text-[#F2A900] font-semibold">Admin</div>}
                  </div>
                  <MdExpandMore
                    className={`w-5 h-5 text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md border border-[#E5E7EB] z-50"
                  >
                    <button className="w-full px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors rounded-t-lg text-sm">
                      <MdPerson className="w-4 h-4" />
                      Profile
                    </button>
                    <button className="w-full px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                      <MdSettings className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        navigate('/logout');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50 transition-colors rounded-b-lg border-t border-[#E5E7EB] text-sm"
                    >
                      <MdLogout className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE/TABLET HEADER */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 shadow-sm lg:hidden">
        <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <MdClose className="w-6 h-6" /> : <MdMenu className="w-6 h-6" />}
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 flex-1 min-w-0 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-1.5 shrink-0">
              <img src={ugLogo} alt="UG logo" className="h-8 object-contain" />
              <img src={agricLogo} alt="IAAS logo" className="h-8 object-contain" />
            </div>
            <h1 className="text-sm md:text-base font-bold text-[#00592D] leading-tight break-words">
              UG School of Agriculture
            </h1>
          </button>
          <span className="px-2 py-1 bg-[#E6F4EA] text-[#1E4620] text-xs font-semibold rounded-full whitespace-nowrap">
            L{level}
          </span>
        </div>
      </div>

      <div className="flex pt-[73px] lg:pt-[120px] pb-[calc(72px+env(safe-area-inset-bottom))] md:pb-0 lg:pb-0">
        <motion.aside
          initial={false}
          animate={{
            width: sidebarOpen ? 280 : 0,
            opacity: sidebarOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="hidden md:block fixed left-0 top-[73px] bottom-0 bg-white border-r border-gray-200 overflow-hidden z-20 lg:bg-white/90 lg:backdrop-blur-sm"
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                    ? 'bg-[#00592D] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </motion.aside>

        <main
          className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-[280px]' : 'md:ml-0'
            }`}
        >
          <div className="p-3 lg:p-4">
            {children}
          </div>
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur-sm pb-[calc(0.35rem+env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-4">
          {mobilePrimaryTabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveModule(item.id);
                  setShowMoreMenu(false);
                }}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 border-t-2 transition-colors ${isActive
                  ? 'border-[#00592D] text-[#00592D]'
                  : 'border-transparent text-gray-500 hover:text-[#00592D]'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-semibold leading-none">{item.mobileLabel || item.label}</span>
              </button>
            );
          })}

          {(!isAdmin || mobileOverflowTabs.length > 0) && (
            <button
              type="button"
              onClick={() => setShowMoreMenu(true)}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 border-t-2 transition-colors ${showMoreMenu || mobileOverflowTabs.some((item) => item.id === activeModule)
                ? 'border-[#00592D] text-[#00592D]'
                : 'border-transparent text-gray-500 hover:text-[#00592D]'
                }`}
            >
              <MdMoreHoriz className="w-5 h-5" />
              <span className="text-sm font-semibold leading-none">More</span>
            </button>
          )}
        </div>
      </nav>

      <BottomTabMoreMenu
        isOpen={showMoreMenu}
        onClose={() => setShowMoreMenu(false)}
        items={mobileOverflowTabs}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
      />
    </div>
  );
};

export default DashboardLayout;
