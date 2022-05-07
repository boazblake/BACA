import { ArrowLine, NoteEditLine } from "@mithril-icons/clarity/cjs"
import { parseMarkdown, AVATAR_URL } from "Utils"
import HtmlSanitizer from "Utils/html-sanitize"

import { toViewModel } from "./blog"
import Loader from "Components/loader.js"

const state = {
  status: "loading",
  blog: null,
  comments: null,
  modal: Stream(false),
  new: {
    comment: "",
  },
}

const Modal = {
  view: () =>
    m(
      ".modal-container",
      { style: { minHeight: "100vh" } },
      m(
        ".modal",
        m("header.modal-header"),
        m(
          "section.modal-content.flex-col",
          {
            onclick: (e) => state.modal(null),
          },
          m("img", {
            alt: "",
            src: state.modal(),
          })
        )
      )
    ),
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
          m("img", {
            src: blog.thumb || "images/main.webp",
            onclick: (e) => state.modal(blog.img),
          })
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

// const Comments = {
//   view: ({ attrs: { blog, comments, mdl } }) =>
//     m(
//       "section.container.p-y-25",
//       mdl.state.isAuth() &&
//         m(
//           "aside.card",
//           m(
//             "header.row",
//             m(
//               "figure.col-2",
//               m("img.avatar", {
//                 style: { maxWidth: "100px" },
//                 src: mdl.user.avatar || AVATAR_URL,
//               }),
//               m("caption", mdl.user.name)
//             ),
//             m(
//               ".col-10",
//               m(
//                 "textarea.w100",
//                 {
//                   // style: { width: "80%" },
//                   rows: 3,
//                   onchange: (e) => (state.new.comment = e.target.value),
//                 },
//                 state.new.comment
//               )
//             )
//           ),
//           m("footer.is-right", m("button.is-right", "Submit"))
//         ),
//       comments &&
//         comments.map((comment) =>
//           m(
//             "aside.row.card",
//             m(
//               "figure.col",
//               m("img.avatar", {
//                 style: { maxWidth: "100px" },
//                 src: mdl.user.avatar || AVATAR_URL,
//               }),
//               m("label.row", "comment.user"),
//               m("label.row", "comment.date")
//             ),
//             m("p.col", comment)
//           )
//         )
//     ),
// }

const toBlogs = () => m.route.set("/social/blog")

const deleteBlog = (mdl) =>
  mdl.http.back4App
    .deleteTask(mdl)(`Classes/Blogs/${state.blog.objectId}`)
    .fork(toBlogs, toBlogs)

const fetchBlogPost = ({ attrs: { mdl, id } }) => {
  const onError = (e) => {
    log("fetchBlogPost")(e)
    e.code == 404 && m.route.set("/social/blog")
    state.status = "error"
  }
  const onSuccess = ([blog]) => {
    state.blog = blog
    state.status = "loaded"
  }
  mdl.http.back4App
    .getTask(mdl)(`Classes/Blogs/${id}`)
    .map(Array.of)
    .map(toViewModel)
    .fork(onError, onSuccess)
}

const BackToBlogs = () =>
  m(
    m.route.Link,
    {
      selector: "button.button.clear.icon",
      href: "/social/blog",
      class: "primary",
    },
    m(ArrowLine, { style: { transform: "rotate(270deg)" } }),
    "Back To Blogs"
  )

const BlogPost = {
  oninit: fetchBlogPost,
  view: ({ attrs: { mdl } }) =>
    m(
      "section.fade.p-y-6.container",
      state.status == "error" && m("p", "error redirecting"),
      state.status == "loading" && m(Loader),
      state.status == "loaded" && [
        BackToBlogs(),
        m(Post, { blog: state.blog, mdl }),
        BackToBlogs(),
        state.modal() && m(Modal),
        // m(Comments, { blog: state.blog, comments: state.comments, mdl }),
      ]
    ),
}

export default BlogPost

