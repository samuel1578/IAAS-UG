import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { HighlightsService } from '../../lib/appwrite';
import Skeleton from '../skeletons/Skeleton';

const formatLevel = (level) => {
  if (!level) return '';
  const numeric = String(level).replace(/[^0-9]/g, '');
  return numeric ? `Level ${numeric}` : String(level);
};

// Single testimonial card: message is the primary content; identity is textual
// (student name + level). No status / userId / approvedBy / internal IDs.
const HighlightCard = ({ highlight }) => (
  <figure className="flex h-full flex-col rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] p-5">
    <blockquote className="flex-1 text-[#1E4620] text-sm sm:text-base leading-relaxed">
      <p className="line-clamp-6">"{highlight.message}"</p>
    </blockquote>
    <figcaption className="mt-4 flex items-center justify-between gap-3 border-t border-[#E5E7EB] pt-3">
      <span className="font-semibold text-[#1E4620] text-sm sm:text-base">
        {highlight.studentName}
      </span>
      <span className="shrink-0 rounded-full bg-[#E6F4EA] px-3 py-1 text-xs font-semibold text-[#00592D]">
        {formatLevel(highlight.level)}
      </span>
    </figcaption>
  </figure>
);

const LoadingState = () => (
  <div className="space-y-3" aria-busy="true" aria-label="Loading student highlights">
    {Array.from({ length: 2 }).map((_, i) => (
      <div
        key={i}
        className="rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] p-5"
      >
        <Skeleton width="100%" height="3.5rem" rounded="md" />
        <div className="mt-4 flex items-center justify-between">
          <Skeleton width="40%" height="1rem" rounded="md" />
          <Skeleton width="4.5rem" height="1.25rem" rounded="full" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="space-y-2">
    <p className="font-semibold text-[#1E4620] text-sm sm:text-base">
      Student stories will appear here soon.
    </p>
    <p className="text-[#1E4620]/70 text-sm sm:text-base leading-relaxed">
      Approved highlights from the IAAS-UG community will be featured here.
    </p>
  </div>
);

const ErrorState = () => (
  <p className="text-[#1E4620]/80 text-sm sm:text-base leading-relaxed">
    We couldn't load student highlights right now.
  </p>
);

const StudentHighlightsCarousel = () => {
  const [highlights, setHighlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(false);

    HighlightsService.getApprovedHighlights(3)
      .then((result) => {
        if (cancelled) return;
        if (!result.success) {
          setError(true);
          setHighlights([]);
        } else {
          setHighlights(result.highlights || []);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (highlights.length === 0) return <EmptyState />;

  // One slide per view (mobile and desktop) for a compact, balanced card.
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={16}
      pagination={{ clickable: true }}
      navigation
      modules={[Pagination, Navigation, A11y]}
      a11y={{ enabled: true }}
      style={{
        '--swiper-pagination-color': '#00592D',
        '--swiper-pagination-bullet-inactive-color': '#9CA3AF',
        '--swiper-navigation-color': '#00592D',
        '--swiper-navigation-size': '28px',
        paddingBottom: '32px'
      }}
      className="student-highlights-swiper"
    >
      {highlights.map((highlight) => (
        <SwiperSlide key={highlight.$id} className="h-auto">
          <HighlightCard highlight={highlight} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default StudentHighlightsCarousel;
