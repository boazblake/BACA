import HtmlSanitizer from "Utils/html-sanitize"

console.log(HtmlSanitizer)

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
          m("h3"),
          m(
            "p",
            "Added On ",
            createdAt,
            updatedAt !== createdAt && [" updated on ", updatedAt],
            " by ",
            author
          )
        ),
        m(
          "figure.col.is-horizontal-align",
          m("img", { src: thumb || "images/main.webp" })
        )
      ),
      m(
        "hgroup.col",
        m.trust(HtmlSanitizer.SanitizeHtml(text.slice(0, 100))),
        "...",
        m(
          m.route.Link,
          // "a.pointer",
          { href: `/social/blog-post:${objectId}` },
          "continue reading"
        )
      ),
      (author == mdl.user.name || ["admin", "mod"].includes(mdl.user.role)) &&
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
