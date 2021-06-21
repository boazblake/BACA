import Layout from "Layouts/index.js"
import Default from "Pages/default.js"
import Home from "Pages/home.js"
import About from "Pages/about.js"

const Logo = m("img", {
  src: "Images/logo.webp",
})

import { scrollToAnchor } from "Utils/index.js"

const Routes = [
  {
    id: "home",
    name: "Home",
    // icon: Icons.home,
    route: "/",
    isNav: true,
    group: ["toolbar"],
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
    component: (mdl) => m(Layout, { mdl }, m(Home, { mdl })),
  },
  {
    id: "about-us",
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
        : window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          })
    },
    component: (mdl) => m(Layout, { mdl }, m(About, { mdl })),
  },
  {
    id: "contact",
    name: "Contact BCA",
    // icon: Icons.search,
    route: "/contact",
    isNav: false,
    group: ["navmenu"],
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
]

export default Routes
