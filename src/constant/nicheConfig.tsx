interface NicheCategory {
  tagline: string;
  accent: string;
  accentDark: string;
  pattern: string;
}

interface NicheConfig {
  [key: string]: NicheCategory;
}

const nicheConfig: NicheConfig = {
  lagosmarketplace: {
    tagline: "The heart of Nigerian commerce and culture",
    accent: "from-yellow-400 via-orange-500 to-red-500",
    accentDark: "from-yellow-300 via-orange-400 to-red-400",
    pattern: "vibrant",
  },
  africanfashion: {
    tagline: "Celebrate African heritage through fashion",
    accent: "from-red-400 via-orange-500 to-yellow-500",
    accentDark: "from-red-300 via-orange-400 to-yellow-400",
    pattern: "african",
  },
  mobilemoney: {
    tagline: "Convenient payment solutions for modern business",
    accent: "from-green-400 via-emerald-500 to-teal-500",
    accentDark: "from-green-300 via-emerald-400 to-teal-400",
    pattern: "fintech",
  },
  religiousitems: {
    tagline: "Faith-based products for spiritual growth",
    accent: "from-amber-400 via-yellow-500 to-orange-500",
    accentDark: "from-amber-300 via-yellow-400 to-orange-400",
    pattern: "spiritual",
  },
  motorcycles: {
    tagline: "Freedom on two wheels awaits you",
    accent: "from-red-400 via-orange-500 to-yellow-500",
    accentDark: "from-red-300 via-orange-400 to-yellow-400",
    pattern: "speed",
  },
  autofinance: {
    tagline: "Make your dream car affordable today",
    accent: "from-green-400 via-lime-500 to-yellow-500",
    accentDark: "from-green-300 via-lime-400 to-yellow-400",
    pattern: "finance",
  },
  trucking: {
    tagline: "Reliable cargo and logistics solutions",
    accent: "from-amber-400 via-orange-500 to-red-500",
    accentDark: "from-amber-300 via-orange-400 to-red-400",
    pattern: "logistics",
  },
  nigerianfoods: {
    tagline: "Taste the authentic flavors of Nigeria",
    accent: "from-orange-400 via-red-500 to-pink-500",
    accentDark: "from-orange-300 via-red-400 to-pink-400",
    pattern: "spicy",
  },
  carrentals: {
    tagline: "Convenient mobility solutions for every need",
    accent: "from-purple-400 via-violet-500 to-indigo-500",
    accentDark: "from-purple-300 via-violet-400 to-indigo-400",
    pattern: "convenience",
  },
  autoinsurance: {
    tagline: "Protect your investment with comprehensive coverage",
    accent: "from-indigo-400 via-purple-500 to-pink-500",
    accentDark: "from-indigo-300 via-purple-400 to-pink-400",
    pattern: "protection",
  },
};

export default nicheConfig;
