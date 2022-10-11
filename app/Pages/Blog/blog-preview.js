import m from "mithril"
import { isAdminOrMod } from "@/Utils/helpers"
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'

const BlogPreview = {
  view: ({
    attrs: {
      key,
      mdl,
      post: { title, text, thumb, createdAt, updatedAt, author, objectId },
    },
  }) =>
    m(
      "article.card.col-6", { key },
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
        m('.is-large-p',
          {
            oncreate: ({ dom }) => {
              const str = `${text.slice(0, 100)}`
              new Viewer({
                el: dom,
                initialValue: str,
              })
            }
          }
        ),
        m(
          m.route.Link,
          // "a.pointer",
          { href: `/social/blog-post/${objectId}` },
          "... continue reading"
        )
      ),
      (author == mdl.user.name || isAdminOrMod(mdl)) &&
      m(
        "footer",
        m(
          m.route.Link,
          {
            selector: "button",
            href: `/social/blog-editor/${objectId}`,
          },
          "Edit"
        )
      )
    ),
}

export default BlogPreview

