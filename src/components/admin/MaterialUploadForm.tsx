import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MaterialService, APPWRITE_CONFIG } from '../../lib/appwrite';
import { mockCoursesData } from '../../hooks/useAcademicHubData';

interface MaterialFormData {
    file: File | null;
    courseCode: string;
    materialType: 'lecture slides' | 'notes' | 'assignments' | 'recordings';
    title: string;
    description: string;
    level: number;
    semester: number;
}

interface MaterialUploadFormProps {
    initialLevel?: number | null;
    initialSemester?: number | null;
    onBackToSemester?: () => void;
    onCourseSelect?: (course: any) => void;
    mode?: 'manage' | 'preview';
}

export const MaterialUploadForm: React.FC<MaterialUploadFormProps> = ({
    initialLevel,
    initialSemester,
    onBackToSemester,
    onCourseSelect,
    mode = 'manage'
}) => {
    const { isAdmin, user } = useAuth();
    const [currentStep, setCurrentStep] = useState<'course' | 'upload'>('course');
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [formData, setFormData] = useState<MaterialFormData>({
        file: null,
        courseCode: '',
        materialType: 'lecture slides',
        title: '',
        description: '',
        level: initialLevel || 100,
        semester: initialSemester || 1,
    });
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [recentMaterials, setRecentMaterials] = useState<any[]>([]);

    // Get filtered courses based on level and semester
    const availableCourses = useMemo(() => {
        if (!initialLevel || !initialSemester) return [];
        const levelData = mockCoursesData[initialLevel as keyof typeof mockCoursesData];
        if (!levelData) return [];
        return (levelData as any)[initialSemester] || [];
    }, [initialLevel, initialSemester]);

    // Load recent materials on component mount or when course changes
    useEffect(() => {
        loadRecentMaterials();
    }, [formData.courseCode]);

    const loadRecentMaterials = async () => {
        if (!isAdmin) return;
        const result = await MaterialService.getAllMaterials();
        if (result.success) {
            // Filter by course code if selected
            let filtered = result.materials;
            if (formData.courseCode) {
                filtered = filtered.filter((m: any) => m.courseCode === formData.courseCode);
            }
            setRecentMaterials(filtered.slice(0, 10));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            // Validate file size (100MB max)
            if (file.size > 100 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'File size must be less than 100MB' });
                return;
            }
            setFormData((prev) => ({ ...prev, file }));
            setUploadProgress(0);
            setMessage(null);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.size > 100 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'File size must be less than 100MB' });
                return;
            }
            setFormData((prev) => ({ ...prev, file }));
            setUploadProgress(0);
            setMessage(null);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'level' || name === 'semester' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.file) {
            setMessage({ type: 'error', text: 'Please select a file' });
            return;
        }

        if (!formData.courseCode) {
            setMessage({ type: 'error', text: 'Please select a course' });
            return;
        }

        if (!formData.title.trim()) {
            setMessage({ type: 'error', text: 'Please enter a title' });
            return;
        }

        if (!user) {
            setMessage({ type: 'error', text: 'You must be logged in to upload materials' });
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        const year = new Date().getFullYear();
        const result = await MaterialService.uploadMaterial(
            formData.file,
            formData.courseCode,
            formData.materialType,
            formData.title,
            formData.description,
            user.$id,
            formData.level,
            formData.semester,
            year,
            (progress) => setUploadProgress(progress)
        );

        if (result.success) {
            setMessage({ type: 'success', text: 'Material uploaded successfully!' });
            setFormData((prev) => ({
                ...prev,
                file: null,
                title: '',
                description: '',
            }));
            // Reset file input
            const fileInput = document.getElementById('fileInput') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            // Reload recent materials
            loadRecentMaterials();
        } else {
            setMessage({ type: 'error', text: `Upload failed: ${result.error}` });
        }
        setUploading(false);
        setUploadProgress(0);
    };

    const deleteMaterial = async (materialId: string, fileId: string) => {
        if (confirm('Are you sure you want to delete this material?')) {
            const result = await MaterialService.deleteMaterial(materialId, fileId);
            if (result.success) {
                setMessage({ type: 'success', text: 'Material deleted successfully!' });
                loadRecentMaterials();
            } else {
                setMessage({ type: 'error', text: `Delete failed: ${result.error}` });
            }
        }
    };

    if (!isAdmin) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                <p>You do not have permission to upload course materials. Admin access required.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {currentStep === 'course' ? 'Select Course' : 'Upload Material'}
                    </h2>
                    {currentStep === 'upload' && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-[#00592D] font-bold">
                                {selectedCourse?.code} — {selectedCourse?.title}
                            </span>
                            <button
                                onClick={() => setCurrentStep('course')}
                                className="text-[#F2A900] hover:underline text-xs"
                            >
                                (change course)
                            </button>
                        </div>
                    )}
                </div>

                {message && (
                    <div
                        className={`mb-4 p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                {currentStep === 'course' ? (
                    <div className="space-y-4">
                        <label className="block text-gray-700 font-semibold mb-2">Select Course *</label>
                        <div className="grid grid-cols-1 gap-3">
                            {availableCourses.map((course: any) => (
                                <button
                                    key={course.code}
                                    onClick={() => {
                                        setSelectedCourse(course);
                                        setFormData(prev => ({ ...prev, courseCode: course.code }));
                                        if (mode === 'manage') {
                                            setCurrentStep('upload');
                                        } else if (onCourseSelect) {
                                            onCourseSelect(course);
                                        }
                                        setMessage(null);
                                    }}
                                    className="text-left px-6 py-4 border border-gray-200 rounded-xl hover:border-[#00592D] hover:bg-gray-50 transition-all group"
                                >
                                    <div className="font-bold text-[#00592D] group-hover:text-[#00592D]">
                                        {course.code}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {course.title}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* File Upload Area */}
                        <div
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#00592D] transition"
                        >
                            <input
                                id="fileInput"
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.pptx,.mp4,.docx,.jpg,.png,.xlsx"
                            />
                            <label htmlFor="fileInput" className="cursor-pointer">
                                <div className="text-gray-600">
                                    {formData.file ? (
                                        <div>
                                            <p className="font-semibold text-gray-800">{formData.file.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="font-semibold mb-1">Drag and drop your file here</p>
                                            <p className="text-sm">or click to browse (Max 100MB)</p>
                                        </>
                                    )}
                                </div>
                            </label>
                        </div>

                        {/* Material Type */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Material Type *</label>
                            <select
                                name="materialType"
                                value={formData.materialType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D]"
                            >
                                <option value="lecture slides">Lecture Slides</option>
                                <option value="notes">Notes</option>
                                <option value="assignments">Assignments</option>
                                <option value="recordings">Recordings</option>
                            </select>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., Lecture 1 - Introduction to Agriculture"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D]"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Optional: Provide additional details about this material"
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D]"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={uploading || !formData.file}
                            className="w-full bg-[#00592D] hover:bg-[#004d26] disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                        >
                            {uploading ? 'Uploading...' : 'Upload Material'}
                        </button>

                        {/* Progress Bar */}
                        {uploading && (
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm font-medium text-gray-700">
                                    <span>Uploading...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-[#00592D] h-2.5 rounded-full transition-all duration-300 ease-out"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </form>
                )}
            </div>

            {/* Recent Materials */}
            {recentMaterials.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                        Recent Uploads {formData.courseCode && `for ${formData.courseCode}`}
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="text-left px-4 py-2">Type</th>
                                    <th className="text-left px-4 py-2">Title</th>
                                    <th className="text-left px-4 py-2">Uploaded</th>
                                    <th className="text-center px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentMaterials.map((material) => (
                                    <tr key={material.$id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2">{material.materialType}</td>
                                        <td className="px-4 py-2">{material.title}</td>
                                        <td className="px-4 py-2">{new Date(material.uploadedDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() => deleteMaterial(material.$id, material.fileUrl)}
                                                className="text-red-600 hover:text-red-800 font-semibold text-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaterialUploadForm;
