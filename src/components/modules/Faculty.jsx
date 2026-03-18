import { motion } from 'framer-motion';
import { MdEmail, MdAccessTime, MdSchool } from 'react-icons/md';
import { FaUserTie } from 'react-icons/fa';
import Card from '../Card';
import { facultyData } from '../../data/mockData';

const Faculty = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#00592D] mb-2">Faculty Directory</h2>
        <p className="text-gray-600">Connect with your lecturers and department heads</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 gap-6"
      >
        {facultyData.map((faculty, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card hover={true}>
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00592D] to-[#004422] rounded-full flex items-center justify-center flex-shrink-0">
                    <FaUserTie className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{faculty.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{faculty.department}</p>
                    <span className="inline-block px-3 py-1 bg-[#F2A900] text-white rounded-full text-xs font-semibold">
                      {faculty.role}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex items-start gap-3">
                    <MdEmail className="w-5 h-5 text-[#00592D] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Email</p>
                      <a
                        href={`mailto:${faculty.email}`}
                        className="text-sm text-[#00592D] hover:underline"
                      >
                        {faculty.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MdAccessTime className="w-5 h-5 text-[#00592D] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Office Hours</p>
                      <p className="text-sm text-gray-600">{faculty.officeHours}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MdSchool className="w-5 h-5 text-[#00592D] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Courses</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {faculty.courses.map((course, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Faculty;
