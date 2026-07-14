import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdArrowBack, MdFileUpload, MdLibraryBooks, MdSchool, MdVisibility, MdSettings } from 'react-icons/md';
import MaterialUploadForm from './MaterialUploadForm';
import CourseDetailsModal from '../AcademicHub/CourseDetailsModal';
import firstSemImage from '../../assets/firstsem.webp';
import secondSemImage from '../../assets/secondsem.webp';

const CourseMaterialsNavigator: React.FC = () => {
    const [mode, setMode] = useState<'manage' | 'preview' | null>(null);
    const [step, setStep] = useState<'level' | 'semester' | 'crud'>('level');
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);

    const levels = [100, 200, 300, 400];
    const semesters = [1, 2];

    const handleModeSelect = (selectedMode: 'manage' | 'preview') => {
        setMode(selectedMode);
    };

    const handleLevelSelect = (level: number) => {
        setSelectedLevel(level);
        setStep('semester');
    };

    const handleSemesterSelect = (semester: number) => {
        setSelectedSemester(semester);
        setStep('crud');
    };

    const handleBack = () => {
        if (step === 'semester') setStep('level');
        if (step === 'crud') {
            setSelectedCourse(null);
            setStep('semester');
        }
    };

    const handleReset = () => {
        setMode(null);
        setStep('level');
        setSelectedLevel(null);
        setSelectedSemester(null);
        setSelectedCourse(null);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#00592D] mb-2">
                        {mode === 'preview' ? 'Student View Preview' : 'Course Materials Management'}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        {mode && (
                            <span className="flex items-center gap-2">
                                <span className="font-semibold text-[#00592D]">
                                    {mode === 'preview' ? 'Preview Mode' : 'Manage Mode'}
                                </span>
                                {step === 'level' && (
                                    <button
                                        onClick={handleReset}
                                        className="text-[#F2A900] hover:underline text-xs"
                                    >
                                        (change mode)
                                    </button>
                                )}
                            </span>
                        )}
                        {selectedLevel && (
                            <>
                                <span className="text-gray-400">›</span>
                                <span className="flex items-center gap-2">
                                    <span className="font-semibold text-[#00592D]">Level {selectedLevel}</span>
                                    {step === 'semester' && (
                                        <button
                                            onClick={() => setStep('level')}
                                            className="text-[#F2A900] hover:underline text-xs"
                                        >
                                            (change level)
                                        </button>
                                    )}
                                </span>
                            </>
                        )}
                        {selectedSemester && step === 'crud' && (
                            <>
                                <span className="text-gray-400">›</span>
                                <span className="flex items-center gap-2">
                                    <span className="font-semibold text-[#00592D]">Semester {selectedSemester}</span>
                                    <button
                                        onClick={() => setStep('semester')}
                                        className="text-[#F2A900] hover:underline text-xs"
                                    >
                                        (change semester)
                                    </button>
                                </span>
                            </>
                        )}
                        {!mode && <span>Select an action to begin</span>}
                        {mode && step === 'level' && <span>Select a level to proceed</span>}
                    </div>
                </div>
                {mode && step !== 'level' && (
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#00592D] transition-colors font-medium"
                    >
                        <MdArrowBack className="w-5 h-5" />
                        Back
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {!mode && (
                    <motion.div
                        key="mode-select"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl"
                    >
                        <button
                            onClick={() => handleModeSelect('manage')}
                            className="group p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#00592D] transition-all text-center"
                        >
                            <div className="w-16 h-16 bg-[#E6F4EA] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00592D] transition-colors">
                                <MdSettings className="w-8 h-8 text-[#00592D] group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Manage Materials</h3>
                            <p className="text-sm text-gray-500 mt-2">Upload and edit course resources</p>
                        </button>

                        <button
                            onClick={() => handleModeSelect('preview')}
                            className="group p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#F2A900] transition-all text-center"
                        >
                            <div className="w-16 h-16 bg-[#FFF8E1] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#F2A900] transition-colors">
                                <MdVisibility className="w-8 h-8 text-[#F2A900] group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Student View Preview</h3>
                            <p className="text-sm text-gray-500 mt-2">See exactly what students see</p>
                        </button>
                    </motion.div>
                )}

                {mode && step === 'level' && (
                    <motion.div
                        key="level-select"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {levels.map((level) => (
                            <button
                                key={level}
                                onClick={() => handleLevelSelect(level)}
                                className="group p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#00592D] transition-all text-center"
                            >
                                <div className="w-16 h-16 bg-[#E6F4EA] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00592D] transition-colors">
                                    <MdSchool className="w-8 h-8 text-[#00592D] group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Level {level}</h3>
                                <p className="text-sm text-gray-500 mt-2">
                                    {mode === 'preview' ? 'Preview' : 'Manage'} level {level} courses
                                </p>
                            </button>
                        ))}
                    </motion.div>
                )}

                {mode && step === 'semester' && (
                    <motion.div
                        key="semester-select"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto"
                    >
                        {semesters.map((sem) => {
                            if (sem === 1) {
                                return (
                                    <button
                                        key={sem}
                                        onClick={() => handleSemesterSelect(sem)}
                                        className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#F2A900] transition-all text-center overflow-hidden"
                                    >
                                        {/* Cover photo */}
                                        <img
                                            src={firstSemImage}
                                            alt="First Semester"
                                            className="w-full h-40 object-cover rounded-t-2xl"
                                        />
                                        <div className="p-8">
                                            <h3 className="text-xl font-bold text-gray-800">Semester {sem}</h3>
                                            <p className="text-sm text-gray-500 mt-2">
                                                {mode === 'preview' ? 'Preview' : 'Manage'} semester {sem}
                                            </p>
                                        </div>
                                    </button>
                                );
                            }
                            return (
                                <button
                                    key={sem}
                                    onClick={() => handleSemesterSelect(sem)}
                                    className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#F2A900] transition-all text-center overflow-hidden"
                                >
                                    {/* Cover photo */}
                                    <img
                                        src={secondSemImage}
                                        alt="Second Semester"
                                        className="w-full h-40 object-cover rounded-t-2xl"
                                    />
                                    <div className="p-8">
                                        <h3 className="text-xl font-bold text-gray-800">Semester {sem}</h3>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {mode === 'preview' ? 'Preview' : 'Manage'} semester {sem}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </motion.div>
                )}

                {mode && step === 'crud' && (
                    <motion.div
                        key="crud-view"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {mode === 'manage' ? (
                            <MaterialUploadForm
                                initialLevel={selectedLevel}
                                initialSemester={selectedSemester}
                                onBackToSemester={() => setStep('semester')}
                            />
                        ) : (
                            <MaterialUploadForm
                                initialLevel={selectedLevel}
                                initialSemester={selectedSemester}
                                onCourseSelect={(course) => setSelectedCourse(course)}
                                mode="preview"
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {mode === 'preview' && selectedCourse && (
                <CourseDetailsModal
                    course={selectedCourse}
                    isOpen={!!selectedCourse}
                    onClose={() => setSelectedCourse(null)}
                />
            )}
        </div>
    );
};

export default CourseMaterialsNavigator;
