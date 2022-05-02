export default {
  view: ({ attrs: { mdl, children } }) =>
    m(
      "main",
      m(
        "#page-title.is-marginless.text-primary.is-vertical-align.is-horizontal-align.is-center",
        m(
          "p.text-center.p-t-25",
          {
            style: {
              fontWeight: "bolder",
              fontSize: "xx-large",
              height: !mdl.state.route.name && "57px",
            },
          },
          mdl.state.route.name
        )
      ),
      children
    ),
}

