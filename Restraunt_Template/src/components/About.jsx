import React from 'react';
import { restaurantData } from '../data/restaurantData';
import ScrollStack, { ScrollStackItem } from './ui/ScrollStack';

export default function About() {
    return (
        <section id="about" className="relative w-full min-h-screen bg-premium-off-white dark:bg-premium-dark overflow-hidden py-20">
            <ScrollStack>
                {/* 1. Our Story */}
                <ScrollStackItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
                        {/* Left: Text */}
                        <div className="flex flex-col justify-center p-12 md:p-24 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-white/5">
                            <span className="text-amber-600 dark:text-amber-500 font-medium tracking-widest uppercase mb-4 text-sm">
                                {restaurantData.hero.established}
                            </span>
                            <h2 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                                {restaurantData.about.title}
                            </h2>
                            <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-400 font-light max-w-lg">
                                {restaurantData.about.description}
                                <br /><br />
                                We started with a simple dream: to bring the authentic flavors of our heritage to your plate, reimagined for the modern palate.
                            </p>
                        </div>
                        {/* Right: Blank Box (Premium Placeholder) */}
                        <div className="relative bg-gray-50 dark:bg-zinc-950 flex items-center justify-center overflow-hidden">
                            <div className="w-[80%] h-[80%] rounded-[30px] bg-gradient-to-br from-white to-gray-100 dark:from-zinc-900 dark:to-black border border-white/50 dark:border-white/5 shadow-inner flex items-center justify-center">
                                {/* Option: Subtle pattern or completely blank */}
                                <div className="text-gray-300 dark:text-zinc-800 font-sans font-bold text-9xl opacity-20 select-none">
                                    01
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollStackItem>

                {/* 2. Philosophy */}
                <ScrollStackItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
                        {/* Left: Text */}
                        <div className="flex flex-col justify-center p-12 md:p-24 bg-stone-50 dark:bg-zinc-900 border-r border-gray-200 dark:border-white/5">
                            <span className="text-amber-600 dark:text-amber-500 font-medium tracking-widest uppercase mb-4 text-sm">
                                Core Values
                            </span>
                            <h2 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                                Culinary <br /><span className="text-amber-600 dark:text-amber-500">Philosophy</span>
                            </h2>
                            <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-400 font-light max-w-lg mb-8">
                                We believe in the purity of ingredients. Our chefs meticulously select locally sourced produce to create flavors that are both authentic and innovative.
                            </p>
                            <ul className="space-y-4">
                                {restaurantData.features.slice(0, 3).map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Right: Blank Box */}
                        <div className="relative bg-stone-100 dark:bg-zinc-950 flex items-center justify-center overflow-hidden">
                            <div className="w-[80%] h-[80%] rounded-[30px] bg-gradient-to-bl from-white to-stone-50 dark:from-zinc-900 dark:to-black border border-white/50 dark:border-white/5 shadow-inner flex items-center justify-center">
                                <div className="text-gray-300 dark:text-zinc-800 font-sans font-bold text-9xl opacity-20 select-none">
                                    02
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollStackItem>

                {/* 3. Ambience */}
                <ScrollStackItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
                        {/* Left: Text */}
                        <div className="flex flex-col justify-center p-12 md:p-24 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-white/5">
                            <span className="text-amber-600 dark:text-amber-500 font-medium tracking-widest uppercase mb-4 text-sm">
                                Atmosphere
                            </span>
                            <h2 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                                Designed for <br /> <span className="italic font-light">Serenity</span>
                            </h2>
                            <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-400 font-light max-w-lg">
                                Every corner is crafted to provide a sanctuary from the bustle of the city. Light, texture, and sound converge to create an unforgettable dining experience.
                            </p>
                        </div>
                        {/* Right: Blank Box */}
                        <div className="relative bg-gray-50 dark:bg-zinc-950 flex items-center justify-center overflow-hidden">
                            <div className="w-[80%] h-[80%] rounded-[30px] bg-gradient-to-tr from-white to-gray-100 dark:from-zinc-900 dark:to-black border border-white/50 dark:border-white/5 shadow-inner flex items-center justify-center">
                                <div className="text-gray-300 dark:text-zinc-800 font-sans font-bold text-9xl opacity-20 select-none">
                                    03
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollStackItem>

                {/* 4. Join Us */}
                <ScrollStackItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
                        {/* Left: Text */}
                        <div className="flex flex-col justify-center p-12 md:p-24 bg-stone-50 dark:bg-zinc-900 border-r border-gray-200 dark:border-white/5">
                            <span className="text-amber-600 dark:text-amber-500 font-medium tracking-widest uppercase mb-4 text-sm">
                                Reservation
                            </span>
                            <h2 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                                Your Table <br /> Awaits
                            </h2>
                            <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-400 font-light max-w-lg mb-12">
                                We invite you to be our guest. Experience the culmination of passion, tradition, and culinary excellence.
                            </p>
                            <div>
                                <a
                                    href="#contact"
                                    className="px-10 py-5 bg-black dark:bg-white text-white dark:text-black text-lg font-bold tracking-widest uppercase hover:bg-amber-600 dark:hover:bg-amber-400 hover:text-white transition-all duration-300 rounded-lg"
                                >
                                    Book Now
                                </a>
                            </div>
                        </div>
                        {/* Right: Blank Box */}
                        <div className="relative bg-stone-100 dark:bg-zinc-950 flex items-center justify-center overflow-hidden">
                            <div className="w-[80%] h-[80%] rounded-[30px] bg-gradient-to-br from-white to-stone-50 dark:from-zinc-900 dark:to-black border border-white/50 dark:border-white/5 shadow-inner flex items-center justify-center">
                                <div className="text-gray-300 dark:text-zinc-800 font-sans font-bold text-9xl opacity-20 select-none">
                                    04
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollStackItem>
            </ScrollStack>
        </section>
    );
}
