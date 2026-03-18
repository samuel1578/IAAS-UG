import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import AuthForm from './AuthForm';
import agricLogo from '../../assets/lln.jpeg';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedLevel?: string;
}

const AuthModal = ({ isOpen, onClose, onSuccess, selectedLevel }: AuthModalProps) => {
  const [isSignUp, setIsSignUp] = useState(true);

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MdClose className="w-6 h-6" />
              </button>

              {/* Header */}
              <div className="text-center pt-8 pb-4 px-8">
                <div className="w-16 h-16 bg-[#00592D] rounded-full flex items-center justify-center mx-auto mb-4">
                  <img
                    src={agricLogo}
                    alt="UG Agriculture Logo"
                    className="w-12 h-12 object-contain"
                  />
                </div>

                {selectedLevel && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#F2A900] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4"
                  >
                    Access Level {selectedLevel} Resources
                  </motion.div>
                )}

                <h1 className="text-2xl font-bold text-[#00592D] mb-2">
                  UG School of Agriculture
                </h1>
                <p className="text-gray-600 text-sm">
                  Student Hub Authentication
                </p>
              </div>

              {/* Auth Form */}
              <div className="px-8 pb-8">
                <AuthForm
                  isSignUp={isSignUp}
                  onToggleMode={handleToggleMode}
                  onSuccess={handleSuccess}
                />
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-8 py-6 text-center rounded-b-2xl">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                  <br />
                  Your account will be reviewed for verification.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;