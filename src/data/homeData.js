export const quickToolsData = [
    {
        id: 'past-questions',
        title: 'Past Questions',
        description: 'Browse and download past examination questions organized by course code and academic year.',
        icon: 'description',
        link: '/dashboard/100',
        status: 'active'
    },
    {
        id: 'campus-farm-map',
        title: 'Campus Farm Map',
        description: 'Explore an interactive map of agricultural facilities including crop farms, animal farms, greenhouses, and laboratories.',
        icon: 'map',
        link: '/dashboard/200',
        status: 'active'
    },
    {
        id: 'academic-timetable',
        title: 'Academic Timetable',
        description: 'Stay updated with lecture schedules, practical sessions, and timetable changes.',
        icon: 'calendar',
        link: '/dashboard/300',
        status: 'active'
    },
    {
        id: 'farm-weather-monitor',
        title: 'Farm Weather Monitor',
        description: 'View real-time weather conditions to support agricultural fieldwork and farm practical activities.',
        icon: 'cloud',
        link: '/dashboard/400',
        status: 'active'
    }
];

export const highlightsData = [
    {
        id: 'h-1',
        studentName: 'Kofi Mensah',
        level: '200',
        message: "Tested organic fertilizer on maize crops during today's farm practical. The growth difference after two weeks is impressive.",
        status: 'approved',
        createdAt: '2026-03-08T10:00:00.000Z'
    },
    {
        id: 'h-2',
        studentName: 'Ama Owusu',
        level: '100',
        message: 'Looking for study partners for AGRC 103. Anyone interested in forming a small discussion group?',
        status: 'approved',
        createdAt: '2026-03-09T15:30:00.000Z'
    },
    {
        id: 'h-3',
        studentName: 'Kwame Asante',
        level: '300',
        message: 'Visited the irrigation research field today. Learning about sustainable water management systems was incredibly insightful.',
        status: 'approved',
        createdAt: '2026-03-10T11:15:00.000Z'
    }
];

export const announcementsData = [
    {
        id: 'a-1',
        title: 'Research Farm Field Visit',
        description: 'All Level 200 students are invited to participate in a guided visit to the university research farm to observe modern irrigation techniques and crop management practices.',
        date: '2026-03-22',
        createdBy: 'Department Administration',
        status: 'active'
    },
    {
        id: 'a-2',
        title: 'Crop Science Lecture Schedule Change',
        description: 'The Crop Science lecture previously scheduled for Tuesday has been moved to Wednesday at 2:00 PM in Lecture Hall B.',
        date: '2026-03-20',
        createdBy: 'Academic Affairs',
        status: 'active'
    },
    {
        id: 'a-3',
        title: 'School of Agriculture Student Forum',
        description: 'The Agric SRC invites all students to a general meeting to discuss upcoming activities, academic support initiatives, and student welfare.',
        date: '2026-03-28',
        createdBy: 'Agric SRC',
        status: 'active'
    }
];

export const footerData = {
    title: 'UG School of Agriculture Student Hub',
    subtitle: 'Empowering the next generation of agricultural innovators at the University of Ghana School of Agriculture.',
    subtext: 'Cultivating knowledge. Growing leaders. Transforming agriculture.',
    links: [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard/100' }
    ],
    copyright: 'University of Ghana, Legon'
};

export const getActiveQuickTools = (tools) => tools.filter((tool) => tool.status === 'active');

export const getApprovedHighlights = (highlights) =>
    (highlights || []).filter((highlight) => highlight.status === 'approved');

export const getActiveAnnouncements = (announcements) =>
    announcements.filter((announcement) => announcement.status === 'active');
