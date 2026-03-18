import { motion } from 'framer-motion';
import Button from '../Button';
import { SPECIALIZATIONS } from '../../hooks/useAcademicHubData';
import { MdArrowForward } from 'react-icons/md';

const SpecializationSelector = ({ selectedSpecialization, onSelect, onContinue }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 lg:p-12 shadow-lg border border-white/20">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[#00592D] mb-2">Choose Your Specialization</h2>
                    <p className="text-gray-600">
                        Select your area of specialization for Level 300 and above. You'll take 2 core courses from your chosen area
                        and 2 electives from other departments each semester.
                    </p>
                    <div className="h-1 w-16 bg-[#F2A900] rounded-full mt-4"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {SPECIALIZATIONS.map((spec) => (
                        <motion.button
                            key={spec}
                            onClick={() => onSelect(spec)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-6 rounded-lg border-2 transition-all text-left font-semibold ${selectedSpecialization === spec
                                ? 'border-[#00592D] bg-[#00592D]/10 text-[#00592D]'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-[#00592D]/50'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>{spec}</span>
                                {selectedSpecialization === spec && (
                                    <div className="w-6 h-6 bg-[#00592D] rounded-full flex items-center justify-center">
                                        <span className="text-white text-lg">✓</span>
                                    </div>
                                )}
                            </div>
                        </motion.button>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center"
                >
                    <Button
                        variant="primary"
                        onClick={onContinue}
                        disabled={!selectedSpecialization}
                        className="flex items-center gap-2 px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Continue
                        <MdArrowForward className="w-5 h-5" />
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SpecializationSelector;
