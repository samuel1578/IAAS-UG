import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdDownload, MdPictureAsPdf, MdCloudUpload, MdDescription, MdArticle, MdVideocam } from 'react-icons/md';
import { useState, useEffect } from 'react';
import Button from '../Button';
import { MaterialService, storage, APPWRITE_CONFIG } from '../../lib/appwrite';

const CourseDetailsModal = ({ course, isOpen, onClose }) => {
    const [materials, setMaterials] = useState([]);
    const [loadingMaterials, setLoadingMaterials] = useState(true);

    // Fetch materials for the course
    useEffect(() => {
        if (isOpen && course) {
            fetchMaterials();
        }
    }, [isOpen, course]);

    const fetchMaterials = async () => {
        setLoadingMaterials(true);
        const result = await MaterialService.getMaterialsByCourse(course.code);
        if (result.success) {
            setMaterials(result.materials);
        }
        setLoadingMaterials(false);
    };

    const getFileIcon = (materialType) => {
        switch (materialType) {
            case 'lecture slides':
                return <MdArticle className="w-5 h-5 text-blue-600" />;
            case 'notes':
                return <MdDescription className="w-5 h-5 text-orange-600" />;
            case 'assignments':
                return <MdCloudUpload className="w-5 h-5 text-purple-600" />;
            case 'recordings':
                return <MdVideocam className="w-5 h-5 text-red-600" />;
            default:
                return <MdPictureAsPdf className="w-5 h-5 text-gray-600" />;
        }
    };

    const groupedMaterials = materials.reduce((acc, material) => {
        if (!acc[material.materialType]) {
            acc[material.materialType] = [];
        }
        acc[material.materialType].push(material);
        return acc;
    }, {});

    if (!course) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 lg:inset-8 z-50 bg-white rounded-xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between p-4 lg:p-8 border-b border-gray-200 bg-gradient-to-r from-[#00592D] to-[#00592D]/80">
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex flex-col gap-2 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs lg:text-sm font-bold text-white w-fit ${course.type === 'C' ? 'bg-white/20' : 'bg-[#F2A900]/30'
                                        }`}>
                                        {course.code}
                                    </span>
                                    <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                                        {course.title}
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-4 text-white/90 text-sm">
                                    <span>📚 {course.credits} Credits</span>
                                    <span>📍 Level {course.level}</span>
                                    <span>🔍 {course.type === 'C' ? 'Compulsory' : 'Elective'}</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors shrink-0"
                            >
                                <MdClose className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-4 lg:p-8 space-y-8">
                                {/* Description */}
                                <div>
                                    <h3 className="text-xl font-bold text-[#00592D] mb-4">Course Description</h3>
                                    <p className="text-gray-700 leading-relaxed text-base">
                                        {course.description}
                                    </p>
                                </div>

                                {/* Prerequisites */}
                                {course.prerequisites && course.prerequisites.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-bold text-[#00592D] mb-4">Prerequisites</h3>
                                        <div className="space-y-2">
                                            {course.prerequisites.map((prereq, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-gray-700">
                                                    <span className="text-[#F2A900] font-bold">•</span>
                                                    {prereq}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Resources Section */}
                                <div>
                                    <h3 className="text-xl font-bold text-[#00592D] mb-4 flex items-center gap-2">
                                        <MdPictureAsPdf className="w-6 h-6" />
                                        Course Resources
                                    </h3>

                                    {loadingMaterials ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-600">Loading resources...</p>
                                        </div>
                                    ) : materials.length === 0 ? (
                                        <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
                                            <MdCloudUpload className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                                            <p className="text-gray-600 mb-2">No resources available</p>
                                            <p className="text-sm text-gray-500">
                                                Check back soon for lecture slides, lecture notes, assignments, and recordings
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {Object.entries(groupedMaterials).map(([materialType, items]) => (
                                                <div key={materialType}>
                                                    <h4 className="text-lg font-semibold text-gray-800 mb-3 capitalize flex items-center gap-2">
                                                        {getFileIcon(materialType)}
                                                        {materialType.charAt(0).toUpperCase() + materialType.slice(1)}
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {items.map((material) => (
                                                            <div key={material.$id} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-gray-800 truncate">{material.title}</p>
                                                                    {material.description && (
                                                                        <p className="text-sm text-gray-600 truncate">{material.description}</p>
                                                                    )}
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        Uploaded: {new Date(material.uploadedDate).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                                <a
                                                                    href={`${APPWRITE_CONFIG.endpoint}/storage/buckets/${APPWRITE_CONFIG.bucketId}/files/${material.fileUrl}/download`}
                                                                    download
                                                                    className="ml-4 flex items-center gap-2 px-3 py-2 bg-[#00592D] hover:bg-[#004620] text-white rounded-lg transition-colors text-sm font-medium shrink-0"
                                                                >
                                                                    <MdDownload className="w-4 h-4" />
                                                                    Download
                                                                </a>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Quick Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Credits</p>
                                        <p className="text-2xl font-bold text-[#00592D]">{course.credits}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Course Type</p>
                                        <p className="text-2xl font-bold text-[#00592D]">
                                            {course.type === 'C' ? 'Compulsory' : 'Elective'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex gap-3 pt-6 justify-end">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                            >
                                Close
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CourseDetailsModal;
