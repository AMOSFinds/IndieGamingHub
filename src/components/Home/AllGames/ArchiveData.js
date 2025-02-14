const archives = [
  {
    id: 1,
    title: "Tunic",
    imageUrl: "/screenshots/tunicmain.jpg",
    description:
      "Tunic captures the essence of classic adventure games like The Legend of Zelda but with a unique flair. The game’s isometric visuals are stunning, and its clever puzzles and cryptic in-game manual make for an unforgettable journey.",
    developer: "By Andrew Shouldice",
    genre: "Genre: Action-Adventure",
    release: "Release Date:  March 16, 2022",
    platform: ["PC", "Xbox", "PlayStation", "Nintendo Switch"],
    bannerImage: "/screenshots/tunicbanner.jpg",
    screenshots: [
      "/screenshots/tunic1.jpg",
      "/screenshots/tunic2.jpg",
      "/screenshots/tunic3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/553420/TUNIC/",
  },
  {
    id: 2,
    title: "Hyper Light Drifter",
    imageUrl: "/screenshots/hypermain.jpg",
    description:
      "This neon-soaked, pixel-art action RPG is a visual masterpiece with fast-paced combat and a story told through gorgeous imagery. Its melancholic atmosphere keeps you glued to its mysterious world.",
    developer: "By Heart Machine",
    genre: "Genre: Action RPG",
    release: "Release Date: March 31, 2016",
    platform: ["PC", "Switch", "PlayStation", "Xbox"],
    bannerImage: "/screenshots/hyperbanner.jpg",
    screenshots: [
      "/screenshots/hyper1.jpg",
      "/screenshots/hyper2.jpg",
      "/screenshots/hyper3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/257850/Hyper_Light_Drifter/",
  },
  {
    id: 3,
    title: "A Short Hike",
    imageUrl: "/screenshots/hikemain.jpg",
    description:
      "A bite-sized exploration game that’s brimming with charm. With low-poly visuals, relaxing gameplay, and a heartwarming story, A Short Hike is a delightful experience for all ages.",
    developer: "By Adam Robinson-Yu",
    genre: "Genre: Adventure",
    release: "Release Date: July 30, 2019",
    platform: ["PC", "Switch", "PlayStation", "Xbox"],
    bannerImage: "/screenshots/hikebanner.jpg",
    screenshots: [
      "/screenshots/hike1.jpg",
      "/screenshots/hik2.jpg",
      "/screenshots/hik3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1055540/A_Short_Hike/",
  },
  {
    id: 4,
    title: "Eastward",
    imageUrl: "/screenshots/eastmain.jpg",
    description:
      " This pixel-art RPG blends whimsical storytelling with challenging combat and puzzles. Its beautifully crafted world feels alive, and the chemistry between the main characters, John and Sam, is heartwarming.",
    developer: "By Pixpil",
    genre: "Genre: Adventure RPG",
    release: "Release Date: September 16, 2021",
    platform: ["PC", "Switch"],
    bannerImage: "/screenshots/eastbanner.jpg",
    screenshots: [
      "/screenshots/east1.jpg",
      "/screenshots/east2.jpg",
      "/screenshots/east3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/977880/Eastward/",
  },
  {
    id: 5,
    title: " Spiritfarer",
    imageUrl: "/screenshots/spiritmain.jpg",
    description:
      "A cozy management game about ferrying souls to the afterlife. Spiritfarer balances heartwarming interactions with meaningful farewells in a way that’s both relaxing and deeply emotional. ",
    developer: "By Thunder Lotus Games",
    genre: "Genre: Management, Simulation",
    release: "Release Date: August 18, 2020",
    platform: ["PC", "PlayStation", "Xbox", "Switch"],
    bannerImage: "/screenshots/spiritbanner.jpg",
    screenshots: [
      "/screenshots/spirit1.jpg",
      "/screenshots/spirit2.jpg",
      "/screenshots/spirit3.jpg",
    ],
    playLink:
      "https://store.steampowered.com/app/972660/Spiritfarer_Farewell_Edition/",
  },
  {
    id: 6,
    title: "Hades",
    imageUrl: "/screenshots/hadesmain.jpg",
    description:
      "A masterclass in roguelike design, Hades offers fast-paced combat, a compelling story, and rich characters. Supergiant Games created a near-perfect loop of progression and replayability. ",
    developer: "By Supergiant Games",
    genre: "Genre: Roguelike",
    release: "Release Date:  September 17, 2020",
    platform: ["PC", "PlayStation", "Xbox", "Switch"],
    bannerImage: "/screenshots/hadesbanner.jpg",
    screenshots: [
      "/screenshots/hades1.jpg",
      "/screenshots/hades2.jpg",
      "/screenshots/hades3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1145360/Hades/",
  },
  {
    id: 7,
    title: "The Pathless",
    imageUrl: "/screenshots/pathmain.jpg",
    description:
      "This action-adventure game combines fluid archery mechanics with an open world that encourages exploration. Its minimalist storytelling and stunning landscapes are unforgettable.",
    developer: "By Giant Squid",
    genre: "Genre:  Action-Adventure",
    release: "Release Date: November 12, 2020",
    platform: ["PC", "PlayStation", "Xbox", "Switch"],
    bannerImage: "/screenshots/pathbanner.jpg",
    screenshots: [
      "/screenshots/path1.jpg",
      "/screenshots/path2.jpg",
      "/screenshots/path3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1492680/The_Pathless/",
  },
  {
    id: 8,
    title: "Celeste",
    imageUrl: "/images/celeste.PNG",
    description:
      "This emotional platformer tells a story of mental health and perseverance while delivering tight, challenging gameplay. Each level is crafted with care, offering both difficulty and depth. ",
    developer: "By Maddy Makes Games",
    genre: "Genre: Platformer",
    release: "Release Date: January 25, 2018",
    platform: ["PC", "Nintendo Switch", "PlayStation", "Xbox"],
    bannerImage: "/screenshots/celestebanner.jpg",
    screenshots: [
      "/screenshots/celeste1.jpg",
      "/screenshots/celeste2.jpg",
      "/screenshots/celeste3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/504230/Celeste/",
  },
  {
    id: 9,
    title: "Night in the Woods",
    imageUrl: "/screenshots/nightmain.jpg",
    description:
      "A story-driven adventure with quirky characters and a heartfelt narrative. Its exploration of small-town life and mental health issues feels authentic and resonates deeply. ",
    developer: "By Infinite Fall",
    genre: "Genre: Adventure",
    release: "Release Date: February 21, 2017",
    platform: ["PC", "Nintendo Switch", "PlayStation", "Xbox"],
    bannerImage: "/screenshots/nightbanner.jpg",
    screenshots: [
      "/screenshots/night1.jpg",
      "/screenshots/night2.jpg",
      "/screenshots/night3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/481510/Night_in_the_Woods/",
  },
  {
    id: 10,
    title: "Wildermyth",
    imageUrl: "/screenshots/wildmain.jpg",
    description:
      "Wildermyth is a tactical RPG that blends procedural storytelling with unique character-driven narratives. Every decision you make influences your party members, who age, grow, and even retire. Its blend of tactical combat and emergent storytelling creates an experience that feels deeply personal and endlessly replayable. ",
    developer: "By Worldwalker Games",
    genre: "Genre: Tactical RPG",
    release: "Release Date: June 15, 2021",
    platform: ["PC"],
    bannerImage: "/screenshots/wildbanner.jpg",
    screenshots: [
      "/screenshots/wild1.jpg",
      "/screenshots/wild2.jpg",
      "/screenshots/wild3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/763890/Wildermyth/",
  },
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
  {
    id: 21,
    title: "Sludge Life 2",
    imageUrl: "/screenshots/sludgemain.jpg",
    description:
      "A weird and wild first-person open-world game where you explore a grimy, graffiti-filled world. Its satirical humor, funky characters, and immersive setting make it a standout indie experience. ",
    developer: "By Terri Vellmann & Doseone",
    genre: "Genre: Open-World, Exploration",
    release: "Release Date:   June 27, 2023",
    platform: ["PC"],
    bannerImage: "/screenshots/sludgebanner.jpg",
    screenshots: [
      "/screenshots/sludge1.jpg",
      "/screenshots/sludge2.jpg",
      "/screenshots/sludge3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/2275150/SLUDGE_LIFE_2/",
  },
  {
    id: 22,
    title: "Lunacid",
    imageUrl: "/screenshots/lunacidmain.jpg",
    description:
      "A dark, atmospheric first-person dungeon-crawling RPG inspired by King’s Field and other classic FromSoftware titles. Lunacid offers deep exploration, eerie environments, and old-school gameplay with a fresh indie twist. ",
    developer: "By  Kira LLC",
    genre: "Genre: Dungeon Crawler, RPG",
    release: "Release Date:  March 30, 2023 (Full Release)",
    platform: ["PC"],
    bannerImage: "/screenshots/lunacidbanner.jpg",
    screenshots: [
      "/screenshots/lunacid1.jpg",
      "/screenshots/lunacid2.jpg",
      "/screenshots/lunacid3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1745510/Lunacid/",
  },
  {
    id: 23,
    title: "Garden Story",
    imageUrl: "/screenshots/gardenmain.jpg",
    description:
      "A wholesome action RPG where you play as a tiny grape tasked with restoring a crumbling community. Garden Story delivers charming pixel art, satisfying quests, and a relaxing yet engaging adventure. ",
    developer: "By Picogram",
    genre: "Genre: Adventure, RPG",
    release: "Release Date:  August 11, 2021",
    platform: ["PC, Nintendo Switch"],
    bannerImage: "/screenshots/gardenbanner.jpg",
    screenshots: [
      "/screenshots/garden1.jpg",
      "/screenshots/garden2.jpg",
      "/screenshots/garden3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1062140/Garden_Story/",
  },
  {
    id: 24,
    title: "Below the Stone",
    imageUrl: "/screenshots/belowmain.jpg",
    description:
      "A pixel-art roguelike dungeon crawler with deep mining mechanics and high-risk, high-reward gameplay. Each descent into the underground is unpredictable, filled with hidden treasures and lurking dangers. ",
    developer: "By Strollart Studios",
    genre: "Genre: Roguelike, Dungeon Crawler",
    release: "Release Date: November 17, 2023",
    platform: ["PC"],
    bannerImage: "/screenshots/belowbanner.jpg",
    screenshots: [
      "/screenshots/below1.jpg",
      "/screenshots/below2.jpg",
      "/screenshots/below3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1170230/Below_the_Stone/",
  },
  {
    id: 25,
    title: "NecroBouncer",
    imageUrl: "/screenshots/necromain.jpg",
    description:
      "You play as a necromancer bouncer keeping the underworld’s nightclub under control in this roguelike action game. With chaotic combat, neon visuals, and an electrifying soundtrack, it’s a fast-paced thrill ride. ",
    developer: "By Alchemy Sheep",
    genre: "Genre: Roguelike, Action",
    release: "Release Date: December 8, 2022",
    platform: ["PC"],
    bannerImage: "/screenshots/necrobanner.jpg",
    screenshots: [
      "/screenshots/necro1.jpg",
      "/screenshots/necro2.jpg",
      "/screenshots/necro3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1786830/NecroBouncer/",
  },
  {
    id: 26,
    title: "Paper Trail",
    imageUrl: "/screenshots/papermain.jpg",
    description:
      "A beautiful hand-drawn puzzle game where you fold and manipulate paper to explore the world and solve puzzles. The story-driven experience is heartfelt, artistic, and wonderfully unique. ",
    developer: "By Newfangled Games",
    genre: "Genre: Puzzle, Adventure",
    release: "Release Date: May 21, 2024",
    platform: ["PC,  PlayStation, Xbox, Nintendo Switch"],
    bannerImage: "/screenshots/paperbanner.jpg",
    screenshots: [
      "/screenshots/paper1.jpg",
      "/screenshots/paper2.jpg",
      "/screenshots/paper3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1889740/Paper_Trail/",
  },
  {
    id: 27,
    title: "Undetected",
    imageUrl: "/screenshots/undetectmain.jpg",
    description:
      "A stealth-action game inspired by Metal Gear Solid, focusing on sneaky tactics, clever distractions, and old-school spy gameplay. It’s a hidden gem for fans of classic stealth mechanics. ",
    developer: "By Antonio Freyre",
    genre: "Genre: Stealth, Action",
    release: "Release Date: September 30, 2022",
    platform: ["PC, PlayStation, Xbox"],
    bannerImage: "/screenshots/undetectbanner.jpg",
    screenshots: [
      "/screenshots/undetect1.jpg",
      "/screenshots/undetect2.jpg",
      "/screenshots/undetect3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1715350/UNDETECTED/",
  },
  {
    id: 28,
    title: "The Last Worker",
    imageUrl: "/screenshots/lastmain.jpg",
    description:
      "A satirical, first-person adventure that critiques the rise of automation and corporate dystopias. With a unique comic-book art style and thought-provoking narrative, it’s a truly one-of-a-kind indie experience. ",
    developer: "By Oiffy, Wolf & Wood Interactive",
    genre: "Genre: Narrative Adventure",
    release: "Release Date: March 30, 2023",
    platform: ["PC,  PlayStation, Xbox, Nintendo Switch"],
    bannerImage: "/screenshots/lastbanner.jpg",
    screenshots: [
      "/screenshots/last1.jpg",
      "/screenshots/last2.jpg",
      "/screenshots/last3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1579280/The_Last_Worker/",
  },
  {
    id: 29,
    title: "Unwording",
    imageUrl: "/screenshots/unwordmain.jpg",
    description:
      "A minimalist, emotional puzzle game that explores mental health through word-based mechanics. Its clever design and uplifting message make it a must-play for those who love introspective games. ",
    developer: "By Frostwood Interactive",
    genre: "Genre: Puzzle, Narrative",
    release: "Release Date: April 27, 2023",
    platform: ["PC"],
    bannerImage: "/screenshots/unwordbanner.jpg",
    screenshots: [
      "/screenshots/unword1.jpg",
      "/screenshots/unword2.jpg",
      "/screenshots/unword3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1974250/Unwording/",
  },
  {
    id: 30,
    title: "Thirsty Suitors",
    imageUrl: "/screenshots/thirstymain.jpg",
    description:
      "A vibrant, story-rich RPG about culture, relationships, and self-discovery, blending turn-based battles with skateboarding mechanics and witty humor. Its colorful art style and South Asian cultural themes make it a refreshing and standout indie title. ",
    developer: "By Outerloop Games",
    genre: "Genre: RPG, Narrative",
    release: "Release Date: November 2, 2023",
    platform: ["PC,  PlayStation , Xbox, Nintendo Switch"],
    bannerImage: "/screenshots/thirstybanner.jpg",
    screenshots: [
      "/screenshots/thirsty1.jpg",
      "/screenshots/thirsty2.jpg",
      "/screenshots/thirsty3.jpg",
    ],
    playLink: "https://store.steampowered.com/app/1617220/Thirsty_Suitors/",
  },
];

export default archives;
