import ugLogo from '../assets/uglogo.png';
import llnLogo from '../assets/lln.jpeg';

const Footer = ({ footer }) => {
    return (
        <footer className="bg-[#00592D] text-white px-6 py-10">
            <div className="max-w-7xl mx-auto font-['Gelasio']">
                {/* Desktop Layout: 3-column with logos on sides */}
                <div className="hidden md:flex md:items-center md:justify-between gap-12">
                    {/* Left: UG Logo with Rounded Rectangle Background */}
                    <div className="flex-shrink-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-[25px] bg-[#E6F4EA]/30 flex items-center justify-center shadow-lg">
                            <img
                                src={ugLogo}
                                alt="University of Ghana Logo"
                                className="h-24 w-auto"
                            />
                        </div>
                    </div>

                    {/* Center: Content */}
                    <div className="flex-1 text-center">
                        <h2 className="text-2xl font-bold font-['Gelasio'] text-white">{footer.title}</h2>
                        <p className="text-white/85 mt-3 text-base leading-relaxed font-['Gelasio']">{footer.subtitle}</p>
                        {footer.subtext && <p className="text-white/80 mt-2 text-sm italic font-['Gelasio']">{footer.subtext}</p>}
                        <p className="text-sm text-white/70 mt-4 font-['Gelasio']">{footer.copyright}</p>

                        {/* SRC Credit with Formatting */}
                        <div className="mt-6 flex items-center justify-center gap-2">
                            <span className="text-white/70 font-['Gelasio']">Made by</span>
                            <span className="text-lg font-bold text-[#F2A900] font-['Gelasio']">2025/2026 Agriculture SRC</span>
                        </div>
                    </div>

                    {/* Right: LLN Logo with Rounded Rectangle Background */}
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-[25px] overflow-hidden shadow-lg">
                            <img
                                src={llnLogo}
                                alt="LLN Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Layout: Single column stacked */}
                <div className="md:hidden flex flex-col items-center gap-8">
                    {/* Centered Logos - Larger with Containers */}
                    <div className="flex items-center justify-center gap-6 pt-2">
                        {/* Left: UG Logo with Rounded Rectangle */}
                        <div className="flex-shrink-0 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-[25px] bg-[#E6F4EA]/30 flex items-center justify-center shadow-lg">
                                <img
                                    src={ugLogo}
                                    alt="University of Ghana Logo"
                                    className="h-20 w-auto"
                                />
                            </div>
                        </div>

                        {/* Right: LLN Logo with Rounded Rectangle */}
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-[25px] overflow-hidden shadow-lg">
                                <img
                                    src={llnLogo}
                                    alt="LLN Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Centered Content */}
                    <div className="text-center font-['Gelasio']">
                        <h2 className="text-lg font-bold font-['Gelasio']">{footer.title}</h2>
                        <p className="text-white/80 mt-2 text-sm leading-relaxed font-['Gelasio']">{footer.subtitle}</p>
                        {footer.subtext && <p className="text-white/75 mt-1 text-xs italic font-['Gelasio']">{footer.subtext}</p>}
                        <p className="text-xs text-white/70 mt-3 font-['Gelasio']">{footer.copyright}</p>
                    </div>

                    {/* SRC Credit - Last Element */}
                    <div className="flex items-center justify-center gap-1 flex-wrap">
                        <span className="text-xs text-white/70 font-['Gelasio']">Made by</span>
                        <span className="text-sm font-bold text-[#F2A900] font-['Gelasio']">2025/2026 Agriculture SRC</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
