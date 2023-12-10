import m from "mithril"
import Layout from "@/Layouts/index.js"
import BoardMembers from "@/Pages/board-members.js"
import Home from "@/Pages/home.js"
import About from "@/Pages/about.js"
import JoinBACA from "@/Pages/join-baca.js"
import { scrollToAnchor, ScrollToPageTitle } from "@/Utils/index.js"

const Logo = m("img", {
  src: "images/baca-logo.webp",
})

const Routes = [
  {
    id: "home",
    parent: '/',
    name: "Welcome",
    title: "Welcome to Bonham Acres Civic Association (BACA)",
    // icon: Icons.home,
    route: "/",
    isNav: true,
    group: ["toolbar"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return mdl.data.blogs.any()
        ? isAnchor ? scrollToAnchor(mdl.state.anchor) : ScrollToPageTitle()
        : m.route.set('/about')
    },
    component: (mdl) => m(Layout, { mdl }, m(Home, { mdl })),
  },
  {
    id: "about",
    parent: '/',
    name: "About",
    title: "About Bonham Acres Civic Association",
    // icon: Icons.home,
    route: "/about",
    isNav: true,
    group: ["navmenu"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return isAnchor ? scrollToAnchor(mdl.state.anchor) : ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(About, { mdl })),
  },
  {
    id: "join-BACA",
    parent: '/',
    name: "Join",
    title: "Join Bonham Acres Civic Association",
    // icon: Icons.search,
    route: "/join-BACA",
    isNav: false,
    group: ["navmenu"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return isAnchor ? scrollToAnchor(mdl.state.anchor) : ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(JoinBACA, { mdl })),
  },
  {
    id: "board-members",
    parent: '/',
    name: "Board",
    title: "Meet the Board of Bonham Acres Civic Association",
    // icon: Icons.search,
    route: "/board-members",
    isNav: true,
    group: ["navmenu"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return isAnchor ? scrollToAnchor(mdl.state.anchor) : ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(BoardMembers, { mdl })),
  },
]

export default Routes

