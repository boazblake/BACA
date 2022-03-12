import NavLink from "Components/nav-link.js"
import { isActiveRoute } from "Utils/index.js"

const AuthBox = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      mdl.state.isAuth()
        ? m(
            ".is-center",
            ["admin", "mod"].includes(mdl.user.role) &&
              m(NavLink, {
                mdl,
                href: `/admin/${mdl.user.routename}`,
                link: "Admin",
                classList: `${isActiveRoute(
                  `/admin/${mdl.user.routename}`
                )} button dark`,
              }),
            m(NavLink, {
              mdl,
              href: `/account/${mdl.user.routename}`,
              role: "button",
              link: "Your Account",
              classList: `${isActiveRoute(
                `/account/${mdl.user.routename}`
              )} button primary`,
            }),
            m(NavLink, {
              mdl,
              href: "/logout",
              role: "button",
              link: "Logout",
              classList: "button secondary",
            })
          )
        : m(
            ".grouped.is-center",
            m(NavLink, {
              mdl,
              role: "button",
              href: "/login",
              link: "Login",
              classList: `${isActiveRoute("/login")} button primary`,
            }),
            m(NavLink, {
              mdl,
              role: "button",
              href: "/register",
              link: "Register",
              classList: `${isActiveRoute("/register")} button secondary`,
            })
          ),
  }
}

export default AuthBox
