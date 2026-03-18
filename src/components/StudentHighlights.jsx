import { motion } from 'framer-motion';
import Card from './Card';
import SubmitHighlightForm from './SubmitHighlightForm';
import { getApprovedHighlights } from '../data/homeData';

const StudentHighlights = ({ highlights = [], onSubmitHighlight }) => {
    const approvedHighlights = getApprovedHighlights(highlights);

    return (
        <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-2"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[#00592D]">Student Highlights</h2>
                    <p className="text-gray-600">Discover what fellow agriculture students are learning, building, and experimenting with across the school.</p>
                </motion.div>

                <SubmitHighlightForm onSubmit={onSubmitHighlight} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {approvedHighlights.map((highlight, index) => (
                        <motion.div
                            key={highlight.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                        >
                            <Card className="h-full" hover={false}>
                                <div className="p-6 space-y-3">
                                    <div className="flex items-center justify-between gap-4">
                                        <h3 className="text-lg font-semibold text-[#00592D]">{highlight.studentName}</h3>
                                        <span className="text-sm font-medium px-3 py-1 rounded-full bg-[#F2A900]/20 text-[#8B6508]">
                                            Level {highlight.level}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{highlight.message}</p>
                                    <p className="text-sm text-gray-500">
                                        Approved highlight • {new Date(highlight.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StudentHighlights;
