import { AngleLine, PopOutLine } from "@mithril-icons/clarity"
import NavLink from "Components/nav-link"
import AuthBox from "Components/authbox"
import { isActiveRoute } from "Utils/index.js"
import { replaceCSS } from "Styles/animations.js"

let navItemstate = {
  onHover: () => {},
}

const toggleRoutes = (mdl) => (id) => {
  let keys = Object.keys(mdl.navState)
  keys.map((k) => id !== k && mdl.navState[k](false))
  mdl.navState[id](!mdl.navState[id]())
}

const NavItem = () => {
  return {
    view: ({ attrs: { mdl, href, link, classList } }) =>
      m(
        `li.nav-item`,
        m(NavLink, { mdl, ...navItemstate, href, link, classList })
      ),
  }
}

const getChildRoutes = (mdl, routeIds) =>
  mdl.Routes.filter((r) => routeIds.includes(r.id))

const NavSection = ({ attrs: { mdl, route, toggleRoutes } }) => {
  let childRoutes = getChildRoutes(mdl, route.children)
  return {
    view: ({ attrs: { isSelected } }) =>
      m(
        "table",
        {
          onclick: (e) => toggleRoutes(mdl)(route.id),
        },
        m(
          "thead",
          m(
            "tr",
            m("th", route.name),
            m(
              "th",
              m(AngleLine, {
                style: { transform: `rotate(${isSelected() ? 180 : 0}deg)` },
              })
            )
          )
        ),
        isSelected() &&
          m(
            "tbody.show-child-routes",
            {
              onbeforeremove: replaceCSS(
                "show-child-routes",
                "hide-child-routes"
              ),
            },

            childRoutes.map((r) =>
              r.group.includes("external")
                ? m(
                    "tr.container",
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
                : m(
                    "tr.container",
                    m(NavItem, {
                      mdl,
                      href: r.route,
                      link: r.name,
                      classList: `p-8 -between ${isActiveRoute(r.route)}`,
                    })
                  )
            )
          )
      ),
  }
}

const NavModal = ({ attrs: { mdl } }) => {
  const routes = (mdl) => mdl.Routes.filter((r) => r.group.includes("navmenu"))
  let _domOverlay
  let _domModal

  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "article#modal-container.animated",
        {
          oncreate: ({ dom }) => (_domOverlay = dom),
          onclick: (e) => {
            if ([_domModal, _domOverlay].includes(e.target))
              mdl.state.showNavModal(false)
          },
        },
        m(
          `aside#modal`,
          {
            oncreate: ({ dom }) => (_domModal = dom),
            id: "nav-modal",
          },
          m(AuthBox, { mdl }),
          m(
            "ul",
            routes(mdl).map((r) =>
              r.children.any()
                ? m(NavSection, {
                    mdl,
                    route: r,
                    toggleRoutes,
                    isSelected: mdl.navState[r.id],
                  })
                : m(
                    "li",
                    m(NavItem, {
                      mdl,
                      href: r.route,
                      link: r.name,
                      classList: `${isActiveRoute(r.route)}`,
                    })
                  )
            )
          )
        )
      ),
  }
}

export default NavModal
