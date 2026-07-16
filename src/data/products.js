export const products = [
  {
    id: "prod-001",
    slug: "everyday-home-organizer",
    name: "Everyday Home Organizer",
    category: "Home",
    price: 29.99,
    compareAtPrice: 39.99,
    badge: "Best Seller",
    rating: 4.8,
    reviewCount: 0,
    shortDescription:
      "A practical organizer designed to reduce clutter and simplify everyday storage.",
    description:
      "Bring more order to your routine with a versatile organizer designed for frequently used items. Its clean profile works well across bedrooms, bathrooms, offices and shared living spaces.",
    benefits: [
      "Helps reduce everyday clutter",
      "Simple and versatile design",
      "Suitable for multiple rooms",
      "Easy to clean and maintain",
    ],
    colors: ["Sand", "Sage", "Charcoal"],
    imageClass: "productImageHome",
    featured: true,
  },
  {
    id: "prod-002",
    slug: "daily-wellness-tool",
    name: "Daily Wellness Tool",
    category: "Beauty & Wellness",
    price: 24.99,
    compareAtPrice: 34.99,
    badge: "Customer Favorite",
    rating: 4.7,
    reviewCount: 0,
    shortDescription:
      "A lightweight personal-care tool created for simple daily routines.",
    description:
      "Designed to fit naturally into a modern self-care routine, this lightweight tool offers a straightforward way to make personal care feel more intentional and convenient.",
    benefits: [
      "Lightweight and comfortable",
      "Easy to include in daily routines",
      "Compact enough for travel",
      "Simple, uncomplicated operation",
    ],
    colors: ["Ivory", "Rose", "Sage"],
    imageClass: "productImageBeauty",
    featured: true,
  },
  {
    id: "prod-003",
    slug: "compact-tech-essential",
    name: "Compact Tech Essential",
    category: "Tech & Everyday Carry",
    price: 34.99,
    compareAtPrice: 44.99,
    badge: "New Arrival",
    rating: 4.6,
    reviewCount: 0,
    shortDescription:
      "A compact everyday tool designed for convenience at home or on the move.",
    description:
      "A practical addition to your daily carry, designed to provide useful functionality without unnecessary bulk. Its compact construction makes storage and transport simple.",
    benefits: [
      "Compact everyday design",
      "Easy to store or carry",
      "Useful at home and while traveling",
      "Clean and modern appearance",
    ],
    colors: ["Black", "Silver", "Forest"],
    imageClass: "productImageTech",
    featured: true,
  },
  {
    id: "prod-004",
    slug: "smart-kitchen-helper",
    name: "Smart Kitchen Helper",
    category: "Home",
    price: 39.99,
    compareAtPrice: 49.99,
    badge: "Trending",
    rating: 4.8,
    reviewCount: 0,
    shortDescription:
      "A practical kitchen accessory built to make common tasks simpler.",
    description:
      "Make everyday kitchen preparation feel more organized with a practical helper selected for simplicity, usefulness and easy storage.",
    benefits: [
      "Designed for everyday kitchen tasks",
      "Easy to store between uses",
      "Straightforward operation",
      "Practical gift option",
    ],
    colors: ["Cream", "Graphite"],
    imageClass: "productImageKitchen",
    featured: true,
  },
  {
    id: "prod-005",
    slug: "travel-ready-organizer",
    name: "Travel-Ready Organizer",
    category: "Lifestyle",
    price: 27.99,
    compareAtPrice: 36.99,
    badge: "Travel Pick",
    rating: 4.6,
    reviewCount: 0,
    shortDescription:
      "Keep personal essentials organized during travel and daily commutes.",
    description:
      "A flexible organizer created to keep smaller essentials easier to find, whether you are preparing for a trip, commuting or organizing your everyday bag.",
    benefits: [
      "Helps separate smaller essentials",
      "Suitable for travel and commuting",
      "Compact and easy to carry",
      "Clean, versatile design",
    ],
    colors: ["Sand", "Olive", "Black"],
    imageClass: "productImageTravel",
    featured: false,
  },
  {
    id: "prod-006",
    slug: "everyday-pet-care-tool",
    name: "Everyday Pet Care Tool",
    category: "Pets",
    price: 25.99,
    compareAtPrice: 32.99,
    badge: "Pet Essential",
    rating: 4.7,
    reviewCount: 0,
    shortDescription:
      "A simple pet-care tool selected for comfortable everyday grooming.",
    description:
      "Make routine pet care easier with a practical tool designed to support regular grooming while remaining straightforward to clean and store.",
    benefits: [
      "Designed for routine grooming",
      "Comfortable everyday handling",
      "Easy to clean",
      "Compact storage",
    ],
    colors: ["Green", "Gray", "Blue"],
    imageClass: "productImagePet",
    featured: false,
  },
];

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}

export const productCategories = [
  "All",
  ...new Set(products.map((product) => product.category)),
];