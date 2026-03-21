import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls the page to the top whenever the route changes.
 * This mimics the behavior of a traditional page load.
 * 
 * Usage: Place this component inside BrowserRouter, before your Routes
 * Example in App.tsx:
 * <BrowserRouter>
 *   <ScrollToTop />
 *   <Routes>{...}</Routes>
 * </BrowserRouter>
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null; // This component doesn't render anything
};

export default ScrollToTop;
