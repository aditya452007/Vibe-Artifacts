import React, { useState, useRef, useEffect } from 'react';
import { Download, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { restaurantData } from '../data/restaurantData';

export default function MenuSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef(null);
    const totalImages = restaurantData.menu.images.length;

    // Handle Share
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: restaurantData.name + ' Menu',
                    text: 'Check out the menu at ' + restaurantData.name + '!',
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    // Scroll to Image function
    const scrollToImage = (index) => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const itemWidth = container.offsetWidth;
        container.scrollTo({
            left: itemWidth * index,
            behavior: 'smooth'
        });
        setActiveIndex(index);
    };

    const handleNext = () => {
        const nextIndex = (activeIndex + 1) % totalImages;
        scrollToImage(nextIndex);
    };

    const handlePrev = () => {
        const prevIndex = (activeIndex - 1 + totalImages) % totalImages;
        scrollToImage(prevIndex);
    };

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const index = Math.round(container.scrollLeft / container.offsetWidth);
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };

    return (
        <section id="menu" className="py-20 lg:py-28 bg-premium-off-white dark:bg-premium-dark relative overflow-hidden transition-colors duration-500">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div className="text-center md:text-left w-full">
                        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                            {restaurantData.menu.title}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-sans max-w-lg">
                            {restaurantData.menu.description}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => document.getElementById('menu-download-link').click()}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all font-sans font-medium text-gray-700 active:scale-95"
                        >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                        </button>
                    </div>
                    <a id="menu-download-link" href={restaurantData.menu.images[activeIndex]} download={`${restaurantData.name.replace(/\s+/g, '-')}-Menu-${activeIndex + 1}.png`} className="hidden" />
                </div>

                {/* Carousel Container */}
                <div className="relative group">

                    {/* Nav Buttons (Desktop) */}
                    <button
                        onClick={handlePrev}
                        className="hidden md:flex absolute top-1/2 -left-6 lg:-left-12 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white border border-gray-100 shadow-lg hover:scale-110 transition-all text-gray-800"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="hidden md:flex absolute top-1/2 -right-6 lg:-right-12 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white border border-gray-100 shadow-lg hover:scale-110 transition-all text-gray-800"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Image Scroller */}
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 -mx-4 px-4 md:mx-0 md:px-0"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {restaurantData.menu.images.map((img, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-full snap-center transition-opacity duration-300 flex justify-center"
                            >
                                <div className={`
                            relative bg-white shadow-xl rounded-xl overflow-hidden transition-all duration-500
                            ${activeIndex === index ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}
                        `}>
                                    {/* Changed: Removed max-h constraint and object-cover to allow natural height */}
                                    <img
                                        src={img}
                                        alt={`${restaurantData.name} Menu Page ${index + 1}`}
                                        className="w-full h-auto object-contain max-h-[85vh] md:max-w-4xl mx-auto"
                                        loading={index === 0 ? "eager" : "lazy"}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center mt-4 gap-2">
                        {restaurantData.menu.images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => scrollToImage(idx)}
                                className={`transition-all duration-300 h-2 rounded-full ${activeIndex === idx ? 'w-8 bg-gray-800' : 'w-2 bg-gray-300'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
