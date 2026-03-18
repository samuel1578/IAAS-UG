import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MdArrowBack, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import ugLogo from '../assets/uglogo.png';
import agricLogo from '../assets/lln.jpeg';
import desktopHero from '../assets/newhor.jpg';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [signupPhase, setSignupPhase] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Phase 1: Personal Information
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',

    // Phase 2: Academic Information
    studentId: '',
    level: '',
    department: ''
  });

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (user) {
      navigate(`/dashboard/${user.level || 100}`);
    }
  }, [user, navigate]);

  const departments = [
    'Bsc_Agricultural_Science',
    'Bsc_Food_and_Consumer_Science'
  ];

  const levels = [100, 200, 300, 400];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhase1Continue = () => {
    // Validate Phase 1 fields
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.password) {
      alert('Please fill in all personal information fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setSignupPhase(2);
  };

  const handleSignUp = async () => {
    // Validate Phase 2 fields
    if (!formData.studentId || !formData.level || !formData.department) {
      alert('Please fill in all academic information fields');
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(formData);
      if (result.success) {
        alert('Registration successful! Please wait for admin approval before you can access the dashboard.');
        navigate('/');
      } else {
        alert(result.error || 'Registration failed');
      }
    } catch (error) {
      alert('Registration failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!formData.email || !formData.password) {
      alert('Please enter your email and password');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(formData.email, formData.password);
      if (result.success) {
        // Navigate to appropriate level - will redirect automatically via useEffect
        navigate(`/dashboard/${result.user?.level || 100}`);
      } else {
        const errorMsg = result.error || 'Login failed';
        // Handle specific session errors gracefully
        if (errorMsg.includes('session')) {
          alert('Session error. Please try again.');
        } else {
          alert(errorMsg);
        }
      }
    } catch (error) {
      alert('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <motion.div
        aria-hidden="true"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: 'easeOut' }}
        className="absolute inset-0 -z-20 overflow-hidden"
      >
        <picture>
          <source media="(min-width: 768px)" srcSet={desktopHero} />
          <img src={desktopHero} alt="field background" className="w-full h-full object-cover absolute inset-0" />
        </picture>
      </motion.div>

      {/* Grid Layout Container */}
      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-4 lg:p-8 max-w-7xl mx-auto">

        {/* Left Side - Branding Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 pt-24 lg:pt-28 w-full max-w-sm h-full flex flex-col items-center justify-center relative">
            {/* Back Button - with background overlay */}
            <button
              onClick={() => navigate('/')}
              className="absolute top-4 left-4 lg:top-6 lg:left-6 inline-flex items-center gap-2 bg-[#00592D]/10 hover:bg-[#00592D]/20 text-[#00592D] px-4 py-2 rounded-full transition-colors font-medium text-sm"
            >
              <MdArrowBack className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            {/* Text Content - Moved to Top and Made Larger */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-center mb-8"
            >
              <p className="text-2xl lg:text-3xl font-bold font-gelasio text-[#00592D]">
                Sign in to your account
              </p>
            </motion.div>

            {/* Logos - Side by Side and Increased by 30% */}
            <div className="flex items-center gap-8 mb-10">
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                src={ugLogo}
                alt="UG Logo"
                className="w-32 h-32 object-contain"
              />
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                src={agricLogo}
                alt="Agriculture Logo"
                className="w-32 h-32 object-contain"
              />
            </div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl lg:text-2xl font-bold italic font-gelasio text-[#00592D] text-center leading-tight"
            >
              University of Ghana<br />
              Department of Agriculture<br />
              Student Hub
            </motion.h1>
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center w-full"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm lg:max-w-md">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold font-gelasio font-bold text-gray-800 mb-6">Sign In</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D]/20 focus:border-[#00592D]"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D]/20 focus:border-[#00592D]"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleSignIn}
                      disabled={loading}
                      className="w-full bg-[#00592D] text-white py-3 rounded-lg font-semibold hover:bg-[#00592D]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      Don't have an account?{' '}
                      <button
                        onClick={() => setIsLogin(false)}
                        className="text-[#00592D] hover:text-[#00592D]/80 font-semibold"
                      >
                        Sign up
                      </button>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`signup-phase-${signupPhase}`}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {signupPhase === 1 ? (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Create Account</h2>
                        <div className="text-sm text-gray-500">Step 1 of 2</div>
                      </div>

                      <div className="mb-4">
                        <div className="flex space-x-2">
                          <div className="h-2 bg-[#00592D] rounded-full flex-1"></div>
                          <div className="h-2 bg-gray-200 rounded-full flex-1"></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Personal Information</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D]/20 focus:border-[#00592D]"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D]/20 focus:border-[#00592D]"
                            placeholder="Enter your email"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D]/20 focus:border-[#00592D]"
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D]/20 focus:border-[#00592D]"
                              placeholder="Create a password"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D]/20 focus:border-[#00592D]"
                            placeholder="Confirm your password"
                            required
                          />
                        </div>

                        <button
                          onClick={handlePhase1Continue}
                          className="w-full bg-[#00592D] text-white py-3 rounded-lg font-semibold hover:bg-[#00592D]/90 transition-colors"
                        >
                          Continue to Academic Info
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Academic Information</h2>
                        <div className="text-sm text-gray-500">Step 2 of 2</div>
                      </div>

                      <div className="mb-4">
                        <div className="flex space-x-2">
                          <div className="h-2 bg-[#00592D] rounded-full flex-1"></div>
                          <div className="h-2 bg-[#00592D] rounded-full flex-1"></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Academic Details</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Student ID
                          </label>
                          <input
                            type="text"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D]/20 focus:border-[#00592D]"
                            placeholder="Enter your student ID"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Level
                          </label>
                          <select
                            name="level"
                            value={formData.level}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D]/20 focus:border-[#00592D]"
                            required
                          >
                            <option value="">Select your level</option>
                            {levels.map((level) => (
                              <option key={level} value={level}>
                                Level {level}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Department
                          </label>
                          <select
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D]/20 focus:border-[#00592D]"
                            required
                          >
                            <option value="">Select your department</option>
                            {departments.map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex space-x-3">
                          <button
                            onClick={() => setSignupPhase(1)}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                          >
                            Back
                          </button>
                          <button
                            onClick={handleSignUp}
                            disabled={loading}
                            className="flex-1 bg-[#00592D] text-white py-3 rounded-lg font-semibold hover:bg-[#00592D]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? 'Creating Account...' : 'Create Account'}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      Already have an account?{' '}
                      <button
                        onClick={() => {
                          setIsLogin(true);
                          setSignupPhase(1);
                        }}
                        className="text-[#00592D] hover:text-[#00592D]/80 font-semibold"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AuthPage;