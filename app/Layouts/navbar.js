import m from "mithril"
import NavLink from "@/Components/nav-link.js"
const isActiveRoute = (a, b) => (a == b ? "active button outline large-font" : "large-font")

const routes = (mdl) => mdl.Routes.filter((r) => r.group.includes("navmenu"))


const Navbar = {
  view: ({ attrs: { mdl } }) =>
    m(
      "nav.nav",
      routes(mdl).map((r) =>
        m(NavLink, {
          onmouseout: () => {
            // maxHeight = '50px'
          },
          onmouseover: (e) => {
            // if (r.children.any()) {
            // maxHeight = '300px'
            // let current = mdl.state.navState()
            // if (current !== r.id) {
            // console.log(current, r.id,)
            mdl.state.navState(r.id)
            mdl.state.showingSubnav(r.children.any())
            e.stopPropagation()
            e.preventDefault()
            // }
            // }
            // console.log('style', style())

          },
          onclick: (e) => {
            // if (r.children.any()) {
            mdl.state.navState(r.id)
            mdl.state.showingSubnav(r.children.any())
            e.stopPropagation()
            e.preventDefault()
            // }
          },
          mdl,
          role: "button",
          href: r.route,
          link: r.name,
          classList: `primary clear ${isActiveRoute(
            `/${mdl.state.navState()}`,
            r.route
          )}`,
        })
      )
    ),
}

export default Navbar
