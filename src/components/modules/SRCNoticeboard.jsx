import { motion } from 'framer-motion';
import { MdNotifications, MdAccessTime } from 'react-icons/md';
import Card from '../Card';
import { srcNoticeboardData } from '../../data/mockData';

const SRCNoticeboard = () => {
  const getTagColor = (tag) => {
    const colors = {
      Urgent: 'bg-red-100 text-red-700 border-red-300',
      Event: 'bg-blue-100 text-blue-700 border-blue-300',
      Important: 'bg-[#F2A900] bg-opacity-20 text-[#F2A900] border-[#F2A900]',
      Notice: 'bg-green-100 text-green-700 border-green-300'
    };
    return colors[tag] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

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
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#00592D] mb-2">SRC Noticeboard</h2>
        <p className="text-gray-600">Stay updated with the latest announcements and events</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {srcNoticeboardData.map((notice) => (
          <motion.div key={notice.id} variants={itemVariants}>
            <Card hover={true}>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#00592D] rounded-full flex items-center justify-center flex-shrink-0">
                    <MdNotifications className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getTagColor(
                          notice.tag
                        )}`}
                      >
                        {notice.tag}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MdAccessTime className="w-4 h-4" />
                        <span>{notice.date}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{notice.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{notice.message}</p>
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

export default SRCNoticeboard;
