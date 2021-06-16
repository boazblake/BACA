import Layout from "Layouts/index.js"
import Default from "Pages/default.js"
import { scrollToAnchor } from "Utils/index.js"

const SocialRoutes = [
  {
    id: "social",
    name: "Social",
    // icon: Icons.home,
    route: "/social",
    isNav: true,
    group: ["navbar", "social", "navmenu"],
    children: [
      "local-news",
      "podcast",
      "blog",
      "explore",
      "photos",
      "calendar",
      "bfn-park",
    ],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      isAnchor
        ? scrollToAnchor(mdl.state.anchor)
        : window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          })
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },
  {
    id: "calendar",
    name: "Events Calendar",
    // icon: Icons.home,
    route: "/social/calendar",
    isNav: true,
    group: ["nav", "social"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      isAnchor
        ? scrollToAnchor(mdl.state.anchor)
        : window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          })
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },
  {
    id: "photos",
    name: "Photo Gallery",
    // icon: Icons.home,
    route: "/social/photos",
    isNav: true,
    group: ["nav", "social"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      isAnchor
        ? scrollToAnchor(mdl.state.anchor)
        : window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          })
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },
  {
    id: "blog",
    name: "Blog",
    // icon: Icons.home,
    route: "/social/blog",
    isNav: true,
    group: ["nav", "social"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      isAnchor
        ? scrollToAnchor(mdl.state.anchor)
        : window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          })
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },
  {
    id: "local-news",
    name: "Local News",
    // icon: Icons.home,
    route: "/social/local-news",
    isNav: true,
    group: ["nav", "social"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      isAnchor
        ? scrollToAnchor(mdl.state.anchor)
        : window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          })
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },
  {
    id: "podcast",
    name: "Podcast",
    // icon: Icons.home,
    route: "/social/podcast",
    isNav: true,
    group: ["nav", "social"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      isAnchor
        ? scrollToAnchor(mdl.state.anchor)
        : window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          })
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },

  {
    id: "explore",
    name: "Explore Houston",
    // icon: Icons.home,
    route: "/social/explore",
    isNav: true,
    group: ["nav", "social"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      isAnchor
        ? scrollToAnchor(mdl.state.anchor)
        : window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          })
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },

  {
    id: "bfn-park",
    name: "Bonham Family Nature Park",
    // icon: Icons.home,
    route: `/#`,
    external: "https://www.pct3.com/Parks/Bonham-Family-Nature-Park",
    isNav: true,
    group: ["nav", "social", "external"],
    children: [],
    options: [],
  },
]

export default SocialRoutes
