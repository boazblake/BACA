const toRoutes = (mdl) => (acc, route) => {
  acc[route.route] = {
    onmatch: (args, path, fullroute) => {
      mdl.state.showNavModal(false)
      if (route.group.includes("authenticated") && !mdl.state.isAuth()) {
        mdl.route.set(m.route.get())
      }
      mdl.state.route = route
      mdl.state.anchor = path.split("#")[1]
      mdl.state.navState(`/${route.route.split("/")[1]}`)
      route.route.split("/")[2]
        ? mdl.state.subnavState(route.route)
        : mdl.state.subnavState(null)
      let isAnchor = Boolean(mdl.state.anchor)
      route.onmatch(mdl, args, path, fullroute, isAnchor)
    },
    render: () => route.component(mdl),
  }
  return acc
}

const App = (mdl) => mdl.Routes.reduce(toRoutes(mdl), {})

export default App
