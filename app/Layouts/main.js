import { propEq } from "ramda"

let isShowingNav = (mdl) =>
  mdl.Routes.filter((r) => r.route == mdl.state.route.route)[0]
    .children.map((r) => mdl.Routes.filter(propEq("id", r))[0])
    .any()

let isShowingRoutes = (mdl) => mdl.settings.screenSize == "desktop"

const getStyle = (mdl) => ({
  marginTop: isShowingRoutes(mdl)
    ? isShowingNav(mdl) || mdl.state.subnavState()
      ? "700px"
      : "700px"
    : "550px",
})

const PageTitle = () => {
  return {
    view: ({ attrs: { show, name } }) =>
      show && m(".text-4x", m("h1.title.mb-20.text-center", name)),
  }
}

const Main = () => {
  return {
    view: ({ attrs: { mdl, children } }) =>
      m(
        "main",
        {
          id: "main",
          // style: getStyle(mdl),
        },

        m(PageTitle, {
          show: ![undefined, "/"].includes(m.route.get()),
          name: mdl.state.route.name,
        }),
        m(".frow centered-column items-stretch", children)
      ),
  }
}

export default Main
