import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import {
    MdClose,
    MdDownload,
    MdPictureAsPdf,
    MdCloudUpload,
    MdDescription,
    MdArticle,
    MdVideocam,
    MdMenuBook,
    MdLocationOn,
    MdCategory,
    MdExpandMore,
    MdExpandLess
} from 'react-icons/md';
import { useState, useEffect } from 'react';
import Button from '../Button';
import { MaterialService, storage, APPWRITE_CONFIG } from '../../lib/appwrite';
import courseBack from '../../assets/courseback.avif';

const CourseDetailsModal = ({ course, isOpen, onClose }) => {
    const [materials, setMaterials] = useState([]);
    const [loadingMaterials, setLoadingMaterials] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState({});
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
    const dragControls = useDragControls();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDragEnd = (event, info) => {
        if (info.offset.y > 150 || info.velocity.y > 500) {
            onClose();
        }
    };

    const modalVariants = {
        hidden: isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 20 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', damping: 25, stiffness: 300 }
        },
        exit: isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 20 }
    };

    const toggleGroup = (type) => {
        setExpandedGroups(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

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
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        drag={isMobile ? "y" : false}
                        dragControls={dragControls}
                        dragListener={false}
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.6 }}
                        onDragEnd={handleDragEnd}
                        className="fixed inset-0 lg:inset-4 lg:top-0 lg:inset-x-8 lg:bottom-8 z-50 bg-white rounded-t-2xl lg:rounded-xl lg:rounded-t-none overflow-hidden flex flex-col h-full lg:max-h-none"
                    >
                        {/* Mobile Drag Handle */}
                        {isMobile && (
                            <div
                                onPointerDown={(e) => dragControls.start(e)}
                                className="w-full flex justify-center pt-3 pb-2 bg-[#f4f7f5] cursor-grab active:cursor-grabbing shrink-0 z-20"
                            >
                                <div className="w-10 h-1 rounded-full bg-gray-300" />
                            </div>
                        )}

                        {/* Header */}
                        <div
                            onPointerDown={(e) => isMobile && dragControls.start(e)}
                            className="relative border-b border-gray-200 aspect-[2172/724] max-h-[240px] lg:max-h-[320px] bg-[#f4f7f5] shrink-0"
                        >
                            {/* Full-width Background Image Layer */}
                            <div
                                className="absolute inset-0 w-full h-full z-0 pointer-events-none"
                                style={{
                                    backgroundImage: `url(${courseBack})`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                }}
                            />

                            {/* Overlay Content Layer */}
                            <div className="relative z-10 flex items-start justify-between p-4 lg:p-8 w-full h-full">
                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex flex-col gap-2 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs lg:text-sm font-bold w-fit ${course.type === 'C'
                                            ? 'bg-[#00592D]/10 text-[#00592D]'
                                            : 'bg-[#F2A900]/20 text-[#00592D]'
                                            }`}>
                                            {course.code}
                                        </span>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-[#00592D] leading-tight">
                                            {course.title}
                                        </h2>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-[#00592D]/90 text-sm font-medium">
                                        <span className="flex items-center gap-1.5">
                                            <MdMenuBook className="w-4 h-4" />
                                            {course.credits} Credits
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MdLocationOn className="w-4 h-4" />
                                            Level {course.level}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MdCategory className="w-4 h-4" />
                                            {course.type === 'C' ? 'Compulsory' : 'Elective'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-[#00592D]/10 rounded-lg transition-colors shrink-0"
                                >
                                    <MdClose className="w-6 h-6 text-[#00592D]" />
                                </button>
                            </div>
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
                                            {['lecture slides', 'notes', 'assignments', 'recordings'].map((materialType) => {
                                                const items = groupedMaterials[materialType];
                                                if (!items || items.length === 0) return null;

                                                const isExpanded = expandedGroups[materialType];
                                                const visibleItems = isExpanded ? items : items.slice(0, 5);
                                                const hasMore = items.length > 5;

                                                return (
                                                    <div key={materialType}>
                                                        <h4 className="text-lg font-semibold text-gray-800 mb-3 capitalize flex items-center gap-2">
                                                            {getFileIcon(materialType)}
                                                            {materialType.charAt(0).toUpperCase() + materialType.slice(1)}
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {visibleItems.map((material) => {
                                                                const downloadUrl = MaterialService.getDownloadLink(material.fileUrl);
                                                                return (
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
                                                                        {downloadUrl && (
                                                                            <a
                                                                                href={downloadUrl.toString()}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="ml-4 flex items-center gap-2 px-3 py-2 bg-[#00592D] hover:bg-[#004620] text-white rounded-lg transition-colors text-sm font-medium shrink-0"
                                                                            >
                                                                                <MdDownload className="w-4 h-4" />
                                                                                Download
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        {hasMore && (
                                                            <button
                                                                onClick={() => toggleGroup(materialType)}
                                                                className="mt-3 flex items-center gap-1 text-sm font-semibold text-[#00592D] hover:text-[#F2A900] transition-colors"
                                                            >
                                                                {isExpanded ? (
                                                                    <>
                                                                        <MdExpandLess className="w-5 h-5" />
                                                                        Show less
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <MdExpandMore className="w-5 h-5" />
                                                                        Show {items.length - 5} more
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
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
