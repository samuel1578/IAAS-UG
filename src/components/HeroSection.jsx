import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import llkLogo from '../assets/lln.jpeg';
import desktopHero from '../assets/newhor.jpg';
import mobileHero from '../assets/mobbar.jpg';

const HeroSection = () => {
    const { isAuthenticated, userProfile } = useAuth();
    const navigate = useNavigate();
    const prefersReducedMotion = useReducedMotion();
    const heroIntro = prefersReducedMotion
        ? { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
        : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.65, ease: 'easeOut' } };

    const kenBurns = prefersReducedMotion
        ? { initial: false, animate: { scale: 1, opacity: 1 }, transition: { duration: 0 } }
        : {
            initial: { scale: 1.1, opacity: 0.84 },
            animate: { scale: 1, opacity: 1 },
            transition: { duration: 8, ease: 'easeOut' }
        };

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: prefersReducedMotion ? 0 : 0.12,
                delayChildren: prefersReducedMotion ? 0 : 0.08
            }
        }
    };

    const logoReveal = {
        hidden: prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.92 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: prefersReducedMotion
                ? { duration: 0 }
                : {
                    type: 'spring',
                    stiffness: 165,
                    damping: 30,
                    mass: 1
                }
        }
    };

    const pillContainer = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: prefersReducedMotion ? 0 : 0.09,
                delayChildren: prefersReducedMotion ? 0 : 0.08
            }
        }
    };

    const pillReveal = {
        hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.48, ease: 'easeOut' }
        }
    };

    const supportReveal = {
        hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
        show: {
            opacity: 1,
            y: 0,
            transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.52, ease: 'easeOut' }
        }
    };

    const guidanceReveal = {
        hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
        show: {
            opacity: 1,
            y: 0,
            transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.45, ease: 'easeOut' }
        }
    };

    const handlePrimaryCta = () => {
        if (isAuthenticated) {
            const targetLevel = userProfile?.level || '100';
            navigate(`/dashboard/${targetLevel}`);
        } else {
            navigate('/auth');
        }
    };

    return (
        <section className="relative min-h-[88vh] md:h-screen overflow-hidden">
            <motion.div {...kenBurns} className="absolute inset-0">
                <picture>
                    <source media="(max-width: 767px)" srcSet={mobileHero} />
                    <source media="(min-width: 768px)" srcSet={desktopHero} />
                    <img
                        src={desktopHero}
                        alt="School of Agriculture students in a field"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </picture>
            </motion.div>

            <div className="absolute inset-0 md:hidden bg-gradient-to-b from-black/38 via-black/32 to-black/44" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(242,169,0,0.1),transparent_58%)]" />

            <motion.div
                {...heroIntro}
                className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 py-7 sm:py-9 md:py-10 h-full flex items-stretch md:items-center justify-center"
            >
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="w-full h-full"
                >
                    <div className="max-w-[440px] md:max-w-6xl mx-auto px-3 sm:px-4 md:px-6 h-full flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-10">
                        <div className="w-full md:w-[40%] flex items-center justify-center md:justify-start pt-2 sm:pt-4 md:pt-0">
                            <motion.div
                                className="w-[10rem] h-[10rem] sm:w-[11rem] sm:h-[11rem] md:w-full md:max-w-[24rem] md:h-[65vh] rounded-[19px] md:rounded-[26px] border-4 md:border-[6px] border-white/85 shadow-xl p-2 bg-white/95 flex items-center justify-center"
                                variants={logoReveal}
                            >
                                <img
                                    src={llkLogo}
                                    alt="School of Agriculture Logo"
                                    className="w-[98%] h-[98%] object-contain rounded-[15px] md:rounded-[22px]"
                                />
                            </motion.div>
                        </div>

                        <div className="w-full md:w-[60%] flex flex-col items-center md:items-start justify-between md:justify-center text-center md:text-left bg-black/22 md:bg-transparent backdrop-blur-0 md:backdrop-blur-0 border border-white/10 md:border-none rounded-2xl md:rounded-none px-4 sm:px-6 md:px-0 py-5 sm:py-6 md:py-0">
                            <motion.h1
                                id="landing-heading"
                                variants={pillContainer}
                                className="hero-title mb-4 sm:mb-5 md:mb-4"
                            >
                                <motion.span variants={pillReveal} className="hero-kicker hero-pill">University of Ghana</motion.span>
                                <motion.span variants={pillReveal} className="hero-title-main hero-pill uppercase">School of Agriculture</motion.span>
                                <motion.span variants={pillReveal} className="hero-title-accent hero-pill hero-pill-accent">Student Hub</motion.span>
                            </motion.h1>

                            <motion.p
                                variants={supportReveal}
                                className="hero-support hero-support-pill max-w-2xl md:max-w-none mx-auto md:mx-0"
                            >
                                Cultivating knowledge. Harvesting excellence.
                                <span className="hero-support-break">Select your growth stage below to continue into your personalized academic ecosystem.</span>
                            </motion.p>

                            <motion.button
                                type="button"
                                onClick={handlePrimaryCta}
                                variants={guidanceReveal}
                                className="hero-cta hero-cta-pill mt-6 sm:mt-7 md:mt-6"
                            >
                                Enter Portal
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
