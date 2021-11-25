import { ArrowLine, NoteEditLine } from "@mithril-icons/clarity/cjs"
import { parseMarkdown, AVATAR_URL } from "Utils"
import HtmlSanitizer from "Utils/html-sanitize"

import { toViewModel } from "./blog"
import Loader from "Components/loader.js"

const state = {
  blog: null,
  comments: null,
  new: {
    comment: "",
  },
}

const Post = {
  view: ({ attrs: { blog, mdl } }) =>
    m(
      "section.card",
      m(
        ".row",
        m(
          "hgroup.col",
          m("h2.bold", blog.title),
          m(
            "h4",
            m(
              "i",
              "Added On ",
              blog.createdAt,
              blog.updatedAt !== blog.createdAt && [
                " and updated on: ",
                blog.updatedAt,
              ],
              " by ",
              blog.author
            )
          )
        ),
        m(
          "figure.col-3.is-horizontal-align",
          m("img", { src: blog.thumb || "images/main.webp" })
        )
      ),
      m(
        "hgroup.col",
        m.trust(HtmlSanitizer.SanitizeHtml(parseMarkdown(blog.text)))
      ),
      blog.author == mdl.user.name &&
        m(
          "footer.grouped",
          m(
            m.route.Link,
            {
              selector: "button.button.primary.icon",
              href: `/social/blog-editor:${blog.objectId}`,
            },
            "Edit",
            m(NoteEditLine, { fill: "white" })
          ),
          m("button.button.error", { onclick: () => deleteBlog(mdl) }, "Delete")
        )
    ),
}

const Comments = {
  view: ({ attrs: { blog, comments, mdl } }) =>
    m(
      "section.container.p-y-25",
      m(
        "aside.card",
        m(
          ".row",
          m(
            "figure.col-2.is-left",
            m("img.avatar", {
              style: { maxWidth: "100px" },
              src: mdl.user.avatar || AVATAR_URL,
            })
          ),
          m(
            ".col-10.is-right",
            m(
              "textarea.w100",
              {
                rows: 3,
                onchange: (e) => (state.new.comment = e.target.value),
              },
              state.new.comment
            )
          )
        ),
        m("footer.is-right", m("button.is-right", "Submit"))
      ),
      comments &&
        comments.map((comment) =>
          m(
            "aside.row.card",
            m(
              "figure.col",
              m("img.avatar", {
                style: { maxWidth: "100px" },
                src: mdl.user.avatar || AVATAR_URL,
              }),
              m("label.row", "comment.user"),
              m("label.row", "comment.date")
            ),
            m("p.col", comment)
          )
        )
    ),
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
          "section.fade.p-y-6.container",
          m(Post, { blog: state.blog, mdl }),
          m(Comments, { blog: state.blog, comments: state.comments, mdl }),
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
