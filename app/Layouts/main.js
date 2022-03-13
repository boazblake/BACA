export default {
  view: ({ attrs: { mdl, children } }) =>
    m(
      "main",
      m(
        "#page-title.is-marginless.bg-primary.text-white.is-vertical-align.is-horizontal-align.is-center",
        m("p.text-center.p-t-25", mdl.state.route.name)
      ),
      children
    ),
}
