import Task from "data.task"
import { listOf } from "Utils"
import Images from "../images"

const blogs = listOf(20)({
  src: Images[2],
  title: "minim veniam, quis nostrud",
  date: "11/12/2020",
  author: "Boaz Blake",
  title: "minim veniam, quis nostrud",
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
})

const state = {
  errors: {},
  blogs: [],
}

const fetchBlopgsTask = (mdl) => Task.of(blogs)

const loadBlogs = ({ attrs: { mdl } }) => {
  const onError = (error) => {
    state.errors = error
    console.log("errror", error)
  }

  const onSuccess = ({ results }) => {
    state.blogs = results
    console.log(state)
  }

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
        mdl.state.isAuth() &&
          m(
            "nav",
            m(
              "ul",
              m(
                "li",
                m(
                  m.route.Link,
                  {
                    selector: "a",
                    href: "/social/blog-editor",
                    role: "button",
                  },
                  "Add A Blog"
                )
              )
            )
          ),
        state.blogs.map(({ title, text, img, createdAt, updatedAt, author }) =>
          m(
            "article",
            m(
              ".grid",
              m(
                "hgroup",
                m("h2", title),
                m(
                  "h3",
                  createdAt,
                  updatedAt !== createdAt && "updated on: ",
                  updatedAt
                ),
                m("h4", "Written By ", author)
              ),
              m("img", {
                src: img,
                style: {
                  border: "1px solid black",
                  borderRadius: "2%",
                  width: "100%",
                },
              })
            ),
            m("hgroup", m("h4", text))
          )
        )
      ),
  }
}

export default Blog
