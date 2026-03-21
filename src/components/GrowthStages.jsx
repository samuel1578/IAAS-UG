import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Card from './Card';
import { useAuth } from '../contexts/AuthContext';
import { growthStages } from '../data/mockData';
import harvestImage from '../assets/harvest.jpg';
import secondStageImage from '../assets/2nd.jpg';
import branchingStageImage from '../assets/branching.jpg';
import seedlingStageImage from '../assets/seedling.jpg';
import desktopHero from '../assets/newhor.jpg';
import mobileHero from '../assets/mobbar.jpg';
import 'swiper/css';
import 'swiper/css/pagination';

const GrowthStages = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const stageImages = {
        '100': seedlingStageImage,
        '200': secondStageImage,
        '300': branchingStageImage,
        '400': harvestImage
    };

    const handleStageClick = (stage) => {
        if (user) {
            // User is already authenticated, go to dashboard
            navigate(`/dashboard/${stage.id}`);
        } else {
            // User needs to authenticate, go to auth page
            navigate('/auth');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: 'easeOut'
            }
        }
    };

    const renderStageCard = (stage) => (
        <Card
            onClick={() => handleStageClick(stage)}
            className="cursor-pointer group"
        >
            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-stretch gap-5 md:gap-6">
                    <div className="w-full md:basis-[30%] md:shrink-0">
                        <div className="w-full aspect-[4/3] md:aspect-auto md:h-full rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                            {stageImages[stage.id] ? (
                                <img
                                    src={stageImages[stage.id]}
                                    alt={`${stage.title} visual`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 border-2 border-gray-200" aria-hidden="true" />
                            )}
                        </div>
                    </div>

                    <div className="w-full md:basis-[70%] flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-2xl font-bold text-[#00592D] mb-2">{stage.title}</h3>

                        <div className="inline-block px-4 py-1 bg-[#F2A900] text-white rounded-full font-semibold mb-4">
                            {stage.subtitle}
                        </div>

                        <p className="text-gray-600 leading-relaxed">{stage.description}</p>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <section id="growth-stages" className="relative pt-12 pb-16 px-6">
            <motion.div
                aria-hidden="true"
                initial={{ scale: 1.06 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: 'easeOut' }}
                className="md:hidden absolute inset-0 -z-10 overflow-hidden"
            >
                <picture>
                    <source media="(max-width: 767px)" srcSet={mobileHero} />
                    <img src={mobileHero} alt="field background" className="w-full h-full object-cover absolute inset-0" />
                </picture>
            </motion.div>
            <div
                aria-hidden="true"
                className="md:hidden absolute inset-0 -z-10 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 28%, rgba(242,169,0,0.1), transparent 58%)'
                }}
            />
            <motion.div
                aria-hidden="true"
                initial={{ scale: 1.06 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: 'easeOut' }}
                className="hidden md:block absolute inset-0 -z-10 overflow-hidden"
            >
                <picture>
                    <source media="(min-width: 768px)" srcSet={desktopHero} />
                    <img src={desktopHero} alt="field background" className="w-full h-full object-cover absolute inset-0" />
                </picture>
            </motion.div>
            {/* gradient overlay removed as requested */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45 }}
                className="max-w-7xl mx-auto mb-8 md:mb-10 text-center flex flex-col gap-4"
            >
                <div className="bg-white/85 md:bg-white/80 border border-white/20 rounded-full px-6 md:px-8 py-3 md:py-4 inline-block mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#00592D] tracking-tight font-family-gelasio">
                        Choose Your Academic Level
                    </h2>
                </div>
                <p className="bg-white/85 md:bg-white/80 border border-white/20 rounded-full px-6 md:px-8 py-3 md:py-4 text-gray-700 md:text-gray-700 text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-family-gelasio">
                    This is your gateway into the student portal. Select your level to unlock resources,
                    tools, and support tailored to your academic journey.
                </p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="max-w-7xl mx-auto md:hidden"
            >
                <Swiper
                    modules={[Pagination]}
                    slidesPerView={1}
                    spaceBetween={20}
                    pagination={{ clickable: true }}
                    className="growth-stages-swiper"
                >
                    {growthStages.map((stage) => (
                        <SwiperSlide key={stage.id}>
                            <motion.div variants={itemVariants} className="pb-10">
                                {renderStageCard(stage)}
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="hidden md:grid max-w-7xl mx-auto grid-cols-2 gap-8"
            >
                {growthStages.map((stage) => (
                    <motion.div key={stage.id} variants={itemVariants}>
                        {renderStageCard(stage)}
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default GrowthStages;
