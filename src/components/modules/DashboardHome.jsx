import {
  MdTimeline,
  MdMenuBook,
  MdLibraryBooks,
  MdHistory,
  MdCampaign,
  MdApps,
  MdAutoStories,
  MdCalendarMonth,
  MdMap,
  MdScience,
  MdPeople,
  MdNotifications,
  MdNorthEast,
  MdMenuBook as MdOpenBook,
  MdTune
} from 'react-icons/md';
import Button from '../Button';
import { useAuth } from '../../contexts/AuthContext';
import { useAcademicHubData } from '../../hooks/useAcademicHubData';
import { MaterialService } from '../../lib/appwrite';
import Skeleton from '../skeletons/Skeleton';
import LatestNotices from './LatestNotices';
import { useState, useEffect } from 'react';
import { MdArrowOutward, MdInsertDriveFile } from 'react-icons/md';
import { useWeather } from '../../hooks/useWeather';
import StudentHighlightsCarousel from './StudentHighlightsCarousel';

const DEPARTMENT_LABELS = {
  Bsc_Agricultural_Science: 'BSc Agricultural Science',
  Bsc_Food_and_Consumer_Science: 'BSc Food and Consumer Science'
};

const LEVELS = [100, 200, 300, 400];

const formatDepartment = (department) => {
  if (!department) return '';
  return DEPARTMENT_LABELS[department] ?? department;
};

const normalizeLevel = (level) => {
  if (level === undefined || level === null || level === '') return null;
  const numeric = parseInt(String(level), 10);
  return LEVELS.includes(numeric) ? numeric : null;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

// A single structural section shell. Title, icon and children.
const SectionCard = ({ title, icon: Icon, children, className = '', titleId }) => (
  <section
    className={`bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 ${className}`}
  >
    <div className="flex items-center gap-3 mb-3">
      {Icon && (
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6F4EA] text-[#00592D]"
        >
          <Icon className="h-5 w-5" />
        </span>
      )}
      <h2 id={titleId} className="font-bold text-[#1E4620] text-lg sm:text-xl leading-tight">
        {title}
      </h2>
    </div>
    {children}
  </section>
);

const PlaceholderNote = ({ children }) => (
  <p className="text-[#1E4620]/70 text-sm sm:text-base leading-relaxed">{children}</p>
);

const QUICK_TOOLS = [
  { label: 'Campus Map', icon: MdMap, module: 'map' },
  { label: 'Lab Logbook', icon: MdScience, module: 'logbook' },
  { label: 'Faculty', icon: MdPeople, module: 'faculty' },
  { label: 'SRC Noticeboard', icon: MdNotifications, module: 'noticeboard' }
];

// Quick Tools: interactive shortcuts that switch the active dashboard module
// via the existing onNavigate callback. Each is a real <button> so it's
// keyboard-accessible; no routes, URL changes, or reloads.
const QuickTools = ({ onNavigate }) => {
  const handleNavigate = (module) => {
    if (typeof onNavigate === 'function') onNavigate(module);
  };

  return (
    <ul className="grid grid-cols-2 gap-2.5">
      {QUICK_TOOLS.map(({ label, icon: ToolIcon, module }) => (
        <li key={module}>
          <button
            type="button"
            onClick={() => handleNavigate(module)}
            className="w-full flex items-center gap-3 rounded-lg border border-[#E5E7EB] bg-[#F8F9FA] p-3 text-left transition-colors hover:bg-[#E6F4EA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00592D]"
          >
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E6F4EA] text-[#00592D]"
            >
              <ToolIcon className="h-4 w-4" />
            </span>
            <span className="text-[#1E4620] text-sm sm:text-base font-medium">{label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

// Academic Journey card: a real, profile-driven academic identity / journey.
// No fake progress, GPA, credits, or completion metrics — only level progression.
const AcademicJourney = ({ userProfile, onNavigate }) => {
  const level = normalizeLevel(userProfile.level);
  const department = formatDepartment(userProfile.department);
  const specialization = userProfile.specialization;

  const isUpperLevel = level === 300 || level === 400;
  const needsSpecialization = isUpperLevel && !specialization;

  return (
    <div className="space-y-4">
      {/* Identity summary */}
      <div className="space-y-1">
        {department ? (
          <p className="font-semibold text-[#1E4620] text-base sm:text-lg leading-tight">
            {department}
          </p>
        ) : (
          <p className="font-semibold text-[#1E4620]/60 text-base sm:text-lg leading-tight">
            Programme not set
          </p>
        )}

        {level ? (
          <p className="text-[#1E4620]/80 text-sm sm:text-base font-medium">
            Level {level}
          </p>
        ) : (
          <p className="text-[#1E4620]/60 text-sm sm:text-base font-medium">
            Level not set
          </p>
        )}

        {isUpperLevel &&
          (specialization ? (
            <p className="text-[#F2A900] font-semibold text-sm sm:text-base">
              {specialization} Specialization
            </p>
          ) : (
            <p className="text-[#D98A00] font-semibold text-sm sm:text-base">
              Specialization not selected
            </p>
          ))}
      </div>

      {/* Level journey indicator (only when level is valid) */}
      {level && (
        <div>
          <p className="sr-only">Current academic level: Level {level}</p>
          <ol className="flex items-center gap-2 sm:gap-3" aria-hidden="true">
            {LEVELS.map((lvl, idx) => {
              const isCurrent = lvl === level;
              const isPast = lvl < level;
              const isLast = idx === LEVELS.length - 1;

              let markerClass =
                'border border-[#E5E7EB] bg-white text-[#9CA3AF]'; // future/inactive
              if (isPast) {
                markerClass = 'border border-[#004620] bg-[#E6F4EA] text-[#004620]';
              }
              if (isCurrent) {
                markerClass =
                  'border-2 border-[#00592D] bg-[#00592D] text-white ring-2 ring-[#00592D]/20';
              }

              return (
                <li key={lvl} className="flex items-center gap-2 sm:gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-sm sm:text-base font-bold ${markerClass}`}
                    >
                      {isCurrent ? lvl : isPast ? '✓' : lvl}
                    </span>
                    <span
                      className={`text-[11px] sm:text-xs font-medium ${
                        isCurrent
                          ? 'text-[#00592D]'
                          : isPast
                            ? 'text-[#004620]'
                            : 'text-[#9CA3AF]'
                      }`}
                    >
                      {lvl}
                    </span>
                  </div>
                  {!isLast && (
                    <span
                      className={`h-0.5 w-4 sm:w-6 rounded-full ${
                        lvl < level ? 'bg-[#004620]' : 'bg-[#E5E7EB]'
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {needsSpecialization && (
          <Button
            variant="secondary"
            size="small"
            icon={MdTune}
            onClick={() => onNavigate('academic')}
          >
            Choose Specialization
          </Button>
        )}
        <Button
          variant="outline"
          size="small"
          icon={MdOpenBook}
          onClick={() => onNavigate('academic')}
        >
          Open Academic Hub
        </Button>
      </div>
    </div>
  );
};

// Your Courses: a compact, profile-driven preview that reuses the canonical
// Academic Hub course read + filtering via useAcademicHubData. No independent
// filtering implementation lives here. The specialization rule (shared/core OR
// matching specialization) is applied by the hook exactly as in Academic Hub.
const YourCourses = ({ userProfile, onNavigate }) => {
  const level = normalizeLevel(userProfile.level);
  const specialization = userProfile.specialization ?? null;
  const studentLevel = level ?? 100;

  // Reuse the same default semester Academic Hub uses (Semester 1) so Home
  // stays consistent with the Academic Hub preview and we don't fabricate a
  // "current semester" the app doesn't actually track.
  const {
    availableCourses,
    needsSpecializationSelection,
    isLoading,
    error
  } = useAcademicHubData(studentLevel, specialization);

  const preview = availableCourses.slice(0, 4);

  // Invalid/missing level → non-misleading notice, no fabricated progression.
  if (!level) {
    return (
      <PlaceholderNote>
        Your academic level is not available yet.
      </PlaceholderNote>
    );
  }

  // Level 300/400 without specialization → don't show misleading
  // specialization-specific courses; guide the student to pick one.
  if (needsSpecializationSelection) {
    return (
      <div className="space-y-3">
        <PlaceholderNote>
          Choose your specialization in Academic Hub to see your personalized courses.
        </PlaceholderNote>
        <Button
          variant="outline"
          size="small"
          icon={MdTune}
          onClick={() => onNavigate('academic')}
        >
          Choose Specialization
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <ul className="space-y-2.5" aria-busy="true" aria-label="Loading your courses">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] bg-[#F8F9FA] p-3">
            <Skeleton width="3.5rem" height="1.5rem" rounded="lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton width="70%" height="0.875rem" rounded="md" />
              <Skeleton width="40%" height="0.75rem" rounded="md" />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <PlaceholderNote>
          We couldn't load your courses right now. You can still browse them in Academic Hub.
        </PlaceholderNote>
        <Button
          variant="outline"
          size="small"
          icon={MdOpenBook}
          onClick={() => onNavigate('academic')}
        >
          Open Academic Hub
        </Button>
      </div>
    );
  }

  if (preview.length === 0) {
    return (
      <div className="space-y-3">
        <PlaceholderNote>No courses are available for this selection yet.</PlaceholderNote>
        <Button
          variant="outline"
          size="small"
          icon={MdOpenBook}
          onClick={() => onNavigate('academic')}
        >
          Open Academic Hub
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2.5">
        {preview.map((course) => (
          <li key={course.id}>
            <button
              type="button"
              onClick={() => onNavigate('academic')}
              className="w-full flex items-center gap-3 rounded-lg border border-[#E5E7EB] bg-[#F8F9FA] p-3 text-left transition-colors hover:bg-[#E6F4EA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00592D]"
            >
              <span
                className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold text-white ${
                  course.type === 'C' ? 'bg-[#00592D]' : 'bg-[#F2A900]'
                }`}
              >
                {course.code}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-[#1E4620] text-sm sm:text-base">
                  {course.title}
                </span>
                <span className="block text-xs sm:text-sm text-[#1E4620]/70">
                  {course.credits} credits
                  {course.type === 'C' ? ' • Core' : ' • Elective'}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Button
        variant="outline"
        size="small"
        icon={MdArrowOutward}
        onClick={() => onNavigate('academic')}
      >
        View All Courses
      </Button>
    </div>
  );
};

const MATERIAL_TYPE_LABELS = {
  'lecture slides': 'Lecture Slides',
  notes: 'Notes',
  assignments: 'Assignments',
  recordings: 'Recordings'
};

const formatMaterialType = (type) => {
  if (!type) return '';
  return MATERIAL_TYPE_LABELS[type] ?? type;
};

// Local, dependency-free human-readable date. Mirrors the project's existing
// use of toLocaleDateString() elsewhere (e.g. CourseDetailsModal).
const formatUploadedDate = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Recent Materials: compact, profile-relevant preview that reuses the canonical
// Academic Hub course context (useAcademicHubData) for relevance and a narrowly
// scoped MaterialService.getRecentMaterials query (level + semester, newest
// first). No independent specialization rules are duplicated — relevance is the
// student's already-filtered course codes from useAcademicHubData.
const RecentMaterials = ({ userProfile, onNavigate }) => {
  const level = normalizeLevel(userProfile.level);
  const specialization = userProfile.specialization ?? null;
  const studentLevel = level ?? 100;

  // Reuse the same Semester 1 convention as Academic Hub / Your Courses.
  const SEMESTER = 1;

  const {
    availableCourses,
    needsSpecializationSelection,
    error: courseError
  } = useAcademicHubData(studentLevel, specialization);

  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    MaterialService.getRecentMaterials(studentLevel, SEMESTER, 3)
      .then((result) => {
        if (cancelled) return;
        if (!result.success) {
          setError(result.error || 'Failed to load materials');
          setMaterials([]);
        } else {
          setMaterials(result.materials || []);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Failed to load materials');
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [studentLevel, SEMESTER]);

  // Invalid/missing level → non-misleading notice.
  if (!level) {
    return (
      <PlaceholderNote>Your academic level is not available yet.</PlaceholderNote>
    );
  }

  // Level 300/400 without specialization → don't surface potentially unrelated
  // specialization-specific materials; guide the student to pick one.
  if (needsSpecializationSelection) {
    return (
      <div className="space-y-3">
        <PlaceholderNote>
          Choose your specialization in Academic Hub to see materials relevant to your courses.
        </PlaceholderNote>
        <Button
          variant="outline"
          size="small"
          icon={MdTune}
          onClick={() => onNavigate('academic')}
        >
          Choose Specialization
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <ul className="space-y-2.5" aria-busy="true" aria-label="Loading recent materials">
        {Array.from({ length: 3 }).map((_, i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] bg-[#F8F9FA] p-3"
          >
            <Skeleton width="3.5rem" height="1.5rem" rounded="lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton width="60%" height="0.875rem" rounded="md" />
              <Skeleton width="45%" height="0.75rem" rounded="md" />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (error || courseError) {
    return (
      <div className="space-y-3">
        <PlaceholderNote>We couldn't load recent materials right now.</PlaceholderNote>
        <Button
          variant="outline"
          size="small"
          icon={MdOpenBook}
          onClick={() => onNavigate('academic')}
        >
          Open Academic Hub
        </Button>
      </div>
    );
  }

  // Relevance: keep only materials whose course is in the student's already
  // filtered (level + semester + specialization) course set. Then newest first.
  const relevantCodes = new Set(availableCourses.map((c) => c.code));
  const relevant = materials
    .filter((m) => relevantCodes.has(m.courseCode))
    .slice(0, 3);

  if (relevant.length === 0) {
    return (
      <div className="space-y-3">
        <PlaceholderNote>No recent materials are available yet.</PlaceholderNote>
        <Button
          variant="outline"
          size="small"
          icon={MdOpenBook}
          onClick={() => onNavigate('academic')}
        >
          Open Academic Hub
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2.5">
        {relevant.map((material) => (
          <li key={material.$id}>
            <button
              type="button"
              onClick={() => onNavigate('academic')}
              className="w-full flex items-start gap-3 rounded-lg border border-[#E5E7EB] bg-[#F8F9FA] p-3 text-left transition-colors hover:bg-[#E6F4EA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00592D]"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E6F4EA] text-[#00592D]"
              >
                <MdInsertDriveFile className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#00592D] px-2 py-0.5 text-xs font-bold text-white">
                    {material.courseCode}
                  </span>
                  <span className="truncate font-semibold text-[#1E4620] text-sm sm:text-base">
                    {material.title}
                  </span>
                </span>
                <span className="mt-0.5 block text-xs sm:text-sm text-[#1E4620]/70">
                  {formatMaterialType(material.materialType)}
                  {formatUploadedDate(material.uploadedDate) &&
                    ` • ${formatUploadedDate(material.uploadedDate)}`}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Button
        variant="outline"
        size="small"
        icon={MdArrowOutward}
        onClick={() => onNavigate('academic')}
      >
        View All Materials
      </Button>
    </div>
  );
};

const DashboardHome = ({ onNavigate }) => {
  const { userProfile } = useAuth();
  if (!userProfile) return null;

  // Reuse the existing live-weather hook. Its localStorage cache (20-min TTL)
  // means a second hook instance reads fresh data without a duplicate network
  // request, so this complements the DashboardLayout pill rather than
  // refetching. Falls back gracefully when unavailable.
  const { temperature, description, isLoading, error } = useWeather();

  const greeting = getGreeting();
  const firstName = userProfile.name?.split(' ')[0] ?? userProfile.name ?? '';
  const department = formatDepartment(userProfile.department);
  const specialization = userProfile.specialization;
  const showSpecialization = Boolean(specialization) && userProfile.level !== '100' && userProfile.level !== '200';

  // Compact Legon weather context — tertiary to the student's identity.
  let weatherContext = null;
  if (isLoading) {
    weatherContext = 'Weather updating…';
  } else if (!error && temperature !== null && description) {
    weatherContext = `Legon • ${Math.round(temperature)}°C • ${description}`;
  }

  return (
    <div className="space-y-4 lg:space-y-5">
      {/* PERSONALIZED HEADER */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8">
        <h1 className="font-bold text-[#1E4620] text-2xl lg:text-3xl leading-tight">
          {greeting}, {firstName}
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[#1E4620] text-base lg:text-lg">
          <span className="font-semibold">Level {userProfile.level}</span>
          {department && (
            <>
              <span className="text-[#E5E7EB]">•</span>
              <span className="font-medium">{department}</span>
            </>
          )}
        </div>

        {showSpecialization && (
          <div className="mt-2 text-[#F2A900] font-semibold text-base lg:text-lg">
            {specialization} Specialization
          </div>
        )}

        {weatherContext && (
          <div className="mt-2 text-[#1E4620]/60 text-sm sm:text-base leading-tight">
            {weatherContext}
          </div>
        )}
      </div>

      {/* ACADEMIC JOURNEY + QUICK TOOLS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        <SectionCard
          title="Academic Journey"
          icon={MdTimeline}
          className="lg:col-span-2"
          titleId="academic-journey"
        >
          <AcademicJourney userProfile={userProfile} onNavigate={onNavigate} />
        </SectionCard>

        <SectionCard title="Quick Tools" icon={MdApps} titleId="quick-tools">
          <QuickTools onNavigate={onNavigate} />
        </SectionCard>
      </div>

      {/* YOUR COURSES + RECENT MATERIALS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        <SectionCard title="Your Courses" icon={MdMenuBook} titleId="your-courses">
          <YourCourses userProfile={userProfile} onNavigate={onNavigate} />
        </SectionCard>

        <SectionCard title="Recent Materials" icon={MdLibraryBooks} titleId="recent-materials">
          <RecentMaterials userProfile={userProfile} onNavigate={onNavigate} />
        </SectionCard>
      </div>

      {/* LATEST NOTICES + STUDENT HIGHLIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        <SectionCard title="Latest Notices" icon={MdCampaign} titleId="latest-notices">
          <LatestNotices onNavigate={onNavigate} />
        </SectionCard>

        <SectionCard title="Student Highlights" icon={MdAutoStories} titleId="student-highlights">
          <StudentHighlightsCarousel />
        </SectionCard>
      </div>

      {/* RECENTLY VIEWED */}
      <SectionCard title="Recently Viewed" icon={MdHistory} titleId="recently-viewed">
        <PlaceholderNote>
          Your recently viewed courses and materials will appear here.
        </PlaceholderNote>
      </SectionCard>

      {/* ACADEMIC CALENDAR — COMING SOON */}
      <SectionCard title="Academic Calendar" icon={MdCalendarMonth} titleId="academic-calendar">
        <PlaceholderNote>
          Your semester dates, academic deadlines, and important events will appear here.
        </PlaceholderNote>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#F2A900]/40 bg-[#F2A900]/10 px-3 py-1 text-sm font-semibold text-[#D98A00]">
          <MdNorthEast className="h-4 w-4" aria-hidden="true" />
          Coming Soon
        </span>
      </SectionCard>
    </div>
  );
};

export default DashboardHome;
