import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MdDescription, MdMap, MdCalendarMonth, MdCloudQueue } from 'react-icons/md';
import Card from './Card';
import { getActiveQuickTools } from '../data/homeData';
import eseImage from '../assets/ese.png';
import sankofaImage from '../assets/sankofa.png';
import neaImage from '../assets/nea.png';

const iconMap = {
    description: MdDescription,
    map: MdMap,
    calendar: MdCalendarMonth,
    cloud: MdCloudQueue
};

const toolMeta = {
    'past-questions': {
        tag: 'Most Used',
        hint: '15+ new uploads this week',
        action: 'Open vault',
        accent: 'from-[#00592D] to-[#0B7A43]'
    },
    'campus-farm-map': {
        tag: 'Navigation',
        hint: 'Facilities and field points',
        action: 'Explore map',
        accent: 'from-[#1F7A8C] to-[#2C91A5]'
    },
    'academic-timetable': {
        tag: 'Daily Planner',
        hint: 'Lecture and practical sync',
        action: 'View schedule',
        accent: 'from-[#7A4E00] to-[#A66A00]'
    },
    'farm-weather-monitor': {
        tag: 'Field Intel',
        hint: 'Weather guidance for practicals',
        action: 'Check weather',
        accent: 'from-[#3B5B92] to-[#4F75B3]'
    }
};

const QuickTools = ({ tools }) => {
    const navigate = useNavigate();
    const activeTools = getActiveQuickTools(tools);

    return (
        <section className="relative py-16 px-6 overflow-hidden bg-[linear-gradient(180deg,#f5f7f6_0%,#eef3f0_100%)]">
            <div className="absolute -top-24 -right-14 h-52 w-52 rounded-full bg-[#00592D]/6 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-14 h-52 w-52 rounded-full bg-[#F2A900]/10 blur-3xl pointer-events-none" />
            {/* Left: Nea Image */}
            {/* Left: Nea Image */}
            <img
                src={neaImage}
                alt="Nea"
                className="hidden lg:block absolute top-0 right-96 w-40 h-auto object-contain z-10 opacity-90"
            />
            {/* Center: Sankofa Image */}
            <img
                src={sankofaImage}
                alt="Sankofa"
                className="hidden lg:block absolute top-0 right-44 w-40 h-auto object-contain z-10 opacity-90"
            />
            {/* Right: ESE Image */}
            <img
                src={eseImage}
                alt="ESE"
                className="hidden lg:block absolute top-0 right-8 w-40 h-auto object-contain z-10 opacity-90"
            />

            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4 }}
                    className="mb-10"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[#00592D] tracking-tight">Quick Access Tools</h2>
                    <p className="text-slate-600 mt-2.5 max-w-2xl text-base leading-relaxed">Access essential student tools quickly and efficiently.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {activeTools.map((tool, index) => {
                        const Icon = iconMap[tool.icon] || MdDescription;
                        const meta = toolMeta[tool.id] || {
                            tag: 'Tool',
                            hint: 'Student utility',
                            action: 'Open tool',
                            accent: 'from-[#00592D] to-[#0B7A43]'
                        };
                        const isFeatured = index === 0;
                        const cardSpan = isFeatured ? 'lg:col-span-7' : 'lg:col-span-5';

                        return (
                            <motion.div
                                key={tool.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                                className={cardSpan}
                            >
                                <Card onClick={() => navigate(tool.link)} className="h-full border border-slate-200/80 bg-white">
                                    <div className="p-6 md:p-7 h-full flex flex-col justify-between gap-4.5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${meta.accent} text-white flex items-center justify-center shadow-sm shadow-black/5`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <span className="inline-flex items-center rounded-full border border-[#00592D]/15 bg-[#00592D]/[0.04] px-2.5 py-0.5 text-sm font-semibold tracking-wide text-[#00592D]/85">
                                                {meta.tag}
                                            </span>
                                        </div>

                                        <div className="text-left">
                                            <h3 className="text-[1.4rem] font-semibold text-[#00592D] tracking-tight">{tool.title}</h3>
                                            <p className="text-slate-600 mt-1.5 leading-relaxed text-base">{tool.description}</p>
                                        </div>

                                        <div className="flex items-center justify-between gap-3 pt-1">
                                            <span className="text-sm text-slate-500">{meta.hint}</span>
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00592D]/20 bg-[#00592D]/5 px-3 py-1 text-sm font-semibold text-[#00592D] transition-transform duration-200 group-hover:translate-x-0.5">
                                                {meta.action}
                                                <span aria-hidden="true">{'->'}</span>
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default QuickTools;
