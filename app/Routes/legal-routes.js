import Layout from "Layouts/index.js"
import Default from "Pages/default.js"
import { scrollToAnchor, PageTitle } from "Utils/index.js"

const LegalRoutes = [
  {
    id: "legal",
    name: "Legal",
    // icon: Icons.home,
    route: "/legal",
    isNav: true,
    group: ["navmenu"],
    children: ["deed-restrictions", "city-ordinances"],
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
    id: "deed-restrictions",
    name: "Deed Restrictions",
    // icon: Icons.home,
    route: "/legal/deed-restrictions",
    isNav: true,
    group: ["nav", "legal"],
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
    id: "city-ordinances",
    name: "City Ordinances",
    // icon: Icons.home,
    route: "/legal/city-ordinances",
    isNav: true,
    group: ["nav", "legal"],
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
]

export default LegalRoutes
