import NavModal from "./nav-modal.js"
import { SlideOutRight, SlideInLeft } from "Styles/animations.js"
import { propEq } from "ramda"

let isShowingNav = (mdl) =>
  mdl.Routes.filter((r) => r.route == mdl.state.route.route)[0]
    .children.map((r) => mdl.Routes.filter(propEq("id", r))[0])
    .any()

let isShowingRoutes = (mdl) => mdl.settings.screenSize !== "phone"

const showNavMenu = (mdl) =>
  mdl.settings.screenSize !== "desktop" && mdl.state.showNavModal()

const getStyle = (mdl) => ({
  paddingTop: isShowingRoutes(mdl)
    ? isShowingNav(mdl)
      ? "380px"
      : "340px"
    : isShowingNav(mdl)
    ? "340px"
    : "300px",
})

const PageTitle = () => {
  return {
    view: ({ attrs: { show, name } }) =>
      show && m(".text-4x", m("h1.title.mb-20.text-center", name)),
  }
}

const Body = () => {
  return {
    view: ({ attrs: { mdl, children } }) =>
      m(
        ".body",
        {
          id: "body",
          style: getStyle(mdl),
        },

        showNavMenu(mdl) &&
          m(NavModal, {
            oncreate: SlideInLeft,
            onbeforeremove: SlideOutRight,
            mdl,
          }),
        m(PageTitle, {
          show: ![undefined, "/"].includes(m.route.get()),
          name: mdl.state.route.name,
        }),
        m(".frow centered-column items-stretch", children)
      ),
  }
}

export default Body
