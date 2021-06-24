import { formatDate } from "Utils"
import { compose, lensProp, over } from "ramda"
import BlogPost from "./blog-post.js"

const state = {
  errors: {},
  blogs: [],
}

const formatLensDate = (prpty) => over(lensProp(prpty), formatDate)

const toViewModel = compose(
  formatLensDate("updatedAt"),
  formatLensDate("createdAt")
)

const loadBlogs = ({ attrs: { mdl } }) => {
  const onError = (error) => (state.errors = error)

  const onSuccess = ({ results }) => (state.blogs = results.map(toViewModel))

  mdl.http.back4App.getTask(mdl)("Classes/Blogs").fork(onError, onSuccess)
}

const Blog = () => {
  return {
    oninit: loadBlogs,
    onremove: () => {
      state.errors = {}
      state.data = []
    },
    view: ({ attrs: { mdl } }) =>
      m(
        ".container",
        state.blogs.any()
          ? state.blogs.map((post) => m(BlogPost, { mdl, post }))
          : m(
              "article.card",
              mdl.state.isAuth()
                ? m(
                    m.route.Link,
                    {
                      href: "/social/blog-editor:",
                      class: "button primary",
                    },
                    "Add The First Post !"
                  )
                : m("h1", "Log in to add the First Post!")
            )
      ),
  }
}

export default Blog
