import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdArrowBack,
  MdSchool,
  MdCalendarToday,
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdSave
} from 'react-icons/md';
import Card from '../Card';
import Button from '../Button';
import { CourseService, Course } from '../../lib/appwrite';
import { SPECIALIZATIONS } from '../../hooks/useAcademicHubData';

const LEVELS = [100, 200, 300, 400];
const SEMESTERS = [1, 2];

interface CourseFormState {
  code: string;
  title: string;
  credits: string;
  type: string;
  description: string;
  prerequisites: string;
  specialization: string[];
}

const EMPTY_FORM: CourseFormState = {
  code: '',
  title: '',
  credits: '',
  type: 'C',
  description: '',
  prerequisites: '',
  specialization: []
};

const CourseCatalogManager: React.FC = () => {
  const [step, setStep] = useState<'level' | 'semester' | 'list'>('level');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form, setForm] = useState<CourseFormState>(EMPTY_FORM);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCourses = async (level: number, semester: number) => {
    setLoading(true);
    setError(null);
    const result = await CourseService.getCoursesByLevelAndSemester(level, semester);
    if (result.success) {
      setCourses(result.courses ?? []);
    } else {
      setError(result.error || 'Failed to load courses');
      setCourses([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (step === 'list' && selectedLevel && selectedSemester) {
      fetchCourses(selectedLevel, selectedSemester);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, selectedLevel, selectedSemester]);

  useEffect(() => {
    if (showForm) {
      if (editingCourse) {
        setForm({
          code: editingCourse.code,
          title: editingCourse.title,
          credits: String(editingCourse.credits),
          type: editingCourse.type,
          description: editingCourse.description,
          prerequisites: (editingCourse.prerequisites || []).join(', '),
          specialization: editingCourse.specialization || []
        });
      } else {
        setForm(EMPTY_FORM);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm, editingCourse]);

  const handleLevelSelect = (level: number) => {
    setSelectedLevel(level);
    setStep('semester');
  };

  const handleSemesterSelect = (semester: number) => {
    setSelectedSemester(semester);
    setStep('list');
  };

  const handleBack = () => {
    if (step === 'semester') {
      setStep('level');
      setSelectedLevel(null);
    } else if (step === 'list') {
      setStep('semester');
      setSelectedSemester(null);
      setCourses([]);
    }
  };

  const openAddForm = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const openEditForm = (course: Course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  const toggleSpecialization = (value: string) => {
    setForm((prev) => ({
      ...prev,
      specialization: prev.specialization.includes(value)
        ? prev.specialization.filter((s) => s !== value)
        : [...prev.specialization, value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLevel || !selectedSemester) return;
    setFormSubmitting(true);
    setError(null);

    const courseData: Omit<Course, '$id'> = {
      code: form.code.trim(),
      title: form.title.trim(),
      credits: Number(form.credits),
      type: form.type,
      description: form.description.trim(),
      prerequisites: form.prerequisites
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      specialization: form.specialization,
      semester: selectedSemester,
      level: selectedLevel
    };

    const result = editingCourse?.$id
      ? await CourseService.updateCourse(editingCourse.$id, courseData)
      : await CourseService.createCourse(courseData);

    setFormSubmitting(false);

    if (result.success) {
      closeForm();
      fetchCourses(selectedLevel, selectedSemester);
    } else {
      setError(result.error || 'Failed to save course');
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete?.$id) return;
    setDeleting(true);
    const result = await CourseService.deleteCourse(confirmDelete.$id);
    setDeleting(false);
    if (result.success) {
      setCourses((prev) => prev.filter((c) => c.$id !== confirmDelete.$id));
      setConfirmDelete(null);
    } else {
      setError(result.error || 'Failed to delete course');
      setConfirmDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#00592D] mb-2">Course Catalog</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {step === 'level' && <span>Select a level to manage</span>}
            {selectedLevel && (
              <>
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
            {selectedSemester && step === 'list' && (
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
          </div>
        </div>
        {step !== 'level' && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#00592D] transition-colors font-medium"
          >
            <MdArrowBack className="w-5 h-5" />
            Back
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'level' && (
          <motion.div
            key="level-select"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => handleLevelSelect(level)}
                className="group p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#00592D] transition-all text-center"
              >
                <div className="w-16 h-16 bg-[#E6F4EA] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00592D] transition-colors">
                  <MdSchool className="w-8 h-8 text-[#00592D] group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Level {level}</h3>
                <p className="text-sm text-gray-500 mt-2">Manage level {level} courses</p>
              </button>
            ))}
          </motion.div>
        )}

        {step === 'semester' && (
          <motion.div
            key="semester-select"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto"
          >
            {SEMESTERS.map((sem) => (
              <button
                key={sem}
                onClick={() => handleSemesterSelect(sem)}
                className="group p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#F2A900] transition-all text-center"
              >
                <div className="w-16 h-16 bg-[#FFF8E1] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#F2A900] transition-colors">
                  <MdCalendarToday className="w-8 h-8 text-[#F2A900] group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Semester {sem}</h3>
                <p className="text-sm text-gray-500 mt-2">Manage semester {sem}</p>
              </button>
            ))}
          </motion.div>
        )}

        {step === 'list' && (
          <motion.div
            key="course-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Courses ({courses.length})
              </h3>
              <Button variant="primary" size="medium" onClick={openAddForm} icon={MdAdd}>
                Add New Course
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-[#00592D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <Card hover={false}>
                <div className="p-8 text-center text-gray-500">
                  No courses found for Level {selectedLevel}, Semester {selectedSemester}.
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <Card hover={false} key={course.$id}>
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-[#00592D]">{course.code}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold">
                              {course.type === 'E' ? 'Elective' : 'Core'}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#1E4620] font-semibold">
                              {course.credits} cr
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-800 mt-1">
                            {course.title}
                          </h4>
                          {course.specialization && course.specialization.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {course.specialization.map((spec) => (
                                <span
                                  key={spec}
                                  className="text-xs px-2 py-0.5 rounded-full bg-[#FFF8E1] text-[#8a6d00] font-medium"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 lg:flex-col lg:w-auto">
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => openEditForm(course)}
                            className="flex-1 lg:flex-initial"
                          >
                            <MdEdit className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => setConfirmDelete(course)}
                            className="flex-1 lg:flex-initial border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <MdDelete className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add / Edit Course Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/35"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeForm}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#00592D]">
                    {editingCourse ? 'Edit Course' : 'Add New Course'}
                  </h3>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MdClose className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code
                      </label>
                      <input
                        type="text"
                        required
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D] focus:border-transparent"
                        placeholder="e.g. AGRC101"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Credits
                      </label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={form.credits}
                        onChange={(e) => setForm({ ...form, credits: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D] focus:border-transparent"
                    >
                      <option value="C">C — Core</option>
                      <option value="E">E — Elective</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prerequisites (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={form.prerequisites}
                      onChange={(e) => setForm({ ...form, prerequisites: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D] focus:border-transparent"
                      placeholder="e.g. MATH101, AGRC101"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SPECIALIZATIONS.map((spec) => (
                        <label
                          key={spec}
                          className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={form.specialization.includes(spec)}
                            onChange={() => toggleSpecialization(spec)}
                            className="w-4 h-4 text-[#00592D] focus:ring-[#00592D] border-gray-300 rounded"
                          />
                          {spec}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button variant="ghost" type="button" onClick={closeForm}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={formSubmitting}
                      icon={MdSave}
                    >
                      {formSubmitting ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/35"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Course</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete{' '}
                  <span className="font-semibold text-[#00592D]">{confirmDelete.code}</span> —{' '}
                  {confirmDelete.title}? This action cannot be undone.
                </p>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" type="button" onClick={() => setConfirmDelete(null)}>
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={deleting}
                    onClick={handleConfirmDelete}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseCatalogManager;
