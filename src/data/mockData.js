export const coursesData = [
  {
    id: "CROP101",
    level: "100",
    title: "Introduction to Agriculture",
    code: "CROP 101",
    lecturer: "Dr. Emmanuel Mensah",
    slides: [
      { title: "CROP 101 Lec 1: Basics of Crop Production.pdf", size: "1.9 MB", date: "5 days ago" },
      { title: "CROP 101 Lec 2: Soil and Plant Relations.pdf", size: "3.1 MB", date: "2 weeks ago" }
    ],
    pastQuestions: [
      { title: "CROP 101 Mid-Sem 2024.pdf", year: "2024" },
      { title: "CROP 101 Main Exam 2023.pdf", year: "2023" }
    ]
  },
  {
    id: "PEBO205",
    level: "200",
    title: "Cell Biology and Genetics",
    code: "PEBO 205",
    lecturer: "Dr. Sarah Osei",
    slides: [
      { title: "PEBO 205 Lec 1: Intro to Cell Structure.pdf", size: "2.4 MB", date: "2 days ago" },
      { title: "PEBO 205 Lec 2: Mendelian Genetics.pptx", size: "4.1 MB", date: "1 week ago" }
    ],
    pastQuestions: [
      { title: "PEBO 205 Mid-Sem 2024.pdf", year: "2024" },
      { title: "PEBO 205 Main Exam 2023.pdf", year: "2023" }
    ]
  },
  {
    id: "SOIL201",
    level: "200",
    title: "Soil Science Fundamentals",
    code: "SOIL 201",
    lecturer: "Prof. Akosua Darko",
    slides: [
      { title: "SOIL 201 Lec 1: Soil Formation.pdf", size: "3.5 MB", date: "4 days ago" },
      { title: "SOIL 201 Lec 3: Soil Classification.pdf", size: "2.8 MB", date: "1 week ago" }
    ],
    pastQuestions: [
      { title: "SOIL 201 Mid-Sem 2024.pdf", year: "2024" }
    ]
  },
  {
    id: "CROP301",
    level: "300",
    title: "Crop Physiology",
    code: "CROP 301",
    lecturer: "Prof. Kwame Agyei",
    slides: [
      { title: "CROP 301 Lec 1: Photosynthesis.ppt", size: "1.8 MB", date: "3 days ago" },
      { title: "CROP 301 Lec 3: Water Rel. and Growth.pdf", size: "3.2 MB", date: "10 days ago" }
    ],
    pastQuestions: [
      { title: "Level 300 Sem 1 Past Ques (CROP 301).pdf", year: "2025" }
    ]
  },
  {
    id: "ANIM311",
    level: "300",
    title: "Animal Nutrition",
    code: "ANIM 311",
    lecturer: "Dr. Yaw Boateng",
    slides: [
      { title: "ANIM 311 Lec 1: Digestive Systems.pdf", size: "2.2 MB", date: "1 day ago" },
      { title: "ANIM 311 Lec 2: Feed Formulation.pdf", size: "3.7 MB", date: "6 days ago" }
    ],
    pastQuestions: [
      { title: "ANIM 311 Mid-Sem 2024.pdf", year: "2024" },
      { title: "ANIM 311 Main Exam 2023.pdf", year: "2023" }
    ]
  },
  {
    id: "CROP410",
    level: "400",
    title: "Advanced Crop Production",
    code: "CROP 410",
    lecturer: "Prof. Kwame Agyei",
    slides: [
      { title: "CROP 410 Lec 1: Modern Farming Techniques.pdf", size: "4.5 MB", date: "1 day ago" },
      { title: "CROP 410 Lec 4: Climate Smart Agriculture.pdf", size: "5.2 MB", date: "3 days ago" }
    ],
    pastQuestions: [
      { title: "CROP 410 Mid-Sem 2024.pdf", year: "2024" }
    ]
  },
  {
    id: "PROJ400",
    level: "400",
    title: "Research Project",
    code: "PROJ 400",
    lecturer: "Various Supervisors",
    slides: [
      { title: "PROJ 400 Research Methodology.pdf", size: "2.1 MB", date: "2 weeks ago" },
      { title: "PROJ 400 Thesis Writing Guide.pdf", size: "1.7 MB", date: "3 weeks ago" }
    ],
    pastQuestions: []
  }
];

export const facultyData = [
  {
    name: "Prof. Kwame Agyei",
    department: "Crop Science",
    role: "Head of Department",
    officeHours: "Tues & Thurs, 10:00 AM - 12:00 PM",
    email: "kagyei@ug.edu.gh",
    courses: ["CROP 301", "CROP 410"]
  },
  {
    name: "Dr. Sarah Osei",
    department: "Animal Biology / Genetics",
    role: "Senior Lecturer",
    officeHours: "Wednesdays, 1:00 PM - 3:00 PM",
    email: "sosei@ug.edu.gh",
    courses: ["PEBO 205", "ANIM 311"]
  },
  {
    name: "Dr. Emmanuel Mensah",
    department: "Crop Science",
    role: "Lecturer",
    officeHours: "Mondays, 2:00 PM - 4:00 PM",
    email: "emensah@ug.edu.gh",
    courses: ["CROP 101"]
  },
  {
    name: "Prof. Akosua Darko",
    department: "Soil Science",
    role: "Professor",
    officeHours: "Fridays, 9:00 AM - 11:00 AM",
    email: "adarko@ug.edu.gh",
    courses: ["SOIL 201"]
  },
  {
    name: "Dr. Yaw Boateng",
    department: "Animal Science",
    role: "Senior Lecturer",
    officeHours: "Tuesdays, 3:00 PM - 5:00 PM",
    email: "yboateng@ug.edu.gh",
    courses: ["ANIM 311"]
  }
];

export const srcNoticeboardData = [
  {
    id: 1,
    tag: "Urgent",
    title: "CROP 301 Lecture Relocated",
    message: "Today's Crop Physiology lecture has been moved from Room 2 to the Main Agric Auditorium due to projector maintenance.",
    date: "Today, 08:30 AM"
  },
  {
    id: 2,
    tag: "Event",
    title: "Agric Week Townhall",
    message: "Join the SRC this Friday at 4 PM for the semesterly townhall. Discussion on farm practicals and equipment allocation.",
    date: "Yesterday, 14:00 PM"
  },
  {
    id: 3,
    tag: "Important",
    title: "Lab Coat Requirement - All Practical Sessions",
    message: "Reminder: All students must wear proper lab coats during practical sessions. Available for purchase at the departmental store.",
    date: "2 days ago, 11:00 AM"
  },
  {
    id: 4,
    tag: "Event",
    title: "Guest Lecture: Sustainable Farming Practices",
    message: "Dr. Kofi Annan from FAO will be delivering a guest lecture on sustainable farming practices. Thursday, 2 PM at the Main Auditorium.",
    date: "3 days ago, 09:15 AM"
  },
  {
    id: 5,
    tag: "Notice",
    title: "Field Trip Registration Open",
    message: "Registration for the Level 300 field trip to Akosombo Farms is now open. Limited slots available. Deadline: Next Monday.",
    date: "4 days ago, 16:30 PM"
  }
];

export const labLogbookData = [
  {
    id: 1,
    seedType: "Maize",
    initialWeight: 12.5,
    timeImmersed: 24,
    finalWeight: 18.7,
    rate: "49.6%",
    date: "Feb 28, 2026"
  },
  {
    id: 2,
    seedType: "Beans",
    initialWeight: 10.2,
    timeImmersed: 18,
    finalWeight: 14.8,
    rate: "45.1%",
    date: "Feb 27, 2026"
  },
  {
    id: 3,
    seedType: "Groundnut",
    initialWeight: 15.0,
    timeImmersed: 20,
    finalWeight: 21.3,
    rate: "42.0%",
    date: "Feb 26, 2026"
  }
];

export const growthStages = [
  {
    id: "100",
    title: "Seedling Stage",
    subtitle: "Level 100",
    description: "Begin your journey in agricultural sciences. Discover survival guides, introductory resources, and essential study tools designed to help first-year students adapt to university life and agricultural studies.",
    color: "#8BC34A"
  },
  {
    id: "200",
    title: "Vegetative Stage",
    subtitle: "Level 200",
    description: "Build a strong academic foundation. Access course materials, past examination questions, and collaborative study tools designed to strengthen your understanding of agricultural systems and practices.",
    color: "#4CAF50"
  },
  {
    id: "300",
    title: "Branching Stage",
    subtitle: "Level 300",
    description: "Explore specialization pathways and develop professional skills. Learn about different departments within the School of Agriculture and prepare for advanced coursework and research opportunities.",
    color: "#00796B"
  },
  {
    id: "400",
    title: "Harvest Stage",
    subtitle: "Level 400",
    description: "Prepare for life after graduation. Track internships, prepare for final projects, and explore career pathways in agriculture, agribusiness, and research.",
    color: "#F2A900"
  }
];

export const campusLocations = {
  start: ["Main Gate", "Diaso", "Night Market", "Mensah Sarbah Hall"],
  destination: ["Crop Field A", "Soil Science Building", "Animal House", "Agric Auditorium"]
};
