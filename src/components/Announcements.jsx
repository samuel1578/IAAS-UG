import { motion } from 'framer-motion';
import Card from './Card';
import { getActiveAnnouncements } from '../data/homeData';

const Announcements = ({ announcements }) => {
    const activeAnnouncements = getActiveAnnouncements(announcements);

    return (
        <section className="py-16 px-6 bg-[#F8F9FA]">
            <div className="max-w-7xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[#00592D]">Latest Announcements</h2>
                    <p className="text-gray-600 mt-2">Stay informed about important academic updates, field trips, and student events.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeAnnouncements.map((announcement, index) => (
                        <motion.div
                            key={announcement.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                        >
                            <Card hover={false} className="h-full">
                                <div className="p-6 space-y-3">
                                    <h3 className="text-xl font-semibold text-[#00592D]">{announcement.title}</h3>
                                    <p className="text-gray-700 leading-relaxed">{announcement.description}</p>
                                    <div className="text-sm text-gray-500 flex flex-wrap gap-3">
                                        <span>{new Date(announcement.date).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{announcement.createdBy}</span>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Announcements;
