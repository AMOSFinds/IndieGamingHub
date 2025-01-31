const allgames = [
  {
    id: 11,
    title: "Dome Keeper",
    imageUrl: "/screenshots/domemain.jpg",
    description:
      "A unique mix of mining and tower defense, Dome Keeper has you digging beneath the surface for resources while defending your dome from relentless alien attacks. Its addicting upgrade system and pixel art aesthetic make it a standout survival experience. ",
    developer: "By Bippinbits",
    genre: "Genre: Roguelike, Tower Defense",
    release: "Release Date:  September 27, 2022",
    platform: ["PC"],
    bannerImage: "/screenshots/domebanner.jpg",
    screenshots: [
      "/screenshots/dome1.jpg",
      "/screenshots/dome2.jpg",
      "/screenshots/dome3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1637320/Dome_Keeper/",
    youtubeReview: "WGKryN5MaW4", // Video ID from YouTube URL
    reviewer: "SideQuesting", // YouTuber's name (Optional)
  },
  {
    id: 12,
    title: "Tinykin",
    imageUrl: "/screenshots/tinymain.jpg",
    description:
      "Tinykin blends the exploration of Pikmin with the platforming charm of classic 3D collectathons. You play as a tiny astronaut gathering an army of adorable creatures to solve puzzles and navigate a beautifully detailed oversized world. ",
    developer: "By Splashteam",
    genre: "Genre: Puzzle Platformer",
    release: "Release Date:  August 30, 2022",
    platform: ["PC, Nintendo Switch, PlayStation , Xbox"],
    bannerImage: "/screenshots/tinybanner.jpg",
    screenshots: [
      "/screenshots/tiny1.jpg",
      "/screenshots/tiny2.jpg",
      "/screenshots/tiny3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1599020/Tinykin/",
    youtubeReview: "qdflgh7zY7A", // Video ID from YouTube URL
    reviewer: "Nyxon", // YouTuber's name (Optional)
  },
  {
    id: 13,
    title: "SIGNALIS",
    imageUrl: "/screenshots/signalmain.jpg",
    description:
      "A modern take on classic survival horror, SIGNALIS delivers a haunting atmosphere, eerie pixel-art environments, and a deep sci-fi story reminiscent of Silent Hill and Resident Evil. Its psychological horror elements keep players on edge while its puzzle-solving keeps them engaged. ",
    developer: "By rose-engine",
    genre: "Genre: Survival Horror",
    release: "Release Date:  October 27, 2022",
    platform: ["PC, Nintendo Switch, PlayStation,  Xbox ,"],
    bannerImage: "/screenshots/signalbanner.jpg",
    screenshots: [
      "/screenshots/signal1.jpg",
      "/screenshots/signal2.jpg",
      "/screenshots/signal3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1262350/SIGNALIS/",
    youtubeReview: "J0Od6uOmGaw", // Video ID from YouTube URL
    reviewer: "Noisy Pixel", // YouTuber's name (Optional)
  },
  {
    id: 14,
    title: "Noita",
    imageUrl: "/screenshots/noitamain.jpg",
    description:
      "Noita is a physics-based roguelike where every pixel is simulated. You can create devastating spells, burn down entire levels, and experiment with creative destruction. The emergent gameplay makes every run feel completely unique. ",
    developer: "By Nolla Games",
    genre: "Genre: Roguelike, Action",
    release: "Release Date: October 15, 2020",
    platform: ["PC"],
    bannerImage: "/screenshots/noitabanner.jpg",
    screenshots: [
      "/screenshots/noita1.jpg",
      "/screenshots/noita2.jpg",
      "/screenshots/noita3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/881100/Noita/",
    youtubeReview: "5mzfT-6f05U", // Video ID from YouTube URL
    reviewer: "The Escapist", // YouTuber's name (Optional)
  },
  {
    id: 15,
    title: "Citizen Sleeper",
    imageUrl: "/screenshots/citizenmain.jpg",
    description:
      "Citizen Sleeper is a narrative-driven cyberpunk RPG that plays like a tabletop game. Every decision matters as you navigate the life of a corporate fugitive on a lawless space station, managing relationships, work, and survival in a gripping story. ",
    developer: "By Jump Over The Age",
    genre: "Genre: RPG, Narrative-Driven",
    release: "Release Date: May 5, 2022",
    platform: ["PC,  PlayStation , Xbox ,"],
    bannerImage: "/screenshots/citizenbanner.jpg",
    screenshots: [
      "/screenshots/citizen1.jpg",
      "/screenshots/citizen2.jpg",
      "/screenshots/citizen3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1578650/Citizen_Sleeper/",
    youtubeReview: "DNEcMU1GdUQ", // Video ID from YouTube URL
    reviewer: "Murphy's Multiverse", // YouTuber's name (Optional)
  },
  {
    id: 16,
    title: "Norco",
    imageUrl: "/screenshots/norcomain.jpg",
    description:
      "A surreal, Southern Gothic adventure that combines point-and-click gameplay with deep, atmospheric storytelling. Norco is rich in emotion and mystery, delivering one of the most compelling indie narratives in recent years. ",
    developer: "By Geography of Robots",
    genre: "Genre: Point-and-Click Adventure",
    release: "Release Date: March 24, 2022",
    platform: ["PC,  PlayStation, Xbox"],
    bannerImage: "/screenshots/norcobanner.jpg",
    screenshots: [
      "/screenshots/norco1.jpg",
      "/screenshots/norco2.jpg",
      "/screenshots/norco3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1221250/NORCO/",
    youtubeReview: "sLz2KHGYWcU", // Video ID from YouTube URL
    reviewer: "Three Minute Gaming", // YouTuber's name (Optional)
  },
  {
    id: 17,
    title: "Haiku, the Robot",
    imageUrl: "/screenshots/haikumain.jpg",
    description:
      "A beautifully crafted Metroidvania where you play as a small robot exploring a mysterious, post-apocalyptic world. Haiku, the Robot offers tight platforming, creative enemy designs, and an expansive world filled with secrets. ",
    developer: "By Mister Morris Games",
    genre: "Genre: Metroidvania",
    release: "Release Date: April 28, 2022",
    platform: ["PC, Nintendo Switch"],
    bannerImage: "/screenshots/haikubanner.jpg",
    screenshots: [
      "/screenshots/haiku1.jpg",
      "/screenshots/haiku2.jpg",
      "/screenshots/haiku3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1231880/Haiku_the_Robot/",
    youtubeReview: "IPXaHlelTQ8", // Video ID from YouTube URL
    reviewer: "Pepp's Picks", // YouTuber's name (Optional)
  },
  {
    id: 18,
    title: "FAR: Changing Tides",
    imageUrl: "/screenshots/farmain.jpg",
    description:
      "A visually stunning side-scrolling adventure about piloting a ship across a vast, flooded world. FAR: Changing Tides delivers a meditative experience with gorgeous environments, environmental storytelling, and a deep sense of wonder. ",
    developer: "By Okomotive",
    genre: "Genre: Adventure, Exploration",
    release: "Release Date: March 1, 2022",
    platform: ["PC,  PlayStation, Xbox, Nintendo Switch"],
    bannerImage: "/screenshots/farbanner.jpg",
    screenshots: [
      "/screenshots/far1.jpg",
      "/screenshots/far2.jpg",
      "/screenshots/far3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1570010/FAR_Changing_Tides/",
    youtubeReview: "tXyzY_7ZyaE", // Video ID from YouTube URL
    reviewer: "IGN", // YouTuber's name (Optional)
  },
  {
    id: 19,
    title: "Vampire Survivors",
    imageUrl: "/screenshots/vampiremain.jpg",
    description:
      "A deceptively simple yet highly addictive roguelike where you mow down hordes of enemies in an intense power fantasy. Vampire Survivors blends auto-battler mechanics with deep strategy, offering endless replayability. ",
    developer: "By poncle",
    genre: "Genre: Action, Roguelike",
    release: "Release Date: October 20, 2022",
    platform: ["PC, PlayStation, Xbox, Mobile, Nintendo Switch"],
    bannerImage: "/screenshots/vampirebanner.jpg",
    screenshots: [
      "/screenshots/vampire1.jpg",
      "/screenshots/vampire2.jpg",
      "/screenshots/vampire3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1794680/Vampire_Survivors/",
    youtubeReview: "Tvwjlg0jTJw", // Video ID from YouTube URL
    reviewer: "SwitchUp", // YouTuber's name (Optional)
  },
  {
    id: 20,
    title: "Solar Ash",
    imageUrl: "/screenshots/solarmain.jpg",
    description:
      "From the creators of Hyper Light Drifter, Solar Ash features fluid, gravity-defying traversal and a dreamlike, sci-fi world. The game’s art direction and movement-based combat make it an exhilarating experience. ",
    developer: "By Heart Machine",
    genre: "Genre: Action-Adventure",
    release: "Release Date: December 2, 2021",
    platform: ["PC,  PlayStation , Xbox"],
    bannerImage: "/screenshots/solarbanner.jpg",
    screenshots: [
      "/screenshots/solar1.jpg",
      "/screenshots/solar2.jpg",
      "/screenshots/solar3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1867530/Solar_Ash/",
    youtubeReview: "0bQSLJgw-_U", // Video ID from YouTube URL
    reviewer: "GameSpot", // YouTuber's name (Optional)
  },
  // Add more games as needed
];

export default allgames;
