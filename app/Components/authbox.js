import NavLink from "Components/nav-link.js"
import { isActiveRoute } from "Utils/index.js"

const AuthBox = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      mdl.state.isAuth()
        ? [
            mdl.user.isAdmin &&
              m(NavLink, {
                mdl,
                href: `/dashboard/${mdl.user.name}`,
                link: "Dashboard",
                classList: `${isActiveRoute(
                  `/dashboard/${mdl.user.name}`
                )} button hidden-xs`,
              }),
            m(NavLink, {
              mdl,
              href: `/account/${mdl.user.name}`,
              link: "Your Account",
              classList: `${isActiveRoute(
                `/account/${mdl.user.name}`
              )} button hidden-xs`,
            }),
            m(NavLink, {
              mdl,
              href: "/logout",
              link: "Logout",
              classList: "bold auth-link hidden-xs",
            }),
          ]
        : m(".grid", [
            m(NavLink, {
              mdl,
              href: "/login",
              link: "Login",
              classList: `col ${isActiveRoute("/login")} button auth-link`,
            }),

            m(NavLink, {
              mdl,
              href: "/register",
              link: "Register",
              classList: `col ${isActiveRoute("/register")} button auth-link`,
            }),
          ]),
  }
}

export default AuthBox
