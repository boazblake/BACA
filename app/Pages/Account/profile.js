import Task from "data.task"
import { exists, handlers } from "Utils"
import { path } from "ramda"

const AVATAR_URL = "https://i.ibb.co/6W0zsZH/avatar.webp"

const state = { files: [] }

const onError = (e) => console.log("error", e)
const onSuccess = (s) => console.log("success", s)

const updateProfile = (mdl) => (data) =>
  mdl.http.back4App.putTask(mdl)(
    `Classes/Accounts/${mdl.data.profile.objectId}`
  )(data)

const updateProfileMeta =
  (mdl) =>
  ({ name, email, street, city, state, zip }) =>
    updateProfile(mdl)({
      name,
      email,
      address: { street, city, state, zip },
    }).fork(onError, onSuccess)

const uploadImage = (mdl) => (file) => {
  const image = new FormData()
  image.append("image", file)
  mdl.http.imgBB
    .postTask(mdl)(image)
    .map(path(["data", "thumb", "url"]))
    .map((avatar) => {
      state.avatar = avatar
      return { avatar }
    })
    .chain(updateProfile(mdl))
    .map(() => (mdl.data.profile.avatar = state.avatar))
    .fork(onError, onSuccess)
}

const onInput = (profile) =>
  handlers(["oninput"], (e) => {
    console.log(e.target.type)
    if (e.target.type == "checkbox") {
      return (profile[e.target.id] = JSON.parse(e.target.checked))
    }
    if (e.target.id == "file") {
      return (profile[e.target.id] = e.target.files[0])
    } else {
      return (profile[e.target.id] = e.target.value)
    }
  })

const Profile = () => {
  return {
    view: ({ attrs: { mdl, data } }) => {
      // console.log(data)
      return m(
        "section.p-y-50",
        m(
          "article.row",
          { ...onInput(data) },
          m(
            "figure.col",
            m("img.avatar", { src: data.avatar ? data.avatar : AVATAR_URL }),
            m(
              "figcaption",
              { style: { width: "180px" } },
              m(
                "label.button",
                { label: "profile-pic" },
                "update profile picture",
                m("input", {
                  style: { display: "none" },
                  type: "file",
                  id: "profile-pic",
                  value: state.files,
                  onchange: (e) => uploadImage(mdl)(e.target.files),
                })
              ),
              ""
            )
          ),
          m(
            "form.col",
            !data.emailVerified && m("label.warning", "email not verified"),
            m("label", "name", m("input", { id: "name", value: data.name })),
            m("label", "email", m("input", { id: "email", value: data.email })),
            m(
              "label",
              "street",
              m("input", { id: "street", value: data.street })
            ),
            m("label", "city", m("input", { id: "city", value: data.city })),
            m("label", "state", m("input", { id: "state", value: data.state })),
            m("label", "zip", m("input", { id: "zip", value: data.zip })),
            m(
              ".nav",
              m(
                ".nav-left",
                m(
                  "button.button.primary",
                  { onclick: () => updateProfileMeta(mdl)(data) },
                  "Update"
                )
              )
              // m(".nav-right", m("button.button.error", "Delete Account"))
            )
          )
        )
      )
    },
  }
}

export default Profile
