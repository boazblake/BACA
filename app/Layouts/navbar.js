import { PopOutLine } from "@mithril-icons/clarity"
import NavLink from "Components/nav-link.js"

const isActiveRoute = (a, b) => (a == b ? "is-active" : "")

const Navbar = () => {
  const routes = (mdl) => mdl.Routes.filter((r) => r.group.includes("navmenu"))
  const subroutes = (mdl) =>
    mdl.Routes.filter((r) =>
      r.group.includes(mdl.state.navState().split("/")[1])
    )
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "nav.navigation.container-fluid#navbar",
        m(
          "ul",
          routes(mdl).map((r) =>
            m(
              "li",
              m(NavLink, {
                mdl,
                href: r.route,
                link: r.name,
                classList: `${isActiveRoute(mdl.state.navState(), r.route)}`,
              })
            )
          )
        )
      ),
  }
}

export default Navbar
