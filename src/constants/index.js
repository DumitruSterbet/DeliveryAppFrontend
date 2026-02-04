export const navlinks = [
  {
    name: "Home",
    subLinks: [
      { name: "Discover", to: "/discover", icon: "BiPlayCircle" },
      { name: "Browse", to: "/browse", icon: "RiListIndefinite" },
      { name: "Search", to: "/search", icon: "FaSearchengin" },
    ],
  },
  {
    name: "Your Library",
    subLinks: [
      {
        name: "Liked Songs",
        to: "/liked-songs",
        icon: "MdOutlineFavoriteBorder",
      },
      { name: "Favourite Playlists", to: "/favourite-playlists", icon: "GiLoveSong" },
    ],
  },
  {
    name: "Account",
    subLinks: [
      { name: "Profile", to: "/profile", icon: "BiUser" },
      { name: "Logout", to: "/logout", icon: "MdLogout" },
    ],
  },
];

export const logo = {
  name: "DeliveryApp",
  icon: "PiMusicNoteFill",
};
