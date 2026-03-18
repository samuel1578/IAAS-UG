clean_content = '''import { useState, useMemo } from "react";

export const mockCoursesData = {
    100: {
        1: [],
        2: []
    },
    200: { 1: [], 2: [] },
    300: { 1: [], 2: [] },
    400: { 1: [], 2: [] }
};

export const SPECIALIZATIONS = [
    'Agricultural Economics',
    'Agribusiness',
    'Animal Science',
    'Crop Science',
    'Horticulture',
    'Postharvest Technology',
    'Soil Science',
    'Agricultural Extension'
];

export const useAcademicHubData = (userLevel: number) => {
    const [semester, setSemester] = useState<1 | 2>(1);
    const [specialization, setSpecialization] = useState<string | null>(null);
    const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [showCourseDetails, setShowCourseDetails] = useState(false);

    const availableCourses = useMemo(() => {
        const levelData = mockCoursesData[userLevel as keyof typeof mockCoursesData];
        if (!levelData) return [];
        const semesterCourses = levelData[semester] || [];
        return semesterCourses;
    }, [userLevel, semester]);

    const filteredCourses = useMemo(() => {
        if (userLevel < 300) return availableCourses;
        if (!specialization) return availableCourses;
        return availableCourses;
    }, [availableCourses, specialization, userLevel]);

    const selectedCourse = useMemo(() => {
        return availableCourses.find(c => c.id === selectedCourseId) || null;
    }, [availableCourses, selectedCourseId]);

    return {
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
        availableCourses: filteredCourses,
        selectedCourse,
        needsSpecializationSelection: userLevel >= 300 && !specialization,
        canToggleSemester: true
    };
};
'''

with open('src/hooks/useAcademicHubData.ts', 'w', encoding='utf-8') as f:
    f.write(clean_content)

print('✓ Created minimal clean version')
