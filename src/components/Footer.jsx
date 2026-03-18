import { Link } from 'react-router-dom';

const Footer = ({ footer }) => {
    return (
        <footer className="bg-[#00592D] text-white px-6 py-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h2 className="text-xl font-semibold">{footer.title}</h2>
                    <p className="text-white/80 mt-1">{footer.subtitle}</p>
                    {footer.subtext && <p className="text-white/75 mt-1">{footer.subtext}</p>}
                    <p className="text-sm text-white/70 mt-3">{footer.copyright}</p>
                </div>

                <nav className="flex items-center gap-4">
                    {footer.links.map((link) => (
                        <Link key={link.id} to={link.href} className="text-white/90 hover:text-white transition-colors">
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
