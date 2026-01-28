import React from 'react';
import { Star } from 'lucide-react';
import { restaurantData } from '../data/restaurantData';

export default function ReviewCTA() {
    return (
        <section className="py-16 bg-premium-off-white dark:bg-premium-dark border-y border-gray-100 dark:border-gray-800 transition-colors duration-500">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Loved your experience?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
                    Your feedback helps us serve you better. We'd love to hear about your meal!
                </p>

                <a
                    href={restaurantData.links.googleReview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-8 py-3 rounded-xl font-semibold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                >
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span>Write a Review on Google</span>
                </a>
            </div>
        </section>
    );
}
