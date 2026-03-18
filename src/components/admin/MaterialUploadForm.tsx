import React, { useState, useEffect } from 'react';
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

export const MaterialUploadForm: React.FC = () => {
    const { isAdmin, user } = useAuth();
    const [formData, setFormData] = useState<MaterialFormData>({
        file: null,
        courseCode: '',
        materialType: 'lecture slides',
        title: '',
        description: '',
        level: 100,
        semester: 1,
    });
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [recentMaterials, setRecentMaterials] = useState<any[]>([]);

    // Get all unique course codes from mock data
    const courseCodes = Object.values(mockCoursesData).flatMap((levelData: any) =>
        Object.values(levelData).flatMap((semesterCourses: any) =>
            semesterCourses.map((course: any) => course.code)
        )
    );
    const uniqueCourseCodes = Array.from(new Set(courseCodes));

    // Load recent materials on component mount
    useEffect(() => {
        loadRecentMaterials();
    }, []);

    const loadRecentMaterials = async () => {
        if (!isAdmin) return;
        const result = await MaterialService.getAllMaterials();
        if (result.success) {
            setRecentMaterials(result.materials.slice(0, 10));
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
            year
        );

        if (result.success) {
            setMessage({ type: 'success', text: 'Material uploaded successfully!' });
            setFormData({
                file: null,
                courseCode: '',
                materialType: 'lecture slides',
                title: '',
                description: '',
                level: 100,
                semester: 1,
            });
            // Reset file input
            const fileInput = document.getElementById('fileInput') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            // Reload recent materials
            loadRecentMaterials();
        } else {
            setMessage({ type: 'error', text: `Upload failed: ${result.error}` });
        }
        setUploading(false);
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
            {/* Upload Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Course Material</h2>

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

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* File Upload Area */}
                    <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition"
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

                    {/* Course Code */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Course Code *</label>
                        <select
                            name="courseCode"
                            value={formData.courseCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select a course...</option>
                            {uniqueCourseCodes.map((code) => (
                                <option key={code} value={code}>
                                    {code}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Level and Semester */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Level *</label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={100}>Level 100</option>
                                <option value={200}>Level 200</option>
                                <option value={300}>Level 300</option>
                                <option value={400}>Level 400</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Semester *</label>
                            <select
                                name="semester"
                                value={formData.semester}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={1}>Semester 1</option>
                                <option value={2}>Semester 2</option>
                            </select>
                        </div>
                    </div>

                    {/* Material Type */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Material Type *</label>
                        <select
                            name="materialType"
                            value={formData.materialType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={uploading || !formData.file}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                        {uploading ? 'Uploading...' : 'Upload Material'}
                    </button>
                </form>
            </div>

            {/* Recent Materials */}
            {recentMaterials.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Uploads</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="text-left px-4 py-2">Course</th>
                                    <th className="text-left px-4 py-2">Type</th>
                                    <th className="text-left px-4 py-2">Title</th>
                                    <th className="text-left px-4 py-2">Uploaded</th>
                                    <th className="text-center px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentMaterials.map((material) => (
                                    <tr key={material.$id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2 font-semibold">{material.courseCode}</td>
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
