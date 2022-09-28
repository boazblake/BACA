import m from "mithril"
import { prop, filter } from "ramda"
import { Table, formatDataForTable } from "@/Components/table.js"
// import { &#128221;, RemoveLine } from "@mithril-icons/clarity/cjs"
import Task from "data.task"
import { formatDate, getUserByUserId, editIcon } from "@/Utils"
let tabs = ["blogs", "events", "images", "users", "dues"]
import { addSuccess, addDanger } from "@/Components/toast"

const state = {
  tab: "blogs",
}

const updateUserRole = (mdl) => (userId) => (role) => (name) =>
  mdl.http.back4App
    .putTask(mdl)(`auth/users/${userId}`)({ role })
    .fork(
      () => addDanger(`Was unable to update ${name}'s role`),
      () => {
        addSuccess(`${name}'s role was updated`)
        getData({ attrs: { mdl } })
      }
    )

const userViewmodel = (
  { objectId, email, emailVerified, name, role, username },
  mdl
) => ({
  name,
  username,
  email,
  emailVerified,
  role: [
    m(
      "select",
      {
        value: role,
        onchange: (e) => updateUserRole(mdl)(objectId)(e.target.value)(name),
      },
      m("option", { value: "admin" }, "admin"),
      m("option", { value: "mod" }, "mod"),
      m("option", { value: "user" }, "user")
    ),
  ],
  action: [
    m('button', { onclick: () => console.log("edit", objectId) }, editIcon),
    m('button', { onclick: () => () => console.log(objectId, "delete") }, deleteIcon),
  ],
})

const eventsViewmodel = ({ objectId, title, image, startDate, startTime }) => ({
  title,
  image: m("img", { src: image }),
  startDate,
  startTime,
  action: [
    m('button', { onclick: () => console.log("edit", objectId) }, editIcon),
    m('button', { onclick: () => () => console.log(objectId, "delete") }, deleteIcon),
  ],
})

const blogsViewmodel = ({ objectId, title, img, text, author }) => ({
  title,
  img: m("img", { style: { maxWidth: "150px" }, src: img }),
  text: text.slice(0, 300),
  author,
  action: [
    m('button', { onclick: () => console.log("edit", objectId) }, editIcon),
    m('button', { onclick: () => () => console.log(objectId, "delete") }, deleteIcon),
  ],
})

const imagesViewmodel = ({ objectId, album, image }) => ({
  album,
  image: m("img", { style: { maxWidth: "150px" }, src: image }),
  action: [
    m('button', { onclick: () => console.log("edit", objectId) }, editIcon),
    m('button', { onclick: () => () => console.log(objectId, "delete") }, deleteIcon),
  ],
})

const duesViewModel = (
  { date, createdAt, status, full_name, email, address, userId },
  mdl
) => {
  return date
    ? {
      date: formatDate(date),
      status,
      name: full_name,
      email,
      address,
    }
    : {
      date: formatDate(createdAt),
      status: "ERROR - contact administrator",
      name: getUserByUserId(userId, mdl).name,
      email: getUserByUserId(userId, mdl).email,
      address: JSON.stringify(address),
    }
}

const displayType = {
  users: userViewmodel,
  events: eventsViewmodel,
  blogs: blogsViewmodel,
  images: imagesViewmodel,
  dues: duesViewModel,
}

const handleType = (tab) => (mdl) => (data) => displayType[tab](data, mdl)

const toViewmodel = (state, mdl) => {
  let data = mdl.data[state.tab].map(handleType(state.tab)(mdl))
  return formatDataForTable(["username"], data)
}

const getUsersTask = (mdl) =>
  mdl.http.back4App
    .getTask(mdl)("auth/users")
    .map(prop("results"))
    .map(filter(prop("name")))

const getDuesTask = (mdl) =>
  mdl.http.back4App.getTask(mdl)("dues").map(prop("results"))

const getData = ({ attrs: { mdl } }) => {
  Task.of((users) => (dues) => ({
    users,
    dues,
  }))
    .ap(getUsersTask(mdl))
    .ap(getDuesTask(mdl))
    .fork(log("error"), ({ users, dues }) => {
      mdl.data.users = users
      mdl.data.dues = dues
    })
}

const Admin = () => {
  return {
    oninit: getData,
    view: ({ attrs: { mdl } }) =>
      m(
        "section",
        m(
          "nav.nav.tabs",
          tabs.map((tab) =>
            m(
              "a.tab.pointer",
              {
                class: state.tab == tab ? "active" : "",
                onclick: () => (state.tab = tab),
              },
              tab.toUpperCase()
            )
          )
        ),

        m("section.container", m(Table, { mdl, data: toViewmodel(state, mdl) }))
      ),
  }
}

export default Admin

