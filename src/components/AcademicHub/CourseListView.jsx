import { motion } from 'framer-motion';
import CourseCard from './CourseCard';

const CourseListView = ({
    courses,
    expandedCourse,
    onExpandCourse,
    onSelectCourse,
}) => {
    if (courses.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg"
            >
                <p className="text-gray-500 text-lg">No courses available for this selection.</p>
            </motion.div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3 }
        }
    };

    // Group courses by type
    const coreCourses = courses.filter(c => c.type === 'C');
    const electiveCourses = courses.filter(c => c.type === 'E');

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            {/* Core Courses */}
            {coreCourses.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold text-[#00592D] mb-4 flex items-center gap-2">
                        <span className="px-3 py-1 bg-[#00592D] text-white rounded-full text-sm">CORE</span>
                        Compulsory Courses
                    </h3>
                    <motion.div className="space-y-3" variants={containerVariants}>
                        {coreCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                isExpanded={expandedCourse === course.id}
                                onExpand={onExpandCourse}
                                onSelectCourse={onSelectCourse}
                                variants={itemVariants}
                            />
                        ))}
                    </motion.div>
                </div>
            )}

            {/* Elective Courses */}
            {electiveCourses.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold text-[#00592D] mb-4 flex items-center gap-2">
                        <span className="px-3 py-1 bg-[#F2A900] text-white rounded-full text-sm">ELECTIVE</span>
                        Optional Courses
                    </h3>
                    <motion.div className="space-y-3" variants={containerVariants}>
                        {electiveCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                isExpanded={expandedCourse === course.id}
                                onExpand={onExpandCourse}
                                onSelectCourse={onSelectCourse}
                                variants={itemVariants}
                            />
                        ))}
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default CourseListView;
