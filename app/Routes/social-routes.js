import Layout from "Layouts/index.js"
import Default from "Pages/default.js"
import Blog from "Pages/Blog/blog.js"
import BlogEditor from "Pages/Blog/blog-editor"
import BlogPost from "Pages/Blog/blog-post"
import Gallery from "Pages/Gallery/gallery.js"
import Album from "Pages/Gallery/album.js"
import { scrollToAnchor, PageTitle } from "Utils"

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
      "gallery",
      "calendar",
      "bfn-park",
    ],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      isAnchor
        ? scrollToAnchor(mdl.state.anchor)
        : PageTitle().scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",
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
        : PageTitle().scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",
          })
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },
  {
    id: "gallery",
    name: "Photo Gallery",
    // icon: Icons.home,
    route: "/social/gallery",
    isNav: true,
    group: ["nav", "social"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      isAnchor
        ? scrollToAnchor(mdl.state.anchor)
        : PageTitle().scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",
          })
    },
    component: (mdl) => m(Layout, { mdl }, m(Gallery, { mdl })),
  },
  {
    id: "album",
    name: "Photo Gallery Album",
    // icon: Icons.home,
    route: "/social/gallery/album:album",
    isNav: false,
    group: ["nav", "social"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      isAnchor
        ? scrollToAnchor(mdl.state.anchor)
        : PageTitle().scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",
          })
    },
    component: (mdl) => m(Layout, { mdl }, m(Album, { mdl })),
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
        : PageTitle().scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",
          })
    },
    component: (mdl) => m(Layout, { mdl }, m(Blog, { mdl })),
  },
  {
    id: "blog-editor",
    name: "Blog Editor",
    // icon: Icons.home,
    route: "/social/blog-editor:objectId",
    isNav: false,
    group: ["social"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      isAnchor
        ? scrollToAnchor(mdl.state.anchor)
        : PageTitle().scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",
          })
    },
    component: (mdl) => m(Layout, { mdl }, m(BlogEditor, { mdl })),
  },
  {
    id: "blog-post",
    name: "",
    // icon: Icons.home,
    route: "/social/blog-post:objectId",
    isNav: false,
    group: ["social"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      isAnchor
        ? scrollToAnchor(mdl.state.anchor)
        : PageTitle().scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",
          })
    },
    component: (mdl) => m(Layout, { mdl }, m(BlogPost, { mdl })),
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
        : PageTitle().scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",
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
