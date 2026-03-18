import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = true,
  onClick,
  ...props
}) => {
  const baseStyles = 'bg-white rounded-xl shadow-md overflow-hidden';

  const cardVariants = {
    rest: { scale: 1, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    hover: {
      scale: 1.02,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3 }
    }
  };

  if (!hover) {
    return (
      <div className={`${baseStyles} ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`${baseStyles} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
