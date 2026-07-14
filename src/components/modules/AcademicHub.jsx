import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HandbookOverview from '../AcademicHub/HandbookOverview';
import LevelBrowseSelector from '../AcademicHub/LevelBrowseSelector';
import SpecializationSelector from '../AcademicHub/SpecializationSelector';
import SemesterToggle from '../AcademicHub/SemesterToggle';
import CourseListView from '../AcademicHub/CourseListView';
import CourseDetailsModal from '../AcademicHub/CourseDetailsModal';
import { useAcademicHubData } from '../../hooks/useAcademicHubData';

const AcademicHub = ({ level }) => {
  const studentLevel = parseInt(level);
  const [currentStep, setCurrentStep] = useState('handbook'); // handbook → level-select → specialization → courses
  const [browseLevel, setBrowseLevel] = useState(studentLevel); // defaults to the student's real level, changeable independently

  const {
    semester,
    setSemester,
    specialization,
    setSpecialization,
    expandedCourse,
    setExpandedCourse,
    selectedCourseId,
    setSelectedCourseId,
    showCourseDetails,
    setShowCourseDetails,
    availableCourses,
    selectedCourse,
    needsSpecializationSelection,
    canToggleSemester,
    isLoading,
    error,
    sem1Count,
    sem2Count
  } = useAcademicHubData(browseLevel);

  // Step flow logic
  const handleHandbookContinue = () => {
    if (needsSpecializationSelection) {
      setCurrentStep('specialization');
    } else {
      setCurrentStep('courses');
    }
  };

  const handleBrowseOtherLevels = () => {
    setCurrentStep('level-select');
  };

  const handleBrowseLevelSelect = (selectedLevel) => {
    setBrowseLevel(selectedLevel);
    setSpecialization(null);
    setSemester(1);
    if (selectedLevel >= 300) {
      setCurrentStep('specialization');
    } else {
      setCurrentStep('courses');
    }
  };

  const handleReturnToMyLevel = () => {
    setBrowseLevel(studentLevel);
    setCurrentStep('handbook');
  };

  const handleSpecializationContinue = () => {
    setCurrentStep('courses');
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourseId(courseId);
    setShowCourseDetails(true);
  };

  // Persistent banner when browsing a level that isn't the student's own
  const renderBrowseBanner = () => {
    if (browseLevel === studentLevel) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-2 text-sm bg-[#FFF8E1] border border-[#F2A900]/40 text-[#8a6100] p-3 rounded-lg"
      >
        <span>
          You're browsing Level {browseLevel} courses (your enrolled level is {studentLevel}).
        </span>
        <button
          onClick={handleReturnToMyLevel}
          className="font-semibold text-[#00592D] hover:underline"
        >
          Return to my level
        </button>
      </motion.div>
    );
  };

  // Render steps
  const renderStep = () => {
    switch (currentStep) {
      case 'handbook':
        return (
          <HandbookOverview
            onContinue={handleHandbookContinue}
            onBrowseOtherLevels={handleBrowseOtherLevels}
          />
        );

      case 'level-select':
        return (
          <LevelBrowseSelector
            studentLevel={studentLevel}
            onSelectLevel={handleBrowseLevelSelect}
          />
        );

      case 'specialization':
        return (
          <div className="space-y-6">
            {renderBrowseBanner()}
            <SpecializationSelector
              selectedSpecialization={specialization}
              onSelect={setSpecialization}
              onContinue={handleSpecializationContinue}
            />
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            {renderBrowseBanner()}

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between text-sm text-gray-600 bg-white/80 backdrop-blur-sm p-4 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#00592D]">Level {browseLevel}</span>
                {specialization && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="font-bold text-[#F2A900]">{specialization}</span>
                  </>
                )}
              </div>
            </motion.div>

            {/* Semester Toggle - Fullscreen Card Selector */}
            <SemesterToggle
              semester={semester}
              onSemesterChange={setSemester}
              sem1Count={sem1Count}
              sem2Count={sem2Count}
            />

            {/* Course List */}
            <CourseListView
              courses={availableCourses}
              expandedCourse={expandedCourse}
              onExpandCourse={setExpandedCourse}
              onSelectCourse={handleSelectCourse}
              isLoading={isLoading}
              error={error}
            />

            {/* Course Details Modal */}
            <CourseDetailsModal
              course={selectedCourse}
              isOpen={showCourseDetails}
              onClose={() => setShowCourseDetails(false)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-7xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AcademicHub;
