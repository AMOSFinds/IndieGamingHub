const allgames = [
  {
    id: 1,
    title: "ViewFinder",
    imageUrl: "/images/viewfinder.jpg",
    description:
      '"What if you could make the impossible possible?" Viewfinder redefines puzzle-solving by letting you reshape reality itself. You’ll place photos, drawings, and more to create walkable paths in mind-bending ways. The mechanics are mesmerizing, and every level feels like a moment of discovery. This game doesn’t just make you think—it makes you feel like an architect of alternate dimensions.',
    developer: "By Sad Owl Studios",
    genre: "Genre: Puzzle",
    release: "Release Date: July 18 2023",
    platform: ["PC", "PS5", "PS4"],
    bannerImage: "/screenshots/viewfinderscreenshot.PNG",
    screenshots: [
      "/screenshots/viewfinder1.PNG",
      "/screenshots/viewfinder2.PNG",
    ],
    playLink: "https://store.steampowered.com/app/1382070/Viewfinder/",
  },
  {
    id: 2,
    title: "Chants of Sennaar",
    imageUrl: "/images/chants.jfif",
    description:
      '"What if you could unravel the secrets of ancient languages?" Chants of Sennaar transports you to a vibrant, mysterious world inspired by the myth of Babel. The puzzles are as clever as the concept itself, as you decode forgotten languages to bridge divides between cultures. It’s not just a game—it’s an experience that challenges your mind and rewards your curiosity.',
    developer: "By Rundisc",
    genre: "Genre: Adventure, Puzzle",
    release: "Release Date: September 5 2023",
    platform: ["PC", "Switch", "PS4", "XBOX ONE"],
    bannerImage: "/screenshots/chantsbanner.PNG",
    screenshots: ["/screenshots/chants1.PNG", "/screenshots/chants2.PNG"],
    playLink: "https://store.steampowered.com/app/1931770/Chants_of_Sennaar/",
  },
  {
    id: 3,
    title: "Wall World",
    imageUrl: "/images/wallworld2.jpg",
    description:
      '"Climb the wall, mine the riches, and survive the onslaught." Wall World combines the best parts of mining simulators and tower defense in a way that feels fast-paced and rewarding. You’ll dive into mysterious caves, upgrade your mech, and defend yourself against relentless waves of enemies. The vertical exploration is a breath of fresh air for fans of roguelike adventures.',
    developer: "By Alawar",
    genre: "Genre: Adventure",
    release: "Release Date: April 5 2023",
    platform: ["PC", "Switch", "PS5", "XBOX SERIES X", "SERIES S"],
    bannerImage: "/screenshots/wallworldbanner.PNG",
    screenshots: ["/screenshots/wallworld1.PNG", "/screenshots/wallworld2.PNG"],
    playLink: "https://store.steampowered.com/app/2187290/Wall_World/",
  },
  {
    id: 4,
    title: "Isles of Sea and Sky",
    imageUrl: "/images/seasky.jpg",
    description:
      ' "There’s nothing quite like the feeling of discovery." Isles of Sea and Sky is a gorgeous exploration game set in a serene archipelago. You’ll sail between islands, solve puzzles, and uncover ancient ruins steeped in mystery. The minimalist yet atmospheric world design invites you to slow down, explore, and find your own path. It’s perfect for players who crave exploration without combat.',
    developer: "By Cicada Games",
    genre: "Genre: Adventure, Puzzle",
    release: "Release Date: March 31 2024",
    platform: ["PC", "Switch"],
    bannerImage: "/screenshots/islesbanner.PNG",
    screenshots: ["/screenshots/isles1.PNG", "/screenshots/isles2.PNG"],
    playLink:
      "https://store.steampowered.com/app/1233070/Isles_of_Sea_and_Sky/",
  },
  {
    id: 5,
    title: "Against the Storm",
    imageUrl: "/images/storm.jpg",
    description:
      '"Survival isn’t just about building—it’s about adapting." Against the Storm puts you in charge of rebuilding civilization in a world where endless rain threatens your survival. The city-building mechanics are top-notch, with unique settlements and resource management challenges that keep things fresh. The roguelike twist makes every playthrough different, ensuring that no two kingdoms will ever be the same. ',
    developer: "By Eremite Games",
    genre: "Genre: Simulation",
    release: "Release Date: December 8 2023",
    platform: ["PC"],
    bannerImage: "/screenshots/stormbanner.PNG",
    screenshots: ["/screenshots/storm1.PNG", "/screenshots/storm2.PNG"],
    playLink: "https://store.steampowered.com/app/1336490/Against_the_Storm/",
  },
  {
    id: 6,
    title: "Final Profit: A Shop",
    imageUrl: "/images/finalprofit.jpg",
    description:
      '"What if capitalism was the final boss?" Final Profit is an RPG with a twist—you’re not a hero, but a shopkeeper trying to outwit the system. You’ll sell goods, manage your inventory, and navigate a satirical world filled with quirky characters. It’s clever, witty, and surprisingly deep, blending economic simulation with RPG storytelling in a way that’s both fun and thought-provoking. ',
    developer: "By Brent Arnold",
    genre: "Genre: Simulation",
    release: "Release Date: March 6 2023",
    platform: ["PC"],
    bannerImage: "/screenshots/profitbanner.PNG",
    screenshots: ["/screenshots/profit1.PNG", "/screenshots/profit2.PNG"],
    playLink:
      "https://store.steampowered.com/app/1705140/Final_Profit_A_Shop_RPG/",
  },
  {
    id: 7,
    title: "Spaceflux",
    imageUrl: "/images/spaceflux.jfif",
    description:
      '"It’s a shooter—but make it multidimensional." Spaceflux is an FPS like no other, where maps fold, loop, and mirror themselves infinitely. The arena is as much of a weapon as your guns, and you’ll constantly be rethinking your strategy as you chase enemies through recursive space. If you’re looking for an FPS that breaks the rules and rewrites reality, this is it.',
    developer: "By Solo developer Gabriel Kollár",
    genre: "Genre:  FPS, Arena Shooter",
    release: "Release Date: August 19, 2021",
    platform: ["PC"],
    bannerImage: "/screenshots/fluxbanner.PNG",
    screenshots: ["/screenshots/flux1.PNG", "/screenshots/flux2.PNG"],
    playLink: "https://store.steampowered.com/app/1344440/Spaceflux/",
  },
  {
    id: 8,
    title: "Unpacking",
    imageUrl: "/images/unpackimage.PNG",
    description:
      '"Sometimes, a home tells a story." Unpacking is a game where you get to know someone’s life through their belongings. As you place objects in each room, subtle storytelling unfolds through memories and personal touches. It’s a meditative, heartfelt experience about finding comfort in familiar things and embracing change. ',
    developer: "By Witch Beam",
    genre: "Genre: Puzzle, Narrative",
    release: "Release Date: November 2, 2021",
    platform: ["PC", "Nintendo Switch", "PlayStation", "Xbox"],
    bannerImage: "/screenshots/unpackbanner.PNG",
    screenshots: ["/screenshots/unpack1.PNG", "/screenshots/unpack2.PNG"],
    playLink: "https://store.steampowered.com/app/1135690/Unpacking/",
  },
  {
    id: 9,
    title: "Signs of the Sojourner",
    imageUrl: "/images/signimage.PNG",
    description:
      '"What if conversations were card battles?" In Signs of the Sojourner, you travel across a beautifully illustrated world, collecting cards that represent emotional responses and building your deck of dialogue. Every choice shapes how people perceive you and affects your relationships. It’s a deck-builder with heart—a game about connection, empathy, and the challenge of communication. ',
    developer: "By Echodog Games",
    genre: "Genre: Deck-Building, Narrative, Adventure",
    release: "Release Date: May 14, 2020",
    platform: ["PC", "Nintendo Switch", "PlayStation", "Xbox"],
    bannerImage: "/screenshots/signbanner.PNG",
    screenshots: ["/screenshots/sign1.PNG", "/screenshots/sign2.PNG"],
    playLink:
      "https://store.steampowered.com/app/1058690/Signs_of_the_Sojourner/",
  },
  {
    id: 10,
    title: "Carto",
    imageUrl: "/images/cartoimage.PNG",
    description:
      '"Change the world, one piece at a time." Carto is an adorable puzzle-adventure game where you rearrange pieces of the map to explore and solve environmental puzzles. The world is whimsical and filled with quirky characters, and each puzzle feels like an extension of the story. If you love charming games that make you smile, Carto is a must-play. ',
    developer: "By Sunhead Games",
    genre: "Genre: Puzzle, Adventure",
    release: "Release Date: October 27, 2020",
    platform: ["PC", "Nintendo Switch", "PlayStation 4", "Xbox One"],
    bannerImage: "/screenshots/cartobanner.PNG",
    screenshots: ["/screenshots/carto1.PNG", "/screenshots/carto2.PNG"],
    playLink: "https://store.steampowered.com/app/1172450/Carto/",
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
