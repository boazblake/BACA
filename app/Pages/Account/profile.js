import m from "mithril"
import { handlers, AVATAR_URL } from "@/Utils/index.js"
import { compose, filter, path, prop, pluck, assoc, propEq } from "ramda"
import { addSuccess } from "@/Components/toast"
import Map from "./map.js"
import Stream from "mithril-stream"

const state = {
  addresses: [],
  files: [],
  locations: Stream([]),
  status: "loading",
  disableEdit: true,
}

const fetchLocationsTask = (mdl) => {
  return mdl.http.back4App
    .getTask(mdl)("geo/addresses?limit=1000")
    .map(prop("results"))
}

const toLocationVM = (addressIds) => (locations) =>
  locations.map((location) =>
    assoc("selected", addressIds.includes(location.objectId), location)
  )

const fetchLocations = (mdl) => (state) => {
  const onError = log("error fetching locations")
  const onSuccess = (locations) => {
    state.locations(locations)
    state.status = 'loaded'
  }
  fetchLocationsTask(mdl)
    .map(toLocationVM(mdl.account.addressIds))
    .fork(onError, onSuccess)
}

const getImageSrc = (data) =>
  data.avatar && !data.avatar.includes("fake") ? data.avatar : AVATAR_URL

const onError = (x) => {
  log("on error  profile")(x)
}
const onSuccess = (mdl) => {
  fetchLocations(mdl)(state)
  addSuccess({ text: "Profile updated successfully", timeout: 5000 })
}

const updateProfileTask = (mdl) => (data) =>
  mdl.http.back4App.putTask(mdl)(
    `accounts/${mdl.account.objectId}`
  )(data)

const removeImage = (mdl, data) => {
  data.avatar = null
  updateProfileTask(mdl)(data).fork(log("e"), () =>
    addSuccess({ text: "Image deleted", timeout: 5000 })
  )
}


const updateProfileMeta =
  (mdl) =>
    ({ name, addressIds, telephone }) =>
      updateProfileTask(mdl)({ name, addressIds, telephone }).fork(log('error with updating profile'),
        () => onSuccess(mdl))

const uploadImage = (mdl) => (file) => {
  mdl.http.imgBB
    .postTask(mdl)(file[0])
    .map(path(["data", "thumb", "url"]))
    .map((avatar) => {
      state.avatar = avatar
      return { avatar }
    })
    .chain(updateProfileTask(mdl))
    .map(() => (mdl.account.avatar = state.avatar))
    .fork(onError, () => addSuccess({ text: "Image Updated", timeout: 5000 }))
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

const resetState = (mdl, state) => {
  state.disableEdit = !state.disableEdit
  fetchLocations(mdl)(state)
}

const toggleEditProfile = (mdl, state) => {
  state.disableEdit = !state.disableEdit
  fetchLocations(mdl)(state)
  if (state.disableEdit) {
    mdl.account.addressIds = compose(pluck('objectId'), filter(propEq('selected', true)))(state.locations())
    updateProfileMeta(mdl)(mdl.account)
  }
}

const Profile = ({ attrs: { mdl } }) => {
  fetchLocations(mdl)(state)
  return {
    view: ({ attrs: { mdl } }) => {
      return m(
        "#PROFILE.section.p-y-50",
        // state.status == 'loading' && m(Loader,),
        state.status == 'error' && m('', 'error'),

        state.status == 'loaded' && m(
          "article.row",
          { ...onInput(mdl.account) },
          m(
            "figure.col",
            m("img.avatar", {
              src: getImageSrc(mdl.account),
            }),
            m(
              "figcaption",
              { style: { width: "180px" } },
              mdl.account.avatar
                ? m(
                  "button.button",
                  {
                    style: {
                      borderColor: "var(--color-error)",
                      color: "var(--color-error)",
                    },
                    onclick: (e) => removeImage(mdl, mdl.account),
                  },
                  "Remove Image"
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

          state.locations().filter(propEq("selected", true)).length > 0
            ? m(
              "section.col",
              m(
                "h4",
                "If the coordinates of the icon are not on top of your home please contact an administrator at BonhamAcresCivicAssociation at gmail dot com."
              ),
              m(Map, {
                mdl,
                locations: state.locations().filter(propEq("selected", true)
                ),
              })
            )
            : m("p.hero", "Edit your profile to select your address(s)"),

          m(
            "section.col",
            state.disableEdit
              ? m(
                "button.button",
                {
                  style: {
                    borderColor: "var(--blue)",
                    color: "var(--blue)",
                  },
                  onclick: (e) => toggleEditProfile(mdl, state),
                },
                "Edit Profile Info"
              )
              : m(
                ".grouped",
                m(
                  "button.button",
                  {
                    style: {
                      borderColor: "var(--red)",
                      color: "var(--red)",
                    },
                    onclick: () => resetState(mdl, state),
                  },
                  "Cancel Edit"
                ),
                m(
                  "button.button",
                  {
                    style: {
                      borderColor: "var(--green)",
                      color: "var(--green)",
                    },
                    onclick: (e) => toggleEditProfile(mdl, state),
                  },
                  "Finish Edit and Save"
                )
              ),
            m(
              "form",
              !mdl.user.emailVerified &&
              m("p.warning", "email not verified"),
              m(
                "label",
                "email",
                m("input", {
                  disabled: true,
                  id: "email",
                  value: mdl.account.email,
                })
              ),
              m(
                "label",
                "name",
                m("input", {
                  disabled: state.disableEdit,
                  id: "name",
                  value: mdl.account.name,
                })
              ),
              m(
                "label",
                "telephone",
                m("input", {
                  disabled: state.disableEdit,
                  id: "telephone",
                  value: mdl.account.telephone,
                })
              ),
              state.locations().any() && m(
                "label.icon",
                "Address",
                state.disableEdit
                  ? mdl.account.addressIds.map((address) =>
                    m("input", {
                      disabled: true,
                      id: "address",
                      value: state.locations().find(propEq('objectId', address)).property,
                    })
                  )
                  : [

                    m(
                      "select.pointer",
                      {
                        multiple: true,
                        value: mdl.account.addressId,
                        onchange: ({ target: { value } }) =>
                          state.locations().find(propEq('objectId', value)).selected = true
                        ,
                      },
                      state.locations().filter(propEq('selected', false)).map((l) =>
                        m(
                          "option.pointer",
                          {
                            class: mdl.account.addressIds.includes(
                              l.objectId
                            )
                              ? "option text-primary"
                              : "option",
                            value: l.objectId,
                          },
                          l.property
                        ))
                    )
                    ,
                    m(
                      "ul",
                      state.locations()
                        .filter(propEq("selected", true))
                        .map((l) =>
                          m(
                            "li.grouped",
                            m("p", l.property),
                            m(
                              ".text-primary.underline", {
                              onclick: () => {
                                let locs = state.locations
                                  ().map(loc => {
                                    if (loc.objectId == l.objectId) {
                                      loc.selected = false
                                    }
                                    return loc
                                  })
                                state.locations(locs)

                              }
                            },
                              "remove"
                            )
                          )
                        )
                    ),
                  ]
              )
            )
          ),

        ),
      )
    },
  }
}

export default Profile

