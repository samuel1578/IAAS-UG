import { motion } from 'framer-motion';
import { MdExpandMore, MdExpandLess, MdCheckCircle, MdInfo } from 'react-icons/md';
import Button from '../Button';

const CourseCard = ({
    course,
    isExpanded,
    onExpand,
    onSelectCourse,
    variants
}) => {
    return (
        <motion.div variants={variants} className="w-full">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-white/20 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <button
                    onClick={() => onExpand(isExpanded ? null : course.id)}
                    className="w-full p-4 lg:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                    <div className="flex-1 text-left min-w-0">
                        <div className="flex flex-col gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-3 py-1 rounded-full text-xs lg:text-sm font-bold text-white ${course.type === 'C' ? 'bg-[#00592D]' : 'bg-[#F2A900]'
                                    }`}>
                                    {course.code}
                                </span>
                                <span className="text-xs lg:text-sm text-gray-500 font-semibold">
                                    {course.credits} Credits
                                </span>
                            </div>
                            <h3 className="text-base lg:text-lg font-bold text-gray-800 leading-tight">
                                {course.title}
                            </h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                        <div className="text-[#00592D]">
                            {isExpanded ? (
                                <MdExpandLess className="w-6 h-6" />
                            ) : (
                                <MdExpandMore className="w-6 h-6" />
                            )}
                        </div>
                    </div>
                </button>

                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-200 bg-gray-50/50"
                    >
                        <div className="p-4 lg:p-6 space-y-4">
                            <div>
                                <h4 className="font-bold text-[#00592D] mb-2 flex items-center gap-2">
                                    <MdInfo className="w-5 h-5" />
                                    Course Description
                                </h4>
                                <p className="text-gray-700 text-sm lg:text-base leading-relaxed">
                                    {course.description}
                                </p>
                            </div>

                            {course.prerequisites && course.prerequisites.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-[#00592D] mb-2">Prerequisites</h4>
                                    <p className="text-gray-700 text-sm">
                                        {course.prerequisites.join(', ') || 'None'}
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                <Button
                                    variant="primary"
                                    size="small"
                                    onClick={() => onSelectCourse(course.id)}
                                    className="flex-1"
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default CourseCard;
