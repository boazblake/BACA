import m from "mithril"
import Layout from "@/Layouts/index.js"
import Default from "@/Pages/default.js"
import Login from "@/Pages/Auth/login-user.js"
import Register from "@/Pages/Auth/register-user.js"
import { scrollToAnchor, ScrollToPageTitle } from "@/Utils"

const MemberRoutes = [
  // {
  //   id: "members",
  //   parent: '/',
  //     //   name: "Members",
  // title: "Members",
  //   // icon: Icons.search,
  //   route: "/members",
  //   isNav: false,
  //   group: ["navbar", "members"],
  //   children: [],
  //   options: [],
  //   onmatch: (mdl, args, path, fullroute, isAnchor) => {
  //     return isAnchor ? scrollToAnchor(mdl.state.anchor) : ScrollToPageTitle()
  //   },
  //   component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  // },
  {
    id: "login",
    parent: '/',
    name: "Account Login",
    title: "Account Login",
    // icon: Icons.search,
    route: "/login",
    isNav: false,
    group: ["nav", "members"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return isAnchor ? scrollToAnchor(mdl.state.anchor) : ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(Login, { mdl })),
  },
  {
    id: "register",
    parent: '/',
    name: "Register Account",
    title: "Register Account",
    // icon: Icons.search,
    route: "/register",
    isNav: false,
    group: ["nav", "members"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return isAnchor ? scrollToAnchor(mdl.state.anchor) : ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(Register, { mdl })),
  },
  {
    id: "volunteer",
    parent: '/',
    name: "Volunteer",
    title: "Volunteer With Bonham Acres Civic Association",
    // icon: Icons.search,
    route: "/members/volunteer",
    isNav: false,
    group: ["nav", "members"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return isAnchor ? scrollToAnchor(mdl.state.anchor) : ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },
  {
    id: "join",
    parent: '/',
    name: "Become a Member",
    title: "Become a Member",
    // icon: Icons.search,
    route: "/members/join",
    isNav: true,
    group: ["nav", "members"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return isAnchor ? scrollToAnchor(mdl.state.anchor) : ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },
]

export default MemberRoutes
