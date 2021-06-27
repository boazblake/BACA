import { parseMarkdown } from "Utils"
import { toViewModel } from "./blog"

const state = {
  blog: null,
}
const toBlogs = () => m.route.set("/social/blog")

const deleteBlog = (mdl) =>
  mdl.http.back4App
    .deleteTask(mdl)(`Classes/Blogs/${state.objectId}`)
    .fork(toBlogs, toBlogs)

const fetchBlogPost = ({ attrs: { mdl } }) => {
  const onError = (e) => console.log(e)
  const onSuccess = (blog) => (state.blog = blog)

  let id = m.route.get().split(":")[1]
  mdl.http.back4App
    .getTask(mdl)(`Classes/Blogs/${id}`)
    .map(toViewModel)
    .fork(onError, onSuccess)
}

const BlogPost = {
  oninit: fetchBlogPost,
  view: ({ attrs: { mdl } }) =>
    mdl.state.isLoading()
      ? m("article.card", "LOADING POST")
      : m(
          "",
          m(
            "article.card",
            m(
              ".row",
              m(
                "hgroup.col",
                m("h2.bold", state.blog.title),
                m(
                  "h3",
                  state.blog.createdAt,
                  state.blog.updatedAt !== state.blog.createdAt && [
                    "updated on: ",
                    state.blog.updatedAt,
                  ]
                ),
                m("h4", "Added By ", state.blog.author)
              ),
              m(
                "figure.col.is-horizontal-align",
                m("img.", {
                  src: state.blog.thumb || "images/main.webp",
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
                m.trust(
                  HtmlSanitizer.SanitizeHtml(parseMarkdown(state.blog.text))
                )
              )
            ),
            state.blog.author == mdl.user.name &&
              m(
                "footer.grouped",
                m(
                  m.route.Link,
                  {
                    selector: "button",
                    href: `/social/blog-editor:${state.blog.objectId}`,
                  },
                  "Edit"
                ),
                m("button", { onclick: () => deleteBlog(mdl) }, "Delete")
              )
          ),

          m(
            m.route.Link,
            { selector: "button", href: "/social/blog", class: "primary" },
            "Back To Blogs"
          )
        ),
}

export default BlogPost