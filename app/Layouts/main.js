import { addSuccess } from "Components/toast"

const Main = () => {
  return {
    view: ({ attrs: { mdl, children } }) =>
      m(
        "main",
        m(
          "#page-title.is-marginless.bg-primary.text-white.is-vertical-align.is-horizontal-align.is-center",
          { onclick: (e) => addSuccess("yes") },
          m("p.text-center.p-t-25", mdl.state.route.name)
        ),
        children
      ),
  }
}

export default Main
