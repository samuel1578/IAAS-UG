import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HandbookOverview from '../AcademicHub/HandbookOverview';
import SpecializationSelector from '../AcademicHub/SpecializationSelector';
import SemesterToggle from '../AcademicHub/SemesterToggle';
import CourseListView from '../AcademicHub/CourseListView';
import CourseDetailsModal from '../AcademicHub/CourseDetailsModal';
import { useAcademicHubData } from '../../hooks/useAcademicHubData';

const AcademicHub = ({ level }) => {
  const [currentStep, setCurrentStep] = useState('handbook'); // handbook → specialization → courses

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
    canToggleSemester
  } = useAcademicHubData(parseInt(level));

  // Step flow logic
  const handleHandbookContinue = () => {
    if (needsSpecializationSelection) {
      setCurrentStep('specialization');
    } else {
      setCurrentStep('courses');
    }
  };

  const handleSpecializationContinue = () => {
    setCurrentStep('courses');
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourseId(courseId);
    setShowCourseDetails(true);
  };

  // Render steps
  const renderStep = () => {
    switch (currentStep) {
      case 'handbook':
        return (
          <HandbookOverview onContinue={handleHandbookContinue} />
        );

      case 'specialization':
        return (
          <SpecializationSelector
            selectedSpecialization={specialization}
            onSelect={setSpecialization}
            onContinue={handleSpecializationContinue}
          />
        );

      case 'courses':
        return (
          <div className="space-y-6">
            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between text-sm text-gray-600 bg-white/80 backdrop-blur-sm p-4 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#00592D]">Level {level}</span>
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
              availableCourses={availableCourses}
            />

            {/* Course List */}
            <CourseListView
              courses={availableCourses}
              expandedCourse={expandedCourse}
              onExpandCourse={setExpandedCourse}
              onSelectCourse={handleSelectCourse}
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
