const allgames = [
  {
    id: 1,
    title: "ViewFinder",
    imageUrl: "/images/viewfinder.jpg",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "Viewfinder is a mind-bending first person adventure game in which you can bring pictures to life by placing them into the world. It tells the story of the ever changing world, human experience and relationships, meaningful and misguided passion for change, and overcoming loss.",
    developer: "By Sad Owl Studios",
    genre: "Genre: Puzzle",
    release: "Release Date: July 18 2023",
    platform: "Platforms: PC, PS5, PS4",
  },
  {
    id: 2,
    title: "Chants of Sennaar",
    imageUrl: "/images/chants.jfif",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "Unveil mysteries behind the fragments of the past Divided since the dawn of time.",
    developer: "By Rundisc",
    genre: "Genre: Adventure, Puzzle",
    release: "Release Date: September 5 2023",
    platform: "Platforms: PC, Switch, PS4, XBOX ONE",
  },
  {
    id: 3,
    title: "Wall World",
    imageUrl: "/images/wallworld2.jpg",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "A mining rogue-lite with tower defense elements. Explore procedurally generated mines and discover fantastical biomes. Find resources and technologies for purchasing valuable upgrades. Fight off hordes of aggressive monsters using your mobile base.",
    developer: "By Alawar",
    genre: "Genre: Adventure",
    release: "Release Date: April 5 2023",
    platform: "Platforms: PC, Switch, PS5, XBOX SERIES X, SERIES S",
  },
  {
    id: 4,
    title: "Isles of Sea and Sky",
    imageUrl: "/images/seasky.jpg",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      " Solve novel block-pushing puzzles while unearthing a mystifying narrative.",
    developer: "By Cicada Games",
    genre: "Genre: Adventure, Puzzle",
    release: "Release Date: March 31 2024",
    platform: "Platforms: PC, Switch",
  },
  {
    id: 5,
    title: "Against the Storm",
    imageUrl: "/images/storm.jpg",
    ratings: {
      veryGood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "A dark fantasy city builder where you must rebuild civilization in the face of apocalyptic rains. ",
    developer: "By Eremite Games",
    genre: "Genre: Simulation",
    release: "Release Date: December 8 2023",
    platform: "Platforms: PC",
  },
  {
    id: 6,
    title: "Final Profit: A Shop",
    imageUrl: "/images/finalprofit.jpg",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "Gather products and find customers. Spend your hard-earned profits on upgrades and investments. Make far-reaching choices as you expand your business. ",
    developer: "By Brent Arnold",
    genre: "Genre: Simulation",
    release: "Release Date: March 6 2023",
    platform: "Platforms: PC",
  },
  {
    id: 7,
    title: "Darkest Dungeon 2",
    imageUrl: "/images/darkest.jpg",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "Form a party, equip your stagecoach, and set off across the decaying landscape on a last gasp quest to avert the apocalypse.",
    developer: "By Red Hook Studios",
    genre: "Genre: Adventure",
    release: "Release Date: May 8 2023",
    platform: "Platforms: PC, PS4, PS5",
  },
  {
    id: 8,
    title: "Spaceflux",
    imageUrl: "/images/spaceflux.jfif",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "The psychedelic shooter where the map contains itself recursively, like a fractal. Experience arena deathmatches like never before in fractal worlds, infinite landscapes and fully destructible environments. ",
    developer: "By Calin Ardelean",
    genre: "Genre: Puzzle",
    release: "Release Date: Early Access, TBA",
    platform: "Platforms: PC",
  },
  {
    id: 9,
    title: "Hollow Knight",
    imageUrl: "/images/hollowknight.jpg",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "A challenging action-adventure game set in a beautifully hand-drawn, interconnected world. Players explore vast caverns, battle creatures, and uncover ancient mysteries. ",
    developer: "By Team Cherry",
    genre: "Genre: Action-Adventure, Metroidvania",
    release: "Release Date: February 24, 2017",
    platform: "Platforms: PC, Nintendo Switch, PlayStation 4, Xbox One",
  },
  {
    id: 10,
    title: "Celeste",
    imageUrl: "/images/celeste.PNG",
    ratings: {
      verygood: 0,
      good: 0,
      decent: 0,
      bad: 0,
    },
    description:
      "A platformer that combines tight controls with a touching narrative. Players guide Madeline as she climbs Celeste Mountain, facing both physical and emotional challenges. ",
    developer: "By Maddy Makes Games",
    genre: "Genre: Platformer",
    release: "Release Date: January 25, 2018",
    platform:
      "Platforms: PC, Nintendo Switch, PlayStation 4, Xbox One, Google Stadia",
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
