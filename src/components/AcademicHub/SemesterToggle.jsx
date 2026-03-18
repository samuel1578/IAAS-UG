import { motion } from 'framer-motion';
import { MdBook } from 'react-icons/md';

const SemesterToggle = ({ semester, onSemesterChange, availableCourses }) => {
    // Count courses for each semester
    const sem1Courses = availableCourses?.filter(c => c.semester === 1) || [];
    const sem2Courses = availableCourses?.filter(c => c.semester === 2) || [];

    const sem1Count = sem1Courses.length;
    const sem2Count = sem2Courses.length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            {/* Desktop: 2-column grid, Mobile: 1-column stacked */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {/* First Semester Card */}
                <motion.button
                    whileHover={{ y: -4 }}
                    onClick={() => onSemesterChange(1)}
                    className={`relative overflow-hidden rounded-2xl p-8 lg:p-12 transition-all duration-300 ${semester === 1
                            ? 'bg-gradient-to-br from-[#00592D] to-[#004620] text-white shadow-xl ring-2 ring-[#F2A900]'
                            : 'bg-white border-2 border-gray-200 text-gray-800 hover:border-[#00592D] hover:shadow-lg'
                        }`}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

                    <div className="relative z-10 text-left">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-lg ${semester === 1 ? 'bg-white/20' : 'bg-[#E6F4EA]'
                                }`}>
                                <MdBook className={`w-6 h-6 ${semester === 1 ? 'text-white' : 'text-[#004621]'
                                    }`} />
                            </div>
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${semester === 1
                                    ? 'bg-white/20 text-white'
                                    : 'bg-[#E6F4EA] text-[#1E4620]'
                                }`}>
                                SEMESTER 1
                            </span>
                        </div>

                        <h3 className={`text-2xl lg:text-3xl font-bold mb-2 ${semester === 1 ? 'text-white' : 'text-[#00592D]'
                            }`}>
                            First Semester
                        </h3>

                        <p className={`text-sm lg:text-base mb-6 ${semester === 1 ? 'text-white/80' : 'text-gray-600'
                            }`}>
                            {sem1Count} {sem1Count === 1 ? 'course' : 'courses'} available
                        </p>

                        <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${semester === 1
                                ? 'bg-[#F2A900] text-white'
                                : 'bg-gray-100 text-[#00592D]'
                            }`}>
                            {semester === 1 ? '✓ Selected' : 'Select'}
                        </div>
                    </div>
                </motion.button>

                {/* Second Semester Card */}
                <motion.button
                    whileHover={{ y: -4 }}
                    onClick={() => onSemesterChange(2)}
                    className={`relative overflow-hidden rounded-2xl p-8 lg:p-12 transition-all duration-300 ${semester === 2
                            ? 'bg-gradient-to-br from-[#00592D] to-[#004620] text-white shadow-xl ring-2 ring-[#F2A900]'
                            : 'bg-white border-2 border-gray-200 text-gray-800 hover:border-[#00592D] hover:shadow-lg'
                        }`}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

                    <div className="relative z-10 text-left">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-lg ${semester === 2 ? 'bg-white/20' : 'bg-[#E6F4EA]'
                                }`}>
                                <MdBook className={`w-6 h-6 ${semester === 2 ? 'text-white' : 'text-[#004621]'
                                    }`} />
                            </div>
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${semester === 2
                                    ? 'bg-white/20 text-white'
                                    : 'bg-[#E6F4EA] text-[#1E4620]'
                                }`}>
                                SEMESTER 2
                            </span>
                        </div>

                        <h3 className={`text-2xl lg:text-3xl font-bold mb-2 ${semester === 2 ? 'text-white' : 'text-[#00592D]'
                            }`}>
                            Second Semester
                        </h3>

                        <p className={`text-sm lg:text-base mb-6 ${semester === 2 ? 'text-white/80' : 'text-gray-600'
                            }`}>
                            {sem2Count} {sem2Count === 1 ? 'course' : 'courses'} available
                        </p>

                        <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${semester === 2
                                ? 'bg-[#F2A900] text-white'
                                : 'bg-gray-100 text-[#00592D]'
                            }`}>
                            {semester === 2 ? '✓ Selected' : 'Select'}
                        </div>
                    </div>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default SemesterToggle;
