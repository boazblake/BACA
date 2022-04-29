import { handlers, AVATAR_URL } from "Utils/index.js"
import { path } from "ramda"
import { addSuccess } from "Components/toast"

const state = { files: [], locations: [], address: "", status: "" }

const getImageSrc = (data) =>
  data.avatar && !data.avatar.includes("fake") ? data.avatar : AVATAR_URL

const onError = (x) => {
  log("on error  profile")(x)
}
const onSuccess = (_) => addSuccess("Image uploaded successfully")

const updateProfileTask = (mdl) => (data) =>
  mdl.http.back4App.putTask(mdl)(
    `Classes/Accounts/${mdl.data.profile.objectId}`
  )(data)

const removeImage = (mdl, data) => {
  data.avatar = null
  updateProfileTask(mdl)(data).fork(log("e"), () =>
    addSuccess("Image deleted", 5000)
  )
}

const updateProfileMeta =
  (mdl) =>
  ({ name, address, telephone }) =>
    updateProfileTask(mdl)({ name, address, telephone }).fork(
      onError,
      onSuccess
    )

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

const Profile = ({ attrs: { mdl } }) => {
  log("mdl - profile page")(mdl)
  return {
    view: ({ attrs: { mdl } }) => {
      return m(
        "section.p-y-50",
        m(
          "article.row",
          { ...onInput(mdl.data.profile) },
          m(
            "figure.col",
            m("img.avatar", {
              src: getImageSrc(mdl.data.profile),
            }),
            m(
              "figcaption",
              { style: { width: "180px" } },
              mdl.data.profile.avatar
                ? m(
                    "button.button",
                    {
                      style: {
                        borderColor: "var(--color-error)",
                        color: "var(--color-error)",
                      },
                      onclick: (e) => removeImage(mdl, mdl.data.profile),
                    },
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
            !mdl.data.profile.emailVerified &&
              m("label.warning", "email not verified"),
            m(
              "label",
              "name",
              m("input", { id: "name", value: mdl.data.profile.name })
            ),
            m(
              "label",
              "telephone",
              m("input", { id: "telephone", value: mdl.data.profile.telephone })
            ),
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
                value: mdl.data.profile.address,
              })
            ),
            state.locations.any() &&
              m(
                "details.dropdown",
                m("summary.button.outline", "Address Suggestions"),
                m(
                  ".card",
                  m(
                    "ul",

                    state.locations.map(({ formatted }) =>
                      m(
                        "li.pointer",
                        {
                          onclick: (e) => {
                            mdl.data.profile.address = formatted
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
              { onclick: () => updateProfileMeta(mdl)(mdl.data.profile) },
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

