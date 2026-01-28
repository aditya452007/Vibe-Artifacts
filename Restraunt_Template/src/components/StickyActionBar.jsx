import React from 'react';
import { Phone, ShoppingBag, MapPin } from 'lucide-react';
import { restaurantData } from '../data/restaurantData';

export default function StickyActionBar() {
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-50 pb-safe transition-colors duration-500">
            <div className="flex justify-around p-3 pb-5">
                <a
                    href={`tel:${restaurantData.phone}`}
                    className="flex-1 flex flex-col items-center gap-1.5 p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 active:text-red-600 transition-colors"
                >
                    <Phone className="w-6 h-6" />
                    <span className="text-xs font-semibold">Call</span>
                </a>

                <div className="w-px bg-gray-200 dark:bg-gray-700 my-2"></div>

                <a
                    href={restaurantData.links.zomato}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex flex-col items-center gap-1.5 p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 active:text-red-600 transition-colors"
                >
                    <ShoppingBag className="w-6 h-6" />
                    <span className="text-xs font-semibold">Order</span>
                </a>

                <div className="w-px bg-gray-200 dark:bg-gray-700 my-2"></div>

                <a
                    href={restaurantData.address.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex flex-col items-center gap-1.5 p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 active:text-blue-600 transition-colors"
                >
                    <MapPin className="w-6 h-6" />
                    <span className="text-xs font-semibold">Map</span>
                </a>
            </div>
        </div>
    );
}
