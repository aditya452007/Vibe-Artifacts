export const restaurantData = {
    // Basic Info
    name: "restaurant name",
    tagline: "tagline",
    phone: "phone",
    email: "email",
    logo: "/Chef-.png",

    // Theme & Branding
    theme: {
        primaryColor: "amber-600",
        badge: "badge"
    },

    // Navigation Items for PillNav
    navItems: [
        { label: 'Home', href: '#home' },
        { label: 'About', href: '#about' },
        { label: 'Menu', href: '#menu' },
        { label: 'Gallery', href: '#gallery' },
        { label: 'Contact', href: '#contact' }
    ],

    // Address
    address: {
        street: "address",
        city: "city",
        state: "state",
        pincode: "pincode",
        mapLink: "https://www.google.com/maps"
    },

    // Hours
    hours: {
        weekdays: "11:00 AM - 10:00 PM",
        weekends: "11:00 AM - 10:00 PM"
    },

    // External Links
    links: {
        zomato: "https://www.zomato.com/",
        googleReview: "https://www.google.com/search?q=",
        whatsapp: "https://wa.me/"
    },

    // Social Media
    socialMedia: {
        instagram: "https://instagram.com/",
        facebook: "https://facebook.com/"
    },

    // Section Content
    hero: {
        title: "Welcome to",
        highlightedTitle: "restaurant name",
        subtitle: "Experience",
        description: "description",
        established: "Est. 2024",
        backgroundImage: "/hero-bg.jpg",
        ctaPrimary: { text: "Book a Table", link: "tel:#contact" },
        ctaSecondary: { text: "Visit Us", link: "#contact" } // Internal link or map link
    },

    about: {
        title: "Our Story",
        description: "description",
        image: "/Chef-.png"
    },

    menu: {
        title: "Our Menu",
        description: "description",
        downloadLink: "/menu/full-menu.pdf",
        images: [
            "/menu/Black Vintage Style Cocktail Menu.png",
            "/menu/Yellow And Orange Restaurant Food Menu.png",
            "/menu/menu.webp",
            "/menu/menu1.png"
        ]
    },

    // Features
    features: [
        "Authentic Indori Spices",
        "Master Chefs",
        "Premium Ambiance",
        "Signature Cocktails"
    ],

    featuresSecondary: [
        "Farm to Table Ingredients",
        "Award Winning Service",
        "Exclusive Private Dining",
        "Curated Drink Selection"
    ],

    testimonials: [
        {
            name: "Rahul Sharma",
            text: "The best vegetarian food in Indore! The ambiance is amazing.",
            rating: 5
        },
        {
            name: "Priya Singh",
            text: "Loved the service and the authentic taste. Highly recommended.",
            rating: 5
        },
        {
            name: "Amit Patel",
            text: "Great place for family dinner. The staff is very courteous.",
            rating: 4
        }
    ],

    gallery: [
        "/images/download (1).jpg",
        "/images/download (2).jpg",
        "/images/download (3).jpg",
        "/images/download (4).jpg",
        "/images/download.jpg",
        "/images/images (1).jpg",
        "/images/images (2).jpg",
        "/images/images (3).jpg",
        "/images/images.jpg",
    ]
};
