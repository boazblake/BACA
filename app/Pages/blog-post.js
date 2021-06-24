const formatTextForView = (text, state) =>
  state.show()
    ? [
        text,
        m(
          "a.pointer",
          { onclick: () => state.show(!state.show()) },
          "read less"
        ),
      ]
    : [
        text.slice(0, 100),
        "....",
        m(
          "a.pointer",
          { onclick: () => state.show(!state.show()) },
          "continue reading"
        ),
      ]

const BlogPost = () => {
  const state = {
    show: Stream(false),
  }
  return {
    view: ({
      attrs: {
        mdl,
        post: { title, text, thumb, createdAt, updatedAt, author, objectId },
      },
    }) =>
      m(
        "article.card",
        m(
          ".row",
          m(
            "hgroup.col",
            m("h2.bold", title),
            m(
              "h3",
              createdAt,
              updatedAt !== createdAt && ["updated on: ", updatedAt]
            ),
            m("h4", "Written By ", author)
          ),
          m(
            "figure.col.is-horizontal-align",
            m("img.", {
              src: thumb || "images/main.webp",
              style: {
                border: "1px solid black",
                borderRadius: "2%",
                width: "182px",
              },
            })
          )
        ),
        m("hgroup.col", m("h4", formatTextForView(text, state))),
        author == mdl.user.name &&
          m(
            "footer",

            m(
              "button",
              {
                onclick: () => {
                  mdl.state.editBlog(objectId)
                  m.route.set(`/social/blog-editor:${objectId}`)
                },
              },
              "Edit"
            )
          )
      ),
  }
}

export default BlogPost
