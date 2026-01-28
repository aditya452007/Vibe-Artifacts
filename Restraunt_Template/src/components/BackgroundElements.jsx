import React from 'react';
import {
    GiChiliPepper,
    GiBowlOfRice,
    GiChickenLeg,
    GiBread,
    GiDumpling,
    GiPizzaSlice,
    GiDonut,
    GiCoffeeCup,
    GiWineGlass,
    GiKnifeFork,
    GiNoodles,
    GiTeapot,
    GiCookingPot,
    GiIceCreamCone,
    GiCakeSlice
} from "react-icons/gi";

export default function BackgroundElements() {
    // Enhanced list of icons for a rich food pattern
    const iconElements = [
        // Top Section
        { Icon: GiChiliPepper, top: '2%', left: '5%', delay: '0s', size: 30 },
        { Icon: GiTeapot, top: '5%', right: '8%', delay: '2s', size: 35 },
        { Icon: GiBowlOfRice, top: '12%', left: '20%', delay: '4s', size: 40 },
        { Icon: GiKnifeFork, top: '15%', right: '25%', delay: '1s', size: 28 },

        // Middle-Top
        { Icon: GiDumpling, top: '22%', left: '8%', delay: '3s', size: 38 },
        { Icon: GiNoodles, top: '28%', right: '5%', delay: '0.5s', size: 42 },
        { Icon: GiBread, top: '35%', left: '15%', delay: '5s', size: 45 },
        { Icon: GiWineGlass, top: '38%', right: '15%', delay: '2.5s', size: 32 },

        // Middle
        { Icon: GiChickenLeg, top: '45%', left: '5%', delay: '1.5s', size: 36 },
        { Icon: GiCookingPot, top: '50%', right: '10%', delay: '4s', size: 48 },
        { Icon: GiPizzaSlice, top: '55%', left: '25%', delay: '0.8s', size: 40 },
        { Icon: GiCoffeeCup, top: '60%', right: '30%', delay: '3.5s', size: 28 },

        // Middle-Bottom
        { Icon: GiCakeSlice, top: '65%', left: '10%', delay: '2s', size: 34 },
        { Icon: GiIceCreamCone, top: '72%', right: '5%', delay: '5s', size: 36 },
        { Icon: GiDonut, top: '78%', left: '18%', delay: '1s', size: 30 },
        { Icon: GiChiliPepper, top: '85%', right: '12%', delay: '3s', size: 26 },

        // Bottom
        { Icon: GiDumpling, top: '90%', left: '5%', delay: '4.5s', size: 32 },
        { Icon: GiBowlOfRice, top: '95%', right: '20%', delay: '0.5s', size: 38 },
        { Icon: GiTeapot, top: '88%', left: '40%', delay: '2.5s', size: 34 },
        { Icon: GiBread, top: '5%', left: '50%', delay: '1.2s', size: 25 }, // Top centerish
        { Icon: GiWineGlass, top: '50%', left: '50%', delay: '0s', size: 40 }, // Center
        { Icon: GiNoodles, top: '92%', left: '70%', delay: '3.2s', size: 35 },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden opacity-10 dark:opacity-20 transition-opacity duration-300">
            {iconElements.map(({ Icon, top, left, right, delay, size }, index) => (
                <div
                    key={index}
                    className="absolute text-black dark:text-white animate-float"
                    style={{
                        top,
                        left: left || 'auto',
                        right: right || 'auto',
                        fontSize: `${size}px`,
                        animationDelay: delay,
                    }}
                >
                    <Icon />
                </div>
            ))}
        </div>
    );
}
