import m from "mithril"
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import { prop } from 'ramda'
import { editIcon, leftArrowIcon } from "@/Utils/"

const state = {
  status: "loading",
  blog: null,

  comments: null,
  new: {
    comment: "",
  },
}

const resetState = () => {
  state.status = 'loading'
  state.blog = null

}

const Post = {
  onremove: () => { },
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
            onclick: (e) => {
              mdl.modal.content(
                m("img.is-center", {
                  style: { height: "100%", margin: "0 auto" },
                  src: blog.img || "images/main.webp",
                  alt: "",
                })
              )
              mdl.toggleLayoutModal(mdl)
            },
          })
        )
      ),
      m(
        "hgroup.col.is-large-p",
        {
          oncreate: ({ dom, }) =>
            new Viewer({
              el: dom,
              initialValue: blog.text,
            })
        },

      ),
      blog.author == mdl.user.name &&
      m(
        "footer.grouped",
        m(
          m.route.Link,
          {
            selector: "button.button.primary.icon",
            href: `/social/blog-editor/${blog.objectId}`,
          },
          "Edit", editIcon
        )
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

const fetchBlogPost = ({ attrs: { mdl, id } }) => {
  const onError = (e) => {
    log("fetchBlogPost")(e)
    e.code == 404 && m.route.set("/social/blog")
    state.status = "error"
  }
  const onSuccess = (blog) => {
    state.blog = blog
    state.status = "loaded"
  }
  mdl.http.back4App
    .getTask(mdl)(`blogs/${id}`)
    .map(prop("results"))
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
    leftArrowIcon,
    "Back To Blogs"
  )

const BlogPost = {
  onremove: resetState,
  oninit: fetchBlogPost,
  view: ({ attrs: { mdl } }) =>
    m(
      "section.fade.p-y-6.container",
      state.status == "error" && m("p", "error redirecting"),
      // state.status == "loading" && m(Loader),
      state.status == "loaded" && [
        BackToBlogs(),
        m(Post, { blog: state.blog, mdl }),
        BackToBlogs(),
        // m(Comments, { blog: state.blog, comments: state.comments, mdl }),
      ]
    ),
}

export default BlogPost

