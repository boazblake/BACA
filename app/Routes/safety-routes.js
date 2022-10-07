import m from "mithril"
import Layout from "@/Layouts/index.js"
import Default from "@/Pages/default.js"
import { scrollToAnchor, ScrollToPageTitle } from "@/Utils"

const MemberRoutes = [
  {
    id: "safety",
    parent: '/',
    name: "Safety",
    title: "Neighborhood Safety",
    // icon: Icons.search,
    route: "/safety",
    isNav: true,
    group: ["navmenu"],
    children: [
      "report",
      "district-J",
      "SeeClickFix",
      "Harrison-County-Public-Health",
      "Houston-311-Service-Request/Report",
    ],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return isAnchor ? scrollToAnchor(mdl.state.anchor) : ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },
  {
    id: "report",
    parent: '/',
    name: "File An Internal Report With BACA",
    title: "File An Internal Report With BACA",
    // icon: Icons.search,
    route: "/safety/report",
    isNav: true,
    group: ["nav", "safety"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return isAnchor ? scrollToAnchor(mdl.state.anchor) : ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },
  {
    id: "district-J",
    parent: '/',
    name: "District J",
    title: "District J",
    // icon: Icons.search,
    route: "/external",
    external: "https://www.houstontx.gov/council/j/request.html",
    isNav: true,
    group: ["external", "safety"],
    children: [],
    options: [],
  },
  {
    id: "Houston-311-Citizen-Portal",
    parent: '/',
    name: "Houston 311 Citizen Portal",
    title: "Houston 311 Citizen Portal",
    // icon: Icons.search,
    route: "/external",
    external: "https://apps.apple.com/us/app/id1556529541",
    isNav: true,
    group: ["external", "safety"],
    children: [],
    options: [],
  },
  {
    id: "Harrison-County-Public-Health",
    parent: '/',
    name: "Harrison County Public Health",
    title: "Harrison County Public Health",
    // icon: Icons.search,
    route: "/external",
    external:
      "https://publichealth.harriscountytx.gov/Services-Programs/Services/NeighborhoodNuisance",
    isNav: true,
    group: ["external", "safety"],
    children: [],
    options: [],
  },
  {
    id: "Houston-311-Service-Request/Report",
    parent: '/',
    name: "Houston 311 Service Request/Report",
    title: "Houston 311 Service Request/Report",
    // icon: Icons.search,
    route: "/external",
    external: "https://houston311.powerappsportals.us/en-US/",
    isNav: true,
    group: ["external", "safety"],
    children: [],
    options: [],
  },
]

export default MemberRoutes
