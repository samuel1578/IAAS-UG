import { motion } from 'framer-motion';
import { MdSchool, MdArrowForward } from 'react-icons/md';

const LEVELS = [
    {
        level: 100,
        description: 'Core and foundational courses in Science and Agriculture',
    },
    {
        level: 200,
        description: 'Intermediate courses building on your foundations',
    },
    {
        level: 300,
        description: 'Specialization courses — pick your area of focus',
    },
    {
        level: 400,
        description: 'Advanced courses in your chosen specialization',
    },
];

const LevelBrowseSelector = ({ studentLevel, onSelectLevel }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full"
        >
            <div className="mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#00592D] mb-2">
                    Browse Courses by Level
                </h2>
                <div className="h-1 w-16 bg-[#F2A900] rounded-full"></div>
                <p className="text-gray-600 text-sm mt-3">
                    Select any level to explore its courses. This is a temporary view and will not change your enrolled level.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {LEVELS.map(({ level, description }) => {
                    const isOwnLevel = level === studentLevel;
                    return (
                        <motion.button
                            key={level}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectLevel(level)}
                            className="group relative p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#00592D] transition-all text-center"
                        >
                            {isOwnLevel && (
                                <span className="absolute top-3 right-3 bg-[#00592D] text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full">
                                    Your Level
                                </span>
                            )}
                            <div className="w-16 h-16 bg-[#E6F4EA] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00592D] transition-colors">
                                <MdSchool className="w-8 h-8 text-[#00592D] group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Level {level}</h3>
                            <p className="text-sm text-gray-500 mt-2">{description}</p>
                            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#00592D] group-hover:text-[#F2A900] transition-colors">
                                Browse
                                <MdArrowForward className="w-4 h-4" />
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default LevelBrowseSelector;
