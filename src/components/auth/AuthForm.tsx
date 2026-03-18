import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdEmail, MdLock, MdPerson, MdPhone, MdSchool, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import Button from '../Button';
import { useAuth } from '../../contexts/AuthContext';

interface AuthFormProps {
  onToggleMode: () => void;
  isSignUp: boolean;
  onSuccess: () => void;
}

const AuthForm = ({ onToggleMode, isSignUp, onSuccess }: AuthFormProps) => {
  const { signIn, signUp, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    level: '',
    studentId: '',
    department: 'Bsc Agriculture' as 'Bsc Agriculture' | 'Bsc Food and Consumer Science',
    phoneNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      // Validate sign up data
      if (!formData.name || !formData.email || !formData.password || !formData.level ||
        !formData.studentId || !formData.phoneNumber) {
        setError('All fields are required');
        return;
      }

      // Validate student ID
      const studentIdNum = parseInt(formData.studentId);
      if (isNaN(studentIdNum) || studentIdNum <= 0 || formData.studentId.length > 8) {
        setError('Student ID must be a valid number with maximum 8 digits');
        return;
      }

      // Validate phone number
      const phoneNum = parseInt(formData.phoneNumber);
      if (isNaN(phoneNum) || phoneNum <= 0) {
        setError('Phone number must be a valid number');
        return;
      }

      // Validate password
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }

      const result = await signUp({
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
        level: formData.level,
        studentId: studentIdNum,
        department: formData.department,
        phoneNumber: phoneNum,
      });

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Registration failed');
      }
    } else {
      // Sign in validation
      if (!formData.email || !formData.password) {
        setError('Email and password are required');
        return;
      }

      const result = await signIn(formData.email.trim(), formData.password);

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Sign in failed');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-gelasio text-[#00592D] mb-2">
          {isSignUp ? 'Join UG Agric Hub' : 'Welcome Back'}
        </h2>
        <p className="text-gray-600 font-gelasio font-normal">
          {isSignUp
            ? 'Create your account to access academic resources'
            : 'Sign in to access your dashboard'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold font-gelasio text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <MdEmail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00592D] focus:border-transparent transition-all"
              placeholder="student@gmail.com"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold font-gelasio text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <MdLock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00592D] focus:border-transparent transition-all"
              placeholder={isSignUp ? 'Min. 8 characters' : 'Enter your password'}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Sign Up Only Fields */}
        {isSignUp && (
          <>
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold font-gelasio text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <MdPerson className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00592D] focus:border-transparent transition-all"
                  placeholder="John Doe Mensah"
                  required
                />
              </div>
            </div>

            {/* Level and Student ID Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="level" className="block text-sm font-semibold font-gelasio text-gray-700 mb-2">
                  Level
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00592D] focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Level</option>
                  <option value="100">Level 100</option>
                  <option value="200">Level 200</option>
                  <option value="300">Level 300</option>
                  <option value="400">Level 400</option>
                </select>
              </div>

              <div>
                <label htmlFor="studentId" className="block text-sm font-semibold font-gelasio text-gray-700 mb-2">
                  Student ID
                </label>
                <input
                  type="number"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00592D] focus:border-transparent transition-all"
                  placeholder="12345678"
                  max="99999999"
                  required
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-semibold font-gelasio text-gray-700 mb-2">
                Department
              </label>
              <div className="relative">
                <MdSchool className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00592D] focus:border-transparent transition-all"
                  required
                >
                  <option value="Bsc Agriculture">Bsc Agriculture</option>
                  <option value="Bsc Food and Consumer Science">Bsc Food and Consumer Science</option>
                </select>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-semibold font-gelasio text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <MdPhone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00592D] focus:border-transparent transition-all"
                  placeholder="0241234567"
                  required
                />
              </div>
            </div>
          </>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-600 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full font-gelasio font-bold"
          disabled={isLoading}
        >
          {isLoading
            ? (isSignUp ? 'Creating Account...' : 'Signing In...')
            : (isSignUp ? 'Create Account' : 'Sign In')
          }
        </Button>
      </form>

      {/* Toggle Mode */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 font-gelasio font-normal">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-[#00592D] font-semibold font-gelasio font-bold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default AuthForm;