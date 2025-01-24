const allgames = [
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
    title: "Stardew Valley",
    imageUrl: "/images/stardew.PNG",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "A farming simulation where players build and manage their own farm, engage with townsfolk, and explore caves. It offers a relaxing yet immersive experience. ",
    developer: "By ConcernedApe",
    genre: "Genre: Simulation, Role-Playing",
    release: "Release Date:  February 26, 2016",
    platform:
      "Platforms: PC, PlayStation 4, Xbox One, Nintendo Switch, PlayStation Vita, iOS, Android",
  },
  {
    id: 12,
    title: "Dead Cells",
    imageUrl: "/images/deadcells.PNG",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "A rogue-lite, metroidvania-inspired action-platformer. Players fight through procedurally generated levels, collecting weapons and abilities to defeat formidable bosses. ",
    developer: "By Motion Twin",
    genre: "Genre: Action, Roguelike, Metroidvania",
    release: "Release Date:  August 7, 2018",
    platform:
      "Platforms: PC, Nintendo Switch, PlayStation 4, Xbox One, iOS, Android",
  },
  {
    id: 13,
    title: "Gris",
    imageUrl: "/images/gris.PNG",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "A visually stunning platformer that tells the story of a young girl dealing with loss. The game features minimal text, relying on art and music to convey emotions. ",
    developer: "By Nomada Studio",
    genre: "Genre: Platform-Adventure",
    release: "Release Date:  December 13, 2018",
    platform:
      "Platforms: PC, Nintendo Switch, PlayStation 4, iOS, Android, PlayStation 5, Xbox One, Xbox Series X/S",
  },
  {
    id: 14,
    title: "Cuphead",
    imageUrl: "/images/cuphead.PNG",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "A run-and-gun game known for its 1930s cartoon art style and challenging boss battles. Players control Cuphead and Mugman as they collect souls to repay a debt to the devil. ",
    developer: "By Studio MDHR",
    genre: "Genre: Run and Gun, Platformer",
    release: "Release Date: September 29, 2017",
    platform: "Platforms: PC, Nintendo Switch, PlayStation 4, Xbox One",
  },
  {
    id: 15,
    title: "The Witness",
    imageUrl: "/images/witness.PNG",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "A first-person puzzle game set on a mysterious island. Players solve intricate puzzles that reveal the island's secrets, offering a deep and contemplative experience. ",
    developer: "By Jonathan Blow (Thekla, Inc.)",
    genre: "Genre: Puzzle, Adventure",
    release: "Release Date: January 26, 2016",
    platform:
      "Platforms: PC, iOS, PlayStation 4, Xbox One, Nvidia Shield, Android",
  },
  {
    id: 16,
    title: "Undertale",
    imageUrl: "/images/undertale.PNG",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "An RPG where players navigate a world of monsters, making choices that affect the story's outcome. Known for its unique combat system and memorable characters. ",
    developer: "By Toby Fox",
    genre: "Genre: Role-Playing",
    release: "Release Date: September 15, 2015",
    platform: "Platforms: PC, iOS, PlayStation 4, Nintendo Switch, Xbox One",
  },
  {
    id: 17,
    title: "Slay the Spire",
    imageUrl: "/images/spire.PNG",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "A deck-building rogue-like where players craft unique decks, encounter bizarre creatures, and discover relics of immense power to climb the spire. ",
    developer: "By MegaCrit",
    genre: "Genre: Roguelike, Deck-Building",
    release: "Release Date: January 23, 2019",
    platform:
      "Platforms: PC, Nintendo Switch, PlayStation 4, Xbox One, iOS, Android",
  },
  {
    id: 18,
    title: "Inside",
    imageUrl: "/images/inside.PNG",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "A dark, narrative-driven platformer that follows a boy through a dystopian world. The game is praised for its atmospheric storytelling and puzzles. ",
    developer: "By Playdead",
    genre: "Genre: Puzzle-Platformer, Adventure",
    release: "Release Date: June 29, 2016",
    platform: "Platforms: PC,  PlayStation 4, Xbox One, Nintendo Switch, iOS",
  },
  {
    id: 19,
    title: "Hades",
    imageUrl: "/images/hades.PNG",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "A rogue-like dungeon crawler where players control Zagreus, the son of Hades, attempting to escape the Underworld. Combines fast-paced action with a rich narrative. ",
    developer: "By Supergiant Games",
    genre: "Genre: Action, Roguelike",
    release: "Release Date: September 17, 2020",
    platform:
      "Platforms: PC,  Nintendo Switch, PlayStation 4, PlayStation 5, Xbox One, Xbox Series X/S",
  },
  {
    id: 20,
    title: "Oxenfree",
    imageUrl: "/images/oxenfree.PNG",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "A supernatural thriller about a group of friends who unwittingly open a ghostly rift. Features a unique dialogue system and a haunting atmosphere. ",
    developer: "By Night School Studio",
    genre: "Genre: Adventure, Mystery",
    release: "Release Date: January 15, 2016",
    platform:
      "Platforms: PC,  PlayStation 4, Xbox One, Nintendo Switch, iOS, Android",
  },
  // Add more games as needed
];

export default allgames;
