import { ArrowLine, NoteEditLine } from "@mithril-icons/clarity/cjs"
import { parseMarkdown } from "Utils"
import { toViewModel } from "./blog"
import Loader from "Components/loader.js"
import { map } from "ramda"

const state = {
  blog: null,
}
const toBlogs = () => m.route.set("/social/blog")

const deleteBlog = (mdl) =>
  mdl.http.back4App
    .deleteTask(mdl)(`Classes/Blogs/${state.blog.objectId}`)
    .fork(toBlogs, toBlogs)

const fetchBlogPost = ({ attrs: { mdl } }) => {
  const onError = (e) => console.log(e)
  const onSuccess = ([blog]) => (state.blog = blog)

  let id = m.route.get().split(":")[1]
  // return console.log(id, m.route.params)

  mdl.http.back4App
    .getTask(mdl)(`Classes/Blogs/${id}`)
    .map(Array.of)
    .map(toViewModel)
    .fork(onError, onSuccess)
}

const BlogPost = {
  oninit: fetchBlogPost,
  view: ({ attrs: { mdl } }) =>
    mdl.state.isLoading()
      ? m(Loader)
      : m(
          "section.p-y-6.fade",
          m(
            "article.bg-light",
            m(
              "section.row.container",
              m(
                "hgroup.col",
                m("h2.bold", state.blog.title),
                m("h3"),
                m(
                  "h4",
                  "Added On ",
                  state.blog.createdAt,
                  state.blog.updatedAt !== state.blog.createdAt && [
                    " and updated on: ",
                    state.blog.updatedAt,
                  ],
                  " by ",
                  state.blog.author
                )
              ),
              m(
                "figure.col-3.is-horizontal-align",
                m("img", { src: state.blog.thumb || "images/main.webp" })
              )
            ),
            m(
              "hgroup.col.card",
              m.trust(
                HtmlSanitizer.SanitizeHtml(parseMarkdown(state.blog.text))
              )
            ),
            state.blog.author == mdl.user.name &&
              m(
                "footer.grouped",
                m(
                  m.route.Link,
                  {
                    selector: "button.button.primary.icon",
                    href: `/social/blog-editor:${state.blog.objectId}`,
                  },
                  "Edit",
                  m(NoteEditLine, { fill: "white" })
                ),
                m(
                  "button.button.error",
                  { onclick: () => deleteBlog(mdl) },
                  "Delete"
                )
              )
          ),

          m(
            m.route.Link,
            {
              selector: "button.button.primary.outline.icon",
              href: "/social/blog",
              class: "primary",
            },
            m(ArrowLine, { style: { transform: "rotate(270deg)" } }),
            "Back To Blogs"
          )
        ),
}

export default BlogPost
