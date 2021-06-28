const BlogPreview = {
  view: ({
    attrs: {
      mdl,
      post: { title, text, thumb, createdAt, updatedAt, author, objectId },
    },
  }) =>
    m(
      "article.card.col-6",
      m(
        ".row",
        m(
          "hgroup.col-8",
          m("h2.bold", title),
          m(
            "h3",
            createdAt,
            updatedAt !== createdAt && ["updated on: ", updatedAt]
          ),
          m("h4", "Added By ", author)
        ),
        m(
          "figure.col.is-horizontal-align",
          m("img", {
            src: thumb || "images/main.webp",
            style: {
              border: "1px solid black",
              borderRadius: "2%",
              width: "182px",
            },
          })
        )
      ),
      m(
        "hgroup.col",
        m(
          "h4",
          text.slice(0, 100),
          "....",
          m(
            m.route.Link,
            // "a.pointer",
            { href: `/social/blog-post:${objectId}` },
            "continue reading"
          )
        )
      ),
      author == mdl.user.name &&
        m(
          "footer",
          m(
            m.route.Link,
            {
              selector: "button",
              href: `/social/blog-editor:${objectId}`,
            },
            "Edit"
          )
        )
    ),
}

export default BlogPreview
