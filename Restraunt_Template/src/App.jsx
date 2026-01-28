import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import PillNav from './components/ui/PillNav';
import Hero from './components/Hero';
import About from './components/About';
import MenuSection from './components/MenuSection';
import ReviewCTA from './components/ReviewCTA';
import ImageGallery from './components/ImageGallery';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import StickyActionBar from './components/StickyActionBar';
import BackgroundElements from './components/BackgroundElements';
import { restaurantData } from './data/restaurantData';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen bg-premium-off-white dark:bg-premium-dark transition-colors duration-500">
      <BackgroundElements />
      {/* <Navbar /> Old Navbar disabled */}
      <PillNav
        logo={restaurantData.logo}
        logoAlt={restaurantData.name}
        items={restaurantData.navItems}
        activeHref={window.location.hash} // Simple active state
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]"
        // Pass theme-aware colors ensuring high contrast and visibility
        // Premium Tone-on-Tone Palette (Fixes White-on-White / Black-on-Black invisible text)
        // Dark Mode: Base = Black, Pill = Deep Gray, Text = White
        // Light Mode: Base = White, Pill = Light Gray, Text = Black
        baseColor={isDark ? '#000000' : '#FFFFFF'}
        pillColor={isDark ? '#1a1a1a' : '#f4f4f5'} // Subtle contrast for the pill background
        pillTextColor={isDark ? '#FFFFFF' : '#000000'} // Pure White/Black for maximum readability
        hoveredPillTextColor={isDark ? '#FFFFFF' : '#000000'} // Keep text consistent on hover/active
      />

      <Hero />
      <About />
      <MenuSection />
      <ImageGallery />
      <Testimonials />
      <ReviewCTA />
      <Footer />
      <StickyActionBar />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
