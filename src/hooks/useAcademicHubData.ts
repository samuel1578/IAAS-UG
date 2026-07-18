import { useState, useMemo, useEffect, useCallback } from 'react';
import { Query } from 'appwrite';
import { databases, APPWRITE_CONFIG, AuthService } from '../lib/appwrite';

export interface Course {
    id: string;
    code: string;
    title: string;
    credits: number;
    type: string;
    semester: number;
    level: number;
    description: string;
    prerequisites: string[];
    specialization: string[];
}

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
                description: 'Atomic Structure and periodic classification. The periodic table (group and period trends in atomic properties). Introduction to bonding, electronegativity and polarization. Types of chemical bonding: Ionic, covalent and metallic bonding. Coordination complexes: bonding and geometry. The Mole concept, molar mass and composition of compounds. Chemical equations and stoichiometry. The Gaseous state: Kinetic theory, Gas laws (Boyle\'s law, Charle\'s law, Gay-Lussac\'s law, ideal and Van der Waal\'s gases). The Liquid state: Properties of liquids, intermolecular forces, hydrogen bonding. Solutions: types of solutions, molarity, molality. Thermochemistry: Energy and enthalpy, exothermic and endothermic reactions, Hess\'s Law.',
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
    200: {
        1: [
            {
                id: 'AGEC211',
                code: 'AGEC211',
                title: 'Microeconomics: Principles and Applications',
                type: 'C',
                credits: 2,
                semester: 1,
                level: 200,
                description: 'Economics fundamentals: economic problem, scarcity, choice. Microeconomics principles. Market mechanism. Demand, supply and elasticity concepts. Consumer choice and equilibrium. Producer economics. Cost structures. Market competition. Agricultural economics applications.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'AGEN201',
                code: 'AGEN201',
                title: 'Agricultural Engineering II',
                type: 'C',
                credits: 3,
                semester: 1,
                level: 200,
                description: 'Agricultural mechanization development and objectives. Farm power sources: human, animal, mechanical. Tractors: types, features, specifications. Internal combustion engines. Power transmission systems. Tillage equipment: plows, harrows. Planters, seed drills, seed metering. Fertilizer application. Field sprayers and dusters. Harvesting equipment and combine harvesters. Farm machinery selection, maintenance, and costing.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'ANIM211',
                code: 'ANIM211',
                title: 'Introduction to Monogastric Production',
                type: 'C',
                credits: 2,
                semester: 1,
                level: 200,
                description: 'Poultry: origin, distribution, breeds. Production systems and adaptation to tropics. Poultry industry in Ghana. Broiler and layer production. Swine: origin, distribution, breeds. Pig characteristics and adaptation. Behavior, growth, development. Swine nutrition requirements. Stress syndrome in pigs.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'BCMB205',
                code: 'BCMB205',
                title: 'General Biochemistry',
                type: 'C',
                credits: 3,
                semester: 1,
                level: 200,
                description: 'Cell structure and function. Carbohydrates: structure, metabolism, glycolysis. Lipids: structure, metabolism, fatty acid oxidation. Proteins: amino acids, structure, synthesis. Enzymes: properties, factors, kinetics, Michaelis-Menten equation. Nucleic acids and protein biosynthesis. DNA replication, transcription, translation. Mutations and molecular basis.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'CROP221',
                code: 'CROP221',
                title: 'Introduction to Crop Production',
                type: 'C',
                credits: 3,
                semester: 1,
                level: 200,
                description: 'The physical environment and crop production. Adapting crops and management practices to the environment. Soil and water conservation. Farming, cropping and agro-forestry systems. Plant propagation, crop establishment and management. Weed control strategies. Pest and disease control. Integrated crop nutrient management.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'SOIL203',
                code: 'SOIL203',
                title: 'Soil Genesis and Characterisation',
                type: 'C',
                credits: 3,
                semester: 1,
                level: 200,
                description: 'Soil pedology fundamentals. Inorganic components: rocks, minerals, weathering. Soil formation and profile development. Horizons and layers. Soil catena concept. Soil characterization: diagnostic horizons and properties. Soil classification: principles, systems, USDA soil orders, FAO equivalents. Practicals: mineral identification, soil profile description.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'UGRC220',
                code: 'UGRC220',
                title: 'Introduction to African Studies',
                type: 'C',
                credits: 3,
                semester: 1,
                level: 200,
                description: 'Introduction to African Studies from Institute of African Studies. Students select one preferred course. Focus on African history, culture, development, and contemporary issues.',
                specialization: [],
                prerequisites: []
            }
        ],
        2: [
            {
                id: 'AGEC212',
                code: 'AGEC212',
                title: 'Microeconomics: Applications to Households and Firms',
                type: 'C',
                credits: 3,
                semester: 2,
                level: 200,
                description: 'Macroeconomic concepts. National income accounting and GDP. Aggregate functions: consumption, savings, investment. Money supply and demand. National income determination. Business cycles. Exchange rate and inflation fundamentals. Application to Ghana economy.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'AGEX206',
                code: 'AGEX206',
                title: 'Approaches to Extension',
                type: 'C',
                credits: 3,
                semester: 2,
                level: 200,
                description: 'Extension approaches and their relevance. Extension delivery conditions. General agricultural extension. Training and visit approach. Farming systems research approach. Cost-sharing approaches. Commodity-specific extension. Farmer field schools. Convergence of sciences. Innovation systems. Extension evolution in Ghana.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'AGRC200',
                code: 'AGRC200',
                title: 'Long Vacation Practicals',
                type: 'C',
                credits: 3,
                semester: 2,
                level: 200,
                description: 'Practical training at College research centers: Forest and Horticultural Crops Research Centre (Kade), Soil and Irrigation Research Centre (Kpong), Livestock and Poultry Research Centre (Legon). Training in agroforestry, soil classification, rice cultivation, animal nutrition, and health.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'AGRC212',
                code: 'AGRC212',
                title: 'Introductory Statistics',
                type: 'C',
                credits: 3,
                semester: 2,
                level: 200,
                description: 'Descriptive statistics and graphical methods. Measures of central tendency and dispersion. Probability and sampling distributions. Sampling techniques. Hypothesis testing. Chi-square analysis. Correlation and regression analysis. Analysis of variance (ANOVA).',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'ANIM212',
                code: 'ANIM212',
                title: 'Elements of Microbiology and Immunology',
                type: 'C',
                credits: 3,
                semester: 2,
                level: 200,
                description: 'Microbe characteristics: bacteria, fungi, viruses, viroids, protozoa, prions. Morphology and culture. Virus replication and disease induction. Microbial classification. Growth control. Germ theory of disease. Immunology: innate immunity, antibodies, vaccination, hypersensitivity. Food microbiology.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'CBAS210',
                code: 'CBAS210',
                title: 'Academic Writing II',
                type: 'C',
                credits: 3,
                semester: 2,
                level: 200,
                description: 'Advanced academic writing skills. Scientific writing and academic integrity. Plagiarism awareness. Professional communication. Research paper writing. Technical report preparation. Citation and reference management.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'CROP222',
                code: 'CROP222',
                title: 'Insect Biology and Plant Microbes',
                type: 'C',
                credits: 3,
                semester: 2,
                level: 200,
                description: 'Insects: arthropod characteristics, morphology, anatomy, physiology, behavior. Classification and recognition of insect orders. Microbiology history and germ theory. Plant microbes: fungi, bacteria, viruses, nematodes. Microbial importance in agriculture: nitrogen fixation, soil fertility, mycorrhiza.',
                specialization: [],
                prerequisites: []
            },
            {
                id: 'SOIL204',
                code: 'SOIL204',
                title: 'Chemical and Biochemical Properties of Soils',
                type: 'C',
                credits: 3,
                semester: 2,
                level: 200,
                description: 'Soil colloids and ion exchange. Cation and anion exchange capacity. Buffering and soil reaction. Soil microorganisms and habitat. Organic matter and decomposition. Nitrogen cycling. Enzyme activity. Practicals: pH, organic carbon, nitrogen, phosphorus, CEC determination.',
                specialization: [],
                prerequisites: []
            }
        ]
    },
    300: {
        1: [
            { id: 'AGRC311', code: 'AGRC311', title: 'Introductory Genetics', type: 'C', credits: 3, semester: 1, level: 300, description: 'Genetics fundamentals. Transmission genetics, single gene inheritance, chromosomal mapping. DNA structure, replication, gene expression, regulation. Mutation and evolution. Population and quantitative genetics. Gene isolation and biotechnology applications.', specialization: [], prerequisites: [] },
            { id: 'AGEC311', code: 'AGEC311', title: 'Farm Management', type: 'C', credits: 3, semester: 1, level: 300, description: 'Farm management principles and planning. Financial accounting and farm budgets. Farm records and cost analysis. Resource allocation and optimization. Investment analysis for farm enterprises.', specialization: ['Agricultural Economics'], prerequisites: [] },
            { id: 'AGEC313', code: 'AGEC313', title: 'Microeconomic and Macroeconomic Theory', type: 'C', credits: 3, semester: 1, level: 300, description: 'Production theory and firm behavior. Cost structures and market performance. Consumer theory and demand analysis. Economic welfare analysis. Inflation and unemployment dynamics. International economics and exchange rates.', specialization: ['Agricultural Economics'], prerequisites: [] },
            { id: 'ANIM311', code: 'ANIM311', title: 'Principles of Animal Nutrition', type: 'C', credits: 3, semester: 1, level: 300, description: 'Nutrient classification and functions. Feed evaluation and quality assessment. Nutritional management for different livestock species. Ration formulation. Feeding systems and management.', specialization: ['Animal Science'], prerequisites: [] },
            { id: 'CROP311', code: 'CROP311', title: 'Crop Protection', type: 'C', credits: 3, semester: 1, level: 300, description: 'Pest ecology and economic importance. Pest control methods and strategies. Plant disease etiology and management. Integrated crop protection. Pest monitoring and forecasting.', specialization: ['Crop Science'], prerequisites: [] },
            { id: 'CROP315', code: 'CROP315', title: 'Principles of Horticulture', type: 'C', credits: 3, semester: 1, level: 300, description: 'Plant propagation techniques for ornamental crops. Nursery management and systems. Flower production and floral design. Turf grass and landscape management. Postharvest handling and storage.', specialization: ['Horticulture'], prerequisites: [] },
            { id: 'SOIL307', code: 'SOIL307', title: 'Environmental Soil Physics', type: 'C', credits: 3, semester: 1, level: 300, description: 'Soil water movement and infiltration. Soil aggregate stability and structure. Erosion processes and soil conservation. Tillage practices and residue management. Runoff prediction and management.', specialization: ['Soil Science'], prerequisites: [] },
            { id: 'SOIL309', code: 'SOIL309', title: 'Soil Research Methodology', type: 'C', credits: 3, semester: 1, level: 300, description: 'Experimental design and hypothesis formulation. Soil sampling and site characterization. Laboratory safety and quality control. Soil, water, and plant analysis procedures. Data interpretation and scientific reporting.', specialization: ['Soil Science'], prerequisites: [] },
            { id: 'AGEX311', code: 'AGEX311', title: 'Development Sociology', type: 'C', credits: 3, semester: 1, level: 300, description: 'Rural sociology and social anthropology. Culture and community dynamics. Farm families and household structures. Rural and farming change processes. Human behavior and technology adoption.', specialization: ['Agricultural Extension'], prerequisites: [] },
            { id: 'AGEX313', code: 'AGEX313', title: 'Gender Planning and Development', type: 'C', credits: 3, semester: 1, level: 300, description: 'Gender roles and socialization. Triple roles of women in agriculture. Gender needs and resource access. Gender-based violence and equality. Gender mainstreaming in development. Men and women in technology adoption.', specialization: ['Agricultural Extension'], prerequisites: [] }
        ],
        2: [
            { id: 'AGRC312', code: 'AGRC312', title: 'Principles of Biotechnology', type: 'C', credits: 3, semester: 2, level: 300, description: 'Biotechnology concepts and applications. Cell and tissue culture techniques. Genetic engineering principles. Transgenic plant and animal production. Bioethics and regulatory issues. Biotechnology in agriculture.', specialization: [], prerequisites: [] },
            { id: 'AGEX312', code: 'AGEX312', title: 'Extension Programme Planning and Evaluation', type: 'C', credits: 3, semester: 2, level: 300, description: 'Programme cycle and planning processes. Participatory planning methodologies. Implementation strategies and coordination. Monitoring and evaluation frameworks. Impact assessment techniques.', specialization: [], prerequisites: [] },
            { id: 'AGEC312', code: 'AGEC312', title: 'Project Analysis', type: 'C', credits: 3, semester: 2, level: 300, description: 'Project identification and formulation. Cost-benefit analysis. Financial feasibility assessment. Economic rate of return calculations. Project selection and appraisal. Report writing guidelines.', specialization: ['Agricultural Economics'], prerequisites: [] },
            { id: 'AGEC314', code: 'AGEC314', title: 'Research Methods, Statistics and Mathematics', type: 'C', credits: 3, semester: 2, level: 300, description: 'Scientific research methodology. Data collection and sampling techniques. Statistical analysis and hypothesis testing. Quantitative and qualitative methods. Data interpretation and presentation.', specialization: ['Agricultural Economics'], prerequisites: [] },
            { id: 'ANIM312', code: 'ANIM312', title: 'Introduction to Ruminant Production', type: 'C', credits: 3, semester: 2, level: 300, description: 'Ruminant species characteristics and breeds. Production systems and management. Housing and environmental control. Feeding systems and nutrition. Reproductive management. Economic aspects of production.', specialization: ['Animal Science'], prerequisites: [] },
            { id: 'ANIM314', code: 'ANIM314', title: 'Principles of Animal Breeding', type: 'C', credits: 3, semester: 2, level: 300, description: 'Gene action and inheritance. Phenotypic and genetic variation. Heritability and repeatability concepts. Selection principles and response. Mating systems and inbreeding effects.', specialization: ['Animal Science'], prerequisites: [] },
            { id: 'CROP322', code: 'CROP322', title: 'Crop Physiology', type: 'C', credits: 3, semester: 2, level: 300, description: 'Photosynthesis and respiration in crops. Plant water relations and stress. Mineral nutrition and nutrient uptake. Growth and development stages. Environmental responses in plants.', specialization: ['Crop Science'], prerequisites: [] },
            { id: 'FAPH304', code: 'FAPH304', title: 'Introduction to Postharvest Technology', type: 'C', credits: 3, semester: 2, level: 300, description: 'Postharvest importance and food losses. Product handling and storage systems. Preservation methods and technologies. Quality assessment and grading. Marketing and value addition concepts.', specialization: ['Crop Science'], prerequisites: [] },
            { id: 'SOIL306', code: 'SOIL306', title: 'Management of Soil Environment', type: 'C', credits: 3, semester: 2, level: 300, description: 'Soil nutrient status and fertility assessment. Fertilizer management and application. Organic matter role and composting. Green manuring and cover crops. Soil and nutrient conservation practices.', specialization: ['Soil Science'], prerequisites: [] },
            { id: 'SOIL308', code: 'SOIL308', title: 'Soil Degradation and Rehabilitation', type: 'C', credits: 3, semester: 2, level: 300, description: 'Soil degradation types and causes. Eroded soil characteristics and mapping. Rehabilitation and reclamation strategies. Conservation agriculture and land management. Sustainability principles.', specialization: ['Soil Science'], prerequisites: [] }
        ]
    },
    400: {
        1: [
            { id: 'AGRC411', code: 'AGRC411', title: 'Advanced Genetics', type: 'C', credits: 3, semester: 1, level: 400, description: 'Population genetics principles. Quantitative genetics and breeding theory. Molecular genetics and DNA technology. Genomics and gene mapping. Advanced biotechnology applications in agriculture.', specialization: [], prerequisites: [] },
            { id: 'AGEC400', code: 'AGEC400', title: 'Research Project', type: 'C', credits: 6, semester: 1, level: 400, description: 'Independent research project on economics or agribusiness topic. Literature review and methodology development. Data collection and analysis. Dissertation preparation and presentation. Supervised research work.', specialization: ['Agricultural Economics'], prerequisites: [] },
            { id: 'ANIM413', code: 'ANIM413', title: 'Avian Production Systems', type: 'C', credits: 3, semester: 1, level: 400, description: 'Poultry management and breeding. Broiler and layer production systems. Nutrition and disease prevention. Marketing and economics of poultry production. Modern production technologies.', specialization: ['Animal Science'], prerequisites: [] },
            { id: 'CROP411', code: 'CROP411', title: 'Advanced Crop Production', type: 'C', credits: 3, semester: 1, level: 400, description: 'Cropping system design and optimization. Conservation agriculture practices. Climate-smart agriculture approaches. Precision farming technologies. Sustainable intensification strategies.', specialization: ['Crop Science'], prerequisites: [] },
            { id: 'CROP423', code: 'CROP423', title: 'Crop Diseases and Management', type: 'C', credits: 3, semester: 1, level: 400, description: 'Plant disease epidemiology and forecasting. Disease detection and diagnosis. Integrated disease management strategies. Chemical and biological control. Host resistance breeding.', specialization: ['Crop Science'], prerequisites: [] },
            { id: 'CROP425', code: 'CROP425', title: 'Statistics for Agriculturists', type: 'C', credits: 3, semester: 1, level: 400, description: 'Advanced statistical methods in agricultural research. Experimental design and analysis. Regression and correlation analysis. Analysis of variance techniques. Statistical software applications.', specialization: ['Crop Science'], prerequisites: [] },
            { id: 'SOIL411', code: 'SOIL411', title: 'Advanced Soil Science', type: 'C', credits: 3, semester: 1, level: 400, description: 'Soil mineralogy and chemistry. Advanced classification systems. Soil properties and functions. Soil landscape relationships. Specialized soil studies and applications.', specialization: ['Soil Science'], prerequisites: [] },
            { id: 'AGEX411', code: 'AGEX411', title: 'Research Methods in Extension', type: 'C', credits: 3, semester: 1, level: 400, description: 'Qualitative and quantitative research methodologies. Research design and implementation. Data collection and analysis. Program evaluation techniques. Participatory research approaches.', specialization: ['Agricultural Extension'], prerequisites: [] },
            { id: 'FAPH421', code: 'FAPH421', title: 'Food Safety and Quality Assurance', type: 'C', credits: 3, semester: 1, level: 400, description: 'Food safety standards and regulations. Hazard analysis and critical control points. Quality management systems. Food testing and analysis. Contamination prevention strategies.', specialization: ['Postharvest Technology'], prerequisites: [] },
            { id: 'FISH333', code: 'FISH333', title: 'Aquaculture Management', type: 'C', credits: 3, semester: 1, level: 400, description: 'Aquaculture systems and design. Fish species selection and breeding. Water quality management. Nutrition and feeding systems. Disease control and pond management.', specialization: ['Animal Science'], prerequisites: [] }
        ],
        2: [
            { id: 'AGRC422', code: 'AGRC422', title: 'Seminar and Dissertation Presentation', type: 'C', credits: 6, semester: 2, level: 400, description: 'Final research dissertation completion. Seminar presentations of findings. Research conclusions and recommendations. Academic communication skills. Thesis defense preparation and presentation.', specialization: [], prerequisites: [] },
            { id: 'AGEX412', code: 'AGEX412', title: 'Innovations in Agricultural Extension', type: 'C', credits: 3, semester: 2, level: 400, description: 'Digital tools and e-learning in extension. ICT applications in agriculture. Mobile technology for farmer support. Emerging extension pedagogies. Innovation systems approaches.', specialization: ['Agricultural Extension'], prerequisites: [] },
            { id: 'AGEC412', code: 'AGEC412', title: 'Agribusiness Management and Entrepreneurship', type: 'E', credits: 3, semester: 2, level: 400, description: 'Business planning and development. Marketing strategies for agribusinesses. Supply chain management. Financial planning and management. Entrepreneurship in agriculture.', specialization: ['Agribusiness'], prerequisites: [] },
            { id: 'ANIM410', code: 'ANIM410', title: 'Animal Science Research Project', type: 'C', credits: 6, semester: 2, level: 400, description: 'Independent research on animal production or health. Research design and methodology. Data collection and analysis. Dissertation writing and presentation. Final research report submission.', specialization: ['Animal Science'], prerequisites: [] },
            { id: 'ANIM414', code: 'ANIM414', title: 'Applied Animal Breeding', type: 'C', credits: 3, semester: 2, level: 400, description: 'Breeding program design and implementation. Selection and mating strategies. Genetic improvement evaluation. Breeding for economically important traits. Record keeping and genetic evaluation.', specialization: ['Animal Science'], prerequisites: [] },
            { id: 'CROP422', code: 'CROP422', title: 'Crop Entomology and Integrated Pest Management', type: 'C', credits: 3, semester: 2, level: 400, description: 'Major crop insect pests identification. Pest biology and ecology. Economic damage assessment. Integrated pest management strategies. Pesticide application and safety.', specialization: ['Crop Science'], prerequisites: [] },
            { id: 'CROP426', code: 'CROP426', title: 'Plant Breeding and Crop Improvement', type: 'C', credits: 3, semester: 2, level: 400, description: 'Breeding methods and techniques. Genetic resources and germplasm conservation. Trait selection and evaluation. Variety development and release. Biotechnology in plant breeding.', specialization: ['Crop Science'], prerequisites: [] },
            { id: 'SOIL400', code: 'SOIL400', title: 'Soil Science Research Project', type: 'C', credits: 6, semester: 2, level: 400, description: 'Investigative soil science or agronomy project. Research proposal development. Field and laboratory work. Data analysis and interpretation. Dissertation and seminar presentation.', specialization: ['Soil Science'], prerequisites: [] },
            { id: 'SOIL412', code: 'SOIL412', title: 'Soil Biochemistry and Microbiology', type: 'C', credits: 3, semester: 2, level: 400, description: 'Microbial ecology and populations. Biochemical transformations in soil. Nitrogen fixation and cycling. Decomposition and nutrient dynamics. Rhizosphere processes and associations.', specialization: ['Soil Science'], prerequisites: [] },
            { id: 'FAPH424', code: 'FAPH424', title: 'Processing and Preservation of Agricultural Produce', type: 'C', credits: 3, semester: 2, level: 400, description: 'Processing principles and technologies. Preservation methods and food safety. Value addition processes. Processing plant design. Quality control in processing. Produce marketing strategy.', specialization: ['Postharvest Technology'], prerequisites: [] }
        ]
    }
};

export const SPECIALIZATIONS = ['Agricultural Economics', 'Agribusiness', 'Animal Science', 'Crop Science', 'Horticulture', 'Postharvest Technology', 'Soil Science', 'Agricultural Extension'];

export const useAcademicHubData = (userLevel: number, savedSpecialization?: string | null) => {
    const [semester, setSemester] = useState<1 | 2>(1);
    // Seed from the persisted profile value (Level 300/400) so the student is
    // not forced to re-select on every visit. Existing Level 100/200 users and
    // users with no saved value start as null.
    const [specialization, setSpecialization] = useState<string | null>(
        userLevel >= 300 ? (savedSpecialization ?? null) : null
    );
    const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [showCourseDetails, setShowCourseDetails] = useState(false);

    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setError(null);

        databases
            .listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.coursesCollectionId, [
                Query.equal('level', userLevel),
                Query.limit(100),
            ])
            .then((response) => {
                if (cancelled) return;
                const mapped: Course[] = response.documents.map((doc) => ({
                    id: doc.code,
                    code: doc.code,
                    title: doc.title,
                    credits: doc.credits,
                    type: doc.type,
                    semester: doc.semester,
                    level: doc.level,
                    description: doc.description,
                    prerequisites: doc.prerequisites ?? [],
                    specialization: doc.specialization ?? [],
                }));
                setAllCourses(mapped);
                setIsLoading(false);
            })
            .catch((err: unknown) => {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : 'Failed to load courses');
                setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [userLevel]);

    const semesterCourses = useMemo(
        () => allCourses.filter((c) => c.semester === semester),
        [allCourses, semester]
    );

    const filteredCourses = useMemo(() => {
        if (userLevel < 300) return semesterCourses;
        if (!specialization) return semesterCourses;
        return semesterCourses.filter(
            (c) => c.specialization.length === 0 || c.specialization.includes(specialization)
        );
    }, [semesterCourses, specialization, userLevel]);

    const sem1Count = useMemo(
        () => allCourses.filter((c) => c.semester === 1).length,
        [allCourses]
    );
    const sem2Count = useMemo(
        () => allCourses.filter((c) => c.semester === 2).length,
        [allCourses]
    );

    const selectedCourse = useMemo(() => {
        return allCourses.find((c) => c.id === selectedCourseId) || null;
    }, [allCourses, selectedCourseId]);

    // Persist the selected specialization to the student's profile via the
    // project's Appwrite service architecture. Returns the service result so
    // the caller can decide how to surface success/failure. Does not throw.
    const persistSpecialization = useCallback(
        async (value: string | null) => {
            const result = await AuthService.updateUserSpecialization(value);
            if (result.success) {
                setSpecialization(value);
            }
            return result;
        },
        []
    );

    return {
        semester,
        setSemester,
        specialization,
        setSpecialization,
        persistSpecialization,
        expandedCourse,
        setExpandedCourse,
        selectedCourseId,
        setSelectedCourseId,
        showCourseDetails,
        setShowCourseDetails,
        availableCourses: filteredCourses,
        sem1Count,
        sem2Count,
        selectedCourse,
        needsSpecializationSelection: userLevel >= 300 && !specialization,
        canToggleSemester: true,
        isLoading,
        error,
    };
};
