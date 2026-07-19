import { AnimatePresence, motion } from 'framer-motion';
import { MdClose, MdLogout } from 'react-icons/md';

const BottomTabMoreMenu = ({ isOpen, onClose, items, activeModule, setActiveModule, onLogout }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close more menu"
            className="fixed inset-0 z-30 bg-black/35 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed left-0 right-0 bottom-0 z-40 bg-white rounded-t-2xl border-t border-gray-200 shadow-2xl md:hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
          >
            <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-gray-100">
              <h3 className="text-base font-semibold text-[#00592D]">More Tools</h3>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] space-y-1.5">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveModule(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                        ? 'bg-[#00592D] text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {onLogout && (
              <>
                <div className="mx-4 my-2 border-t border-gray-200" />
                <div className="px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors bg-gray-50 text-red-600 hover:bg-red-50"
                  >
                    <MdLogout className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomTabMoreMenu;
