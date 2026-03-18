import re

with open('src/hooks/useAcademicHubData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the import and hook definition
lines = content.split('\n')

# Find where mockCoursesData ends and the rest begins
import_line = "import { useState, useMemo } from 'react';"

# Build the new content with all data
new_content = '''import { useState, useMemo } from 'react';

export const mockCoursesData = {
    100: {
        1: [
            {
                id: 'AGEN101',
                code: 'AGEN101',
                title: 'Agricultural Engineering I',
                type: 'C',
                credits: 2,
                semester: 1,
                level: 100,
                description: 'Profession of agricultural engineering, types of power sources (human, animal, mechanical), working principle, operation and maintenance of small engines, transmission of power, simple farm machines and implements, basic workshop practices and safety.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'AGRC101',
                code: 'AGRC101',
                title: 'General Chemistry I',
                type: 'C',
                credits: 3,
                semester: 1,
                level: 100,
                description: 'Atomic Structure and periodic classification. The periodic table (group and period trends in atomic properties). Introduction to bonding, electronegativity and polarization. Types of chemical bonding: Ionic, covalent and metallic bonding. Coordination complexes: bonding and geometry. The Mole concept, molar mass and composition of compounds. Chemical equations and stoichiometry. The Gaseous state: Kinetic theory, Gas laws (Boyle\\'s law, Charle\\'s law, Gay-Lussac\\'s law, ideal and Van der Waal\\'s gases). The Liquid state: Properties of liquids, intermolecular forces, hydrogen bonding. Solutions: types of solutions, molarity, molality. Thermochemistry: Energy and enthalpy, exothermic and endothermic reactions, Hess\\'s Law.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'ANIM111',
                code: 'ANIM111',
                title: 'Introduction to Agricultural Microbiology',
                type: 'C',
                credits: 2,
                semester: 1,
                level: 100,
                description: 'Discovery and importance of microbes; Classification and morphology of microbes - bacteria, fungi, viruses, viroids, protozoa and prions; Culture of microbes; Microbial physiology; Growth and nutrition of microbes-Autotrophs and heterotrophs, obligate and facultative anaerobes; Microbial genetics; Antibiotic resistance; Industrial microbiology. Practical: Simple staining, Gram staining, hanging drop preparation, culture media preparation and sterilization of media.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'CROP111',
                code: 'CROP111',
                title: 'Introduction to Agricultural Botany',
                type: 'C',
                credits: 2,
                semester: 1,
                level: 100,
                description: 'Hierarchical organization of plant life, algae, fungi, bryophytes, pteridophytes, gymnosperms, angiosperms; plant cells, tissues, organs; mitosis, meiosis; Root: modification, tissue arrangement in monocot and dicot roots; Stem: modification, tissue arrangement; Leaf: venation, shapes, arrangement, modification; Reproduction: Flower parts, types, floral arrangements, diagrams; Fruit and seed: structure, types, germination, dormancy; Classification: species, genus, family, order, division, kingdom, binomial nomenclature.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'MATH101',
                code: 'MATH101',
                title: 'General Mathematics',
                type: 'C',
                credits: 3,
                semester: 1,
                level: 100,
                description: 'Indices and logarithm. Functions and their graphs, polynomial functions, circular functions, equations and inequalities in one variable. Arrangement and selections. Binomial expansion. Limits of functions, derivatives and applications. Integration as inverse of differentiation. Definite integral as area. Applications to kinematics. Elementary numerical methods, Newton-Raphson method.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'SOIL101',
                code: 'SOIL101',
                title: 'Introduction to Soil and the Environment',
                type: 'C',
                credits: 2,
                semester: 1,
                level: 100,
                description: 'Pedology fundamentals: soil concepts, earth-crust composition, pedogenic factors, soil components. Soil Physics: soil as 3-phase system, bulk density, particle density, soil texture, particle size analysis. Soil water: content determination, water storage. Practicals: soil color, texture by feel, water content, bulk density determination.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'UGRC150',
                code: 'UGRC150',
                title: 'Critical Thinking and Practical Reasoning',
                type: 'C',
                credits: 3,
                semester: 1,
                level: 100,
                description: 'Development of critical thinking skills and practical reasoning abilities for academic and professional applications.',
                specialization: [],
                prerequisites: []
            }
        ],
        2: [
            {
                id: 'AGEC112',
                code: 'AGEC112',
                title: 'Introduction to Economics',
                type: 'C',
                credits: 3,
                semester: 2,
                level: 100,
                description: 'Economic tools and systems. Microeconomics: scarcity, choice, supply and demand, elasticity, consumer behavior, producer theory. Markets and competition. Firm organization and cost structure. Macroeconomics: national income, consumption, investment, money, inflation, unemployment.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'AGEX102',
                code: 'AGEX102',
                title: 'Development Communication and Extension Methods',
                type: 'C',
                credits: 2,
                semester: 2,
                level: 100,
                description: 'Communication process and effective communication. Individual communication: farm and home visits. Group communication methods. Mass communication. Extension teaching methods. Innovation diffusion process. Method selection.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'AGRC102',
                code: 'AGRC102',
                title: 'General Chemistry II',
                type: 'C',
                credits: 3,
                semester: 2,
                level: 100,
                description: 'Chemical equilibrium, solubility, electrochemical series, redox systems, oxidation number. Systematic inorganic chemistry: periodic table, element chemistry, bonding. Organic chemistry: hydrocarbons, functional groups, aromaticity. Practicals: redox titration, qualitative analysis, cation and anion tests.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'AGRC104',
                code: 'AGRC104',
                title: 'Introduction to Computer Science',
                type: 'C',
                credits: 2,
                semester: 2,
                level: 100,
                description: 'Computer types and historical development. Data representation: binary, octal, hexadecimal. Logic gates and circuits. Machine organization: ALU, registers, memory, fetch-execute cycle. Software types. Computer ethics and internet. Hands-on: Microsoft Office (Word, Excel, PowerPoint).',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'AGRC108',
                code: 'AGRC108',
                title: 'General Physics',
                type: 'C',
                credits: 3,
                semester: 2,
                level: 100,
                description: 'Viscosity, surface tension, buoyancy, fluid dynamics. Force, momentum, work, power, energy. Heat: temperature, gas laws, heat transfer. Waves and electromagnetic phenomena. Magnetism and electromagnetic induction. Electricity: circuits, current, power. Nuclear physics: radioactivity, fusion, fission.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'UGRC110',
                code: 'UGRC110',
                title: 'Academic Writing I',
                type: 'C',
                credits: 3,
                semester: 2,
                level: 100,
                description: 'Development of academic writing skills for university-level research and communication.',
                specialization: [],
                prerequisites: []
            }
        ]
    },
    200: { 1: [], 2: [] },
    300: { 1: [], 2: [] },
    400: { 1: [], 2: [] }
};

export const SPECIALIZATIONS = ['Agricultural Economics', 'Agribusiness', 'Animal Science', 'Crop Science', 'Horticulture', 'Postharvest Technology', 'Soil Science', 'Agricultural Extension'];

export const useAcademicHubData = (userLevel: number) => {
    const [semester, setSemester] = useState<1 | 2>(1);
    const [specialization, setSpecialization] = useState<string | null>(null);
    const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [showCourseDetails, setShowCourseDetails] = useState(false);
    
    const availableCourses = useMemo(() => {
        const levelData = mockCoursesData[userLevel as keyof typeof mockCoursesData];
        return levelData?.[semester] || [];
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
    f.write(new_content)

print('✓ Restored Level 100 courses with handbook data')
