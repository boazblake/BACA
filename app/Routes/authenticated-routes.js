import m from "mithril"
import Default from "@/Pages/default.js"
import Account from "@/Pages/Account/index.js"
import Admin from "@/Pages/Admin"
import Layout from "@/Layouts/index.js"
import { ScrollToPageTitle, removePaypal } from "@/Utils"

const AuthenticatedRoutes = [
  {
    id: "account",
    parent: "/",
    name: "Account",
    title: "Account",
    // icon: Icons.logo,
    route: "/account/:name",
    position: ["toolbar"],
    group: ["authenticated"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return ScrollToPageTitle()
    },
    component: (mdl) =>
      m(Layout, { mdl }, m(Account, { key: mdl.state.anchor, mdl })),
  },
  {
    id: "admin",
    parent: "/",
    name: "Admin",
    title: "Admin",
    // icon: Icons.logo,
    route: "/admin/:name",
    position: ["toolbar"],
    group: ["authenticated"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      !isAnchor && ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(Admin, { mdl })),
  },
  {
    id: "profile-page",
    parent: "/",
    name: "Profile Page",
    title: "Profile Page",
    // icon: Icons.home,
    route: "/account/:name/profile",
    position: ["settings-nav"],
    group: ["authenticated"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {

      !isAnchor && ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },
  {
    id: "manage-users",
    parent: "/",
    name: "Manage Users",
    title: "Manage Users",
    // icon: Icons.users,
    route: "/account/:name/user-management",
    position: ["settings-nav"],
    group: ["authenticated", "admin"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      mdl.user.role != "admin" && m.route.set(m.route.get())
      !isAnchor && ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },
  {
    id: "logout",
    parent: "/",
    name: "",
    title: "",
    // icon: Icons.users,
    route: "/logout",
    position: [],
    group: ["authenticated", "admin"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      localStorage.clear()
      sessionStorage.clear()
      removePaypal()
      mdl.state.isAuth(false)
      mdl.user = {}
      let routes = ["/account"]
      let currentRoute = m.route.get()
      routes.map((r) => currentRoute.includes(r))
        ? m.route.set("/")
        : m.route.set(currentRoute)
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },
]

export default AuthenticatedRoutes
