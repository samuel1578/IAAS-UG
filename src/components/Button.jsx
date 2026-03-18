import { motion } from 'framer-motion';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-[#00592D] text-white hover:bg-[#004422] active:scale-95',
    secondary: 'bg-[#F2A900] text-white hover:bg-[#D99500] active:scale-95',
    outline: 'border-2 border-[#00592D] text-[#00592D] hover:bg-[#00592D] hover:text-white active:scale-95',
    ghost: 'text-[#00592D] hover:bg-gray-100 active:scale-95'
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  );
};

export default Button;
