import Layout from "Layouts/index.js"
import Default from "Pages/default.js"
import Blog from "Pages/blog.js"
import { scrollToAnchor } from "Utils/index.js"
import BlogEditor from "Pages/blog-editor"

const SocialRoutes = [
  {
    id: "social",
    name: "Social",
    // icon: Icons.home,
    route: "/social",
    isNav: true,
    group: ["navbar", "navmenu"],
    children: [
      "map-of-bonham-acres",
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
    name: "Bonham Acres Community Blog",
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
    component: (mdl) => m(Layout, { mdl }, m(Blog, { mdl })),
  },
  {
    id: "blog-editor",
    name: "Blog Editor",
    // icon: Icons.home,
    route: "/social/blog-editor",
    isNav: false,
    group: ["social"],
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
    component: (mdl) => m(Layout, { mdl }, m(BlogEditor, { mdl })),
  },
  {
    id: "map-of-bonham-acres",
    name: "Explore Bonham Acres",
    // icon: Icons.home,
    route: "/social/map",
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
