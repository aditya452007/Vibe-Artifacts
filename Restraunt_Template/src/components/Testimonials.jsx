import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import { restaurantData } from "../data/restaurantData";

export default function Testimonials() {
    return (
        <section className="py-24 bg-premium-off-white dark:bg-premium-dark relative overflow-hidden transition-colors duration-500">
            {/* Section Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-12">
                <span className="inline-block px-3 py-1 mb-4 border border-red-200 rounded-full bg-red-50 dark:bg-red-900/20 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-medium tracking-wider uppercase font-sans">
                    Guest Love
                </span>
                <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
                    Stories from Our Patrons
                </h2>
                <div className="w-24 h-1 bg-red-500 mx-auto rounded-full mt-6"></div>
            </div>

            <div className="h-[25rem] rounded-md flex flex-col antialiased bg-premium-off-white dark:bg-premium-dark items-center justify-center relative overflow-hidden">
                <InfiniteMovingCards items={restaurantData.testimonials} direction="right" speed="slow" />
            </div>
        </section>
    );
}
