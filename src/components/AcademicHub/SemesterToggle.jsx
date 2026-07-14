import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import firstSemImage from '../../assets/firstsem.webp';
import secondSemImage from '../../assets/secondsem.webp';

const SemesterToggle = ({ semester, onSemesterChange, sem1Count = 0, sem2Count = 0 }) => {
    const cards = [
        { key: 1, image: firstSemImage, title: 'First Semester', count: sem1Count },
        { key: 2, image: secondSemImage, title: 'Second Semester', count: sem2Count },
    ];

    const renderCard = (card) => {
        const isActive = semester === card.key;
        return (
            <motion.button
                key={card.key}
                whileHover={{ y: -4 }}
                onClick={() => onSemesterChange(card.key)}
                className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${isActive
                        ? 'bg-gradient-to-br from-[#00592D] to-[#004620] text-white shadow-xl ring-2 ring-[#F2A900]'
                        : 'bg-white border-2 border-gray-200 text-gray-800 hover:border-[#00592D] hover:shadow-lg'
                    }`}
            >
                {/* Cover photo */}
                <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-48 object-cover rounded-t-2xl"
                />

                <div className="relative z-10 text-left p-8 lg:p-12">
                    <h3 className={`text-2xl lg:text-3xl font-bold mb-2 ${isActive ? 'text-white' : 'text-[#00592D]'
                        }`}>
                        {card.title}
                    </h3>

                    <p className={`text-sm lg:text-base mb-6 ${isActive ? 'text-white/80' : 'text-gray-600'
                        }`}>
                        {card.count} {card.count === 1 ? 'course' : 'courses'} available
                    </p>

                    <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${isActive
                            ? 'bg-[#F2A900] text-white'
                            : 'bg-gray-100 text-[#00592D]'
                        }`}>
                        {isActive ? '✓ Selected' : 'Select'}
                    </div>
                </div>
            </motion.button>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            {/* Desktop: 2-column grid */}
            <div className="hidden md:grid grid-cols-2 gap-6 lg:gap-8">
                {cards.map((card) => renderCard(card))}
            </div>

            {/* Mobile: Swiper with pagination dots */}
            <div className="md:hidden">
                <Swiper
                    slidesPerView="auto"
                    spaceBetween={12}
                    pagination={{ clickable: true }}
                    modules={[Pagination]}
                    style={{ '--swiper-pagination-color': '#00592D', '--swiper-pagination-bullet-inactive-color': '#9CA3AF' }}
                >
                    {cards.map((card) => (
                        <SwiperSlide key={card.key} style={{ width: '85%' }}>
                            {renderCard(card)}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </motion.div>
    );
};

export default SemesterToggle;
