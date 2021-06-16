import Layout from "Layouts/index.js"
import Default from "Pages/default.js"
import Login from "Pages/Auth/login-user.js"
import Register from "Pages/Auth/register-user.js"
import { scrollToAnchor } from "Utils/index.js"

const MemberRoutes = [
  {
    id: "safety",
    name: "Safety",
    // icon: Icons.search,
    route: "/safety",
    isNav: false,
    group: ["navmenu", "safety"],
    children: [
      "report",
      "district-J",
      "SeeClickFix",
      "Harrison-County-Public-Health",
      "Houston-311-Service-Request/Report",
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
    id: "report",
    name: "Report an Incident",
    // icon: Icons.search,
    route: "/safety/report",
    isNav: false,
    group: ["nav", "members"],
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
    id: "district-J",
    name: "District J",
    // icon: Icons.search,
    route: `/#`,
    external: "https://www.houstontx.gov/council/j/request.html",
    isNav: false,
    group: ["external", "members"],
    children: [],
    options: [],
  },
  {
    id: "SeeClickFix",
    name: "SeeClickFix Request",
    // icon: Icons.search,
    route: `/#`,
    external: "https://seeclickfix.com/houston/report",
    isNav: false,
    group: ["external", "members"],
    children: [],
    options: [],
  },
  {
    id: "Harrison-County-Public-Health",
    name: "Harrison County Public Health",
    // icon: Icons.search,
    route: `/#`,
    external:
      "https://publichealth.harriscountytx.gov/Services-Programs/Services/NeighborhoodNuisance",
    isNav: false,
    group: ["external", "members"],
    children: [],
    options: [],
  },
  {
    id: "Houston-311-Service-Request/Report",
    name: "Houston 311 Service Request/Report",
    // icon: Icons.search,
    route: `/#`,
    external:
      "https://www.houstontx.gov/311/ServiceRequestDirectoryWebpage.htm",
    isNav: false,
    group: ["external", "members"],
    children: [],
    options: [],
  },
]

export default MemberRoutes
