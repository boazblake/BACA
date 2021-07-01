import Layout from "Layouts/index.js"
import Default from "Pages/default.js"
import Home from "Pages/home.js"
import About from "Pages/about.js"
import JoinBACA from "Pages/join-baca.js"
import { scrollToAnchor, PageTitle } from "Utils/index.js"

const Logo = m("img", {
  src: "images/logo.webp",
})

const Routes = [
  {
    id: "home",
    name: "Welcome to Bonham Acres Civic Association (BACA)",
    // icon: Icons.home,
    route: "/",
    isNav: true,
    group: ["toolbar"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      isAnchor
        ? scrollToAnchor(mdl.state.anchor)
        : window.scroll({
            top: 160,
            left: 0,
            behavior: "smooth",
          })
    },
    component: (mdl) => m(Layout, { mdl }, m(Home, { mdl })),
  },
  {
    id: "about",
    name: "About Bonham Acres",
    // icon: Icons.home,
    route: "/about",
    isNav: true,
    group: ["navmenu"],
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
    component: (mdl) => m(Layout, { mdl }, m(About, { mdl })),
  },
  {
    id: "contact",
    name: "Contact BACA",
    // icon: Icons.search,
    route: "/contact",
    isNav: false,
    group: ["navmenu"],
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
    id: "join-BACA",
    name: "Join Bonham Acres Civic Association",
    // icon: Icons.search,
    route: "/join-BACA",
    isNav: false,
    group: ["navmenu"],
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
    component: (mdl) => m(Layout, { mdl }, m(JoinBACA, { mdl })),
  },
]

export default Routes
