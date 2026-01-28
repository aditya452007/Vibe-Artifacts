import React from 'react';
import { MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';
import { restaurantData } from '../data/restaurantData';

export default function Footer() {
    return (
        <footer id="contact" className="bg-premium-off-white dark:bg-premium-dark border-t border-gray-100 dark:border-gray-800 pt-16 pb-32 lg:pb-16 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

                    <div className="lg:col-span-2">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{restaurantData.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">{restaurantData.tagline}</p>
                        <div className="flex gap-4">
                            {restaurantData.socialMedia.instagram && (
                                <a href={restaurantData.socialMedia.instagram} target="_blank" rel="noreferrer" className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                            {restaurantData.socialMedia.facebook && (
                                <a href={restaurantData.socialMedia.facebook} target="_blank" rel="noreferrer" className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-600" /> Visit Us
                        </h4>
                        <address className="not-italic text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                            {restaurantData.address.street}<br />
                            {restaurantData.address.city}, {restaurantData.address.state}<br />
                            {restaurantData.address.pincode}
                        </address>
                        <a href={restaurantData.address.mapLink} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                            Get Directions →
                        </a>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-red-600" /> Opening Hours
                        </h4>
                        <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-2">
                            <li className="flex justify-between">
                                <span>Mon - Sun</span>
                                <span className="font-medium text-gray-900 dark:text-white">{restaurantData.hours.weekdays}</span>
                            </li>
                        </ul>
                        <h4 className="font-semibold text-gray-900 dark:text-white mt-6 mb-4 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-red-600" /> Contact
                        </h4>
                        <a href={`tel:${restaurantData.phone}`} className="block text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            {restaurantData.phone}
                        </a>
                        <a href={`mailto:${restaurantData.email}`} className="block text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors mt-2">
                            {restaurantData.email}
                        </a>
                    </div>

                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400 dark:text-gray-500">
                    © {new Date().getFullYear()} {restaurantData.name}. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
