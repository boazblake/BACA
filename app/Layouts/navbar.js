import m from "mithril"
import NavLink from "@/Components/nav-link.js"
const isActiveRoute = (a, b) => (a == b ? "active tab outline" : "")


const routes = (mdl) => mdl.Routes.filter((r) => r.group.includes("navmenu"))

const Navbar = {
  view: ({ attrs: { mdl } }) =>
    m(
      "nav.nav.nav-center.tabs",
      routes(mdl).map((r) =>
        m(NavLink, {
          onmouseover: (e) => {
            mdl.state.navState(r.id)
            mdl.state.showingSubnav(r.children.any())
            e.stopPropagation()
            e.preventDefault()
          },
          onclick: (e) => {
            if (r.children.any()) {
              mdl.state.navState(r.id)
              mdl.state.showingSubnav(r.children.any())
              e.stopPropagation()
              e.preventDefault()
            }
          },
          mdl,
          role: "button",
          href: r.route,
          link: r.name,
          classList: `primary clear large-font ${isActiveRoute(
            `/${mdl.state.navState()}`,
            r.route
          )}`,
        })
      )
    ),
}

export default Navbar
