import { useEffect } from 'react';
import { MdCheckCircle } from 'react-icons/md';

// Minimal in-app toast following the IAAS-UG brand system (§6 of AGENTS.md):
// primary green #00592D, Gelasio font (global), rounded-2xl/rounded-lg, and the
// slideIn animation defined in src/index.css. Used in place of native alert()
// for non-blocking success/info notifications.
const Toast = ({ message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 right-4 z-50 max-w-sm bg-[#00592D] text-white px-6 py-4 rounded-2xl shadow-lg flex items-start gap-3 animate-slideIn"
    >
      <MdCheckCircle className="w-6 h-6 shrink-0 mt-0.5" />
      <p className="text-base leading-snug">{message}</p>
    </div>
  );
};

export default Toast;
