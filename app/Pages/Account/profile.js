import { handlers, AVATAR_URL } from "Utils/index.js"
import { path } from "ramda"

const state = { files: [], locations: [], address: "", status: "" }

const getImageSrc = (data) =>
  data.avatar && !data.avatar.includes("fake") ? data.avatar : AVATAR_URL

const onError = (x) => {
  log("on error  profile")(x)
}
const onSuccess = (x) => {
  log("onsuccess = profile")(x)
}

const updateProfileTask = (mdl) => (data) =>
  mdl.http.back4App.putTask(mdl)(
    `Classes/Accounts/${mdl.data.profile.objectId}`
  )(data)

const removeImage = (mdl, data) => {
  data.avatar = null
  updateProfileTask(mdl)(data).fork(log("e"), log("s"))
}

const updateProfileMeta =
  (mdl) =>
  ({ name, email, address }) =>
    updateProfileTask(mdl)({ name, email, address }).fork(onError, onSuccess)

const uploadImage = (mdl) => (file) => {
  mdl.http.imgBB
    .postTask(mdl)(file[0])
    .map(path(["data", "thumb", "url"]))
    .map((avatar) => {
      state.avatar = avatar
      return { avatar }
    })
    .chain(updateProfileTask(mdl))
    .map(() => (mdl.data.profile.avatar = state.avatar))
    .fork(onError, onSuccess)
}

const onInput = (profile) =>
  handlers(["oninput"], (e) => {
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
      log("mdl")(mdl)
      return m(
        "section.p-y-50",
        m(
          "article.row",
          { ...onInput(data) },
          m(
            "figure.col",
            m("img.avatar", {
              src: getImageSrc(data),
            }),
            m(
              "figcaption",
              { style: { width: "180px" } },
              data.avatar
                ? m(
                    "button.button",
                    { onclick: (e) => removeImage(mdl, data) },
                    "Remove Profile Pic"
                  )
                : m(
                    "label.button",
                    { label: "profile-pic" },
                    "Add profile picture",
                    m("input", {
                      style: { display: "none" },
                      type: "file",
                      id: "avatar",
                      value: state.files,
                      onchange: (e) => uploadImage(mdl)(e.target.files),
                    })
                  )
            )
          ),
          m(
            "form.col",
            !data.emailVerified && m("label.warning", "email not verified"),
            m("label", "name", m("input", { id: "name", value: data.name })),
            m("label", "email", m("input", { id: "email", value: data.email })),
            m(
              "label.icon",
              "Address",
              m("input", {
                oninput: (e) => {
                  if (e.target.value.length > 3) {
                    state.status = "isloading"
                    mdl.http.openCage
                      .getLocationTask(mdl)(e.target.value.trim())
                      .fork(
                        (e) => {
                          state.status = "error"
                          log("error fetching locations")(e)
                        },
                        ({ results }) => {
                          state.status = "loaded"
                          state.locations = results
                        }
                      )
                  }
                },
                id: "address",
                value: data.address,
              })
            ),
            state.locations.any() &&
              m(
                "details.dropdown",
                m("summary.button.outline", "options"),
                m(
                  ".card",
                  m(
                    "ul",

                    state.locations.map(({ formatted }) =>
                      m(
                        "li.pointer",
                        {
                          onclick: (e) => {
                            data.address = formatted
                            state.locations = []
                          },
                        },
                        formatted
                      )
                    )
                  )
                )
              )
          )
        ),
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
    },
  }
}

export default Profile
