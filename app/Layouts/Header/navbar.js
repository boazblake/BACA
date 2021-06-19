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
    view: ({ attrs: { mdl } }) => {
      return m("nav#navigation", [
        m(
          "nav.grid.col.col-12.navbar",
          routes(mdl).map((r) =>
            m(
              ".col.col-middle",
              m(NavLink, {
                mdl,
                href: r.route,
                link: r.name,
                classList: `${isActiveRoute(mdl.state.navState(), r.route)}`,
              })
            )
          )
        ),
        subroutes(mdl).any() &&
          m(
            "nav.grid.col.col-12",
            {
              id: "sub-navbar",
            },
            subroutes(mdl).map((r) =>
              m(
                ".col.col-bottom.col-align-bottom",
                r.group.includes("external")
                  ? m(
                      ".nav-link",
                      m(
                        "a",
                        { target: "_blank", href: r.external },
                        r.name,
                        m(PopOutLine, {
                          margin: "8px",
                          width: "15px",
                          height: "15px",
                        })
                      )
                    )
                  : m(NavLink, {
                      mdl,
                      href: r.route,
                      link: r.name,
                      classList: `col col-middle col-align-middle ${isActiveRoute(
                        mdl.state.subnavState(),
                        r.route
                      )}`,
                    })
              )
            )
          ),
      ])
    },
  }
}

export default Navbar
