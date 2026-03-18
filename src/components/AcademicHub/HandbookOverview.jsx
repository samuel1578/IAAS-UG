import { motion } from 'framer-motion';
import { MdArrowForward } from 'react-icons/md';

const HandbookOverview = ({ onContinue }) => {
    const cardVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full"
        >
            {/* 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

                {/* Card 1: Header & Welcome */}
                <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0 }}
                    className="bg-white rounded-xl p-6 lg:p-8 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                >
                    <div className="mb-6">
                        <h1 className="text-3xl lg:text-4xl font-bold text-[#00592D] mb-3">Academic Hub</h1>
                        <div className="h-1 w-16 bg-[#F2A900] rounded-full"></div>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-xl lg:text-2xl font-bold text-[#00592D]">Welcome to Your Curriculum</h2>
                        <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                            The School of Agriculture offers a comprehensive 4-year programme leading to the award of a BSc. Agriculture degree.
                            This Academic Hub is your gateway to accessing all course information, resources, and curriculum guidelines.
                        </p>
                    </div>
                </motion.div>

                {/* Card 2: Get Started CTA */}
                <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-[#00592D] to-[#004620] rounded-xl p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center min-h-[280px] lg:min-h-[320px]"
                >
                    <div className="text-center space-y-4">
                        <div className="text-white/80 text-sm lg:text-base mb-4">
                            Ready to explore your courses?
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onContinue}
                            className="w-full bg-white text-[#00592D] font-semibold py-3 lg:py-4 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-[#F2A900] hover:text-white transition-all"
                        >
                            Get Started
                            <MdArrowForward className="w-5 h-5" />
                        </motion.button>
                        <p className="text-white/60 text-xs lg:text-sm mt-4">
                            Browse courses by level and specialization
                        </p>
                    </div>
                </motion.div>

                {/* Card 3: Program Structure */}
                <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl p-6 lg:p-8 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-1 bg-[#00592D] rounded-full"></div>
                        <h3 className="text-xl lg:text-2xl font-bold text-[#00592D]">Program Structure</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold text-[#00592D] text-sm lg:text-base mb-1">Level 100 - Level 200</p>
                            <p className="text-gray-700 text-sm lg:text-base">Core/compulsory courses providing foundations in general Science and Agriculture</p>
                        </div>
                        <div className="border-l-2 border-[#F2A900] pl-4">
                            <p className="font-semibold text-[#00592D] text-sm lg:text-base mb-1">Level 300</p>
                            <p className="text-gray-700 text-sm lg:text-base">Two core courses in your specialization area + two electives from other departments</p>
                        </div>
                        <div>
                            <p className="font-semibold text-[#00592D] text-sm lg:text-base mb-1">Level 400</p>
                            <p className="text-gray-700 text-sm lg:text-base">Advanced courses in your chosen specialization</p>
                        </div>
                    </div>
                </motion.div>

                {/* Card 4: Graduation Requirements & Specialization */}
                <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-6 lg:p-8 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                >
                    <div className="space-y-6">
                        {/* Graduation Requirements */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-6 w-1 bg-[#F2A900] rounded-full"></div>
                                <h3 className="text-xl lg:text-2xl font-bold text-[#00592D]">Graduation Requirements</h3>
                            </div>
                            <p className="text-gray-700 text-sm lg:text-base">
                                To graduate with a BSc. Agriculture degree, you must complete a minimum of <strong>146 credits</strong> including all University, School and Department required courses, and pass at least <strong>136 credits</strong>.
                            </p>
                        </div>

                        {/* Specialization Options */}
                        <div className="pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-[#00592D] mb-3 uppercase tracking-wide">Specialization Options (Level 300+)</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <span className="text-gray-700 text-xs lg:text-sm">• Agricultural Economics</span>
                                <span className="text-gray-700 text-xs lg:text-sm">• Animal Science</span>
                                <span className="text-gray-700 text-xs lg:text-sm">• Agribusiness</span>
                                <span className="text-gray-700 text-xs lg:text-sm">• Crop Science</span>
                                <span className="text-gray-700 text-xs lg:text-sm">• Horticulture</span>
                                <span className="text-gray-700 text-xs lg:text-sm">• Postharvest Technology</span>
                                <span className="text-gray-700 text-xs lg:text-sm">• Soil Science</span>
                                <span className="text-gray-700 text-xs lg:text-sm">• Agricultural Extension</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
};

export default HandbookOverview;
