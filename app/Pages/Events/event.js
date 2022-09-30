import m from "mithril"
import DateTime from "@/Components/DateTime"
import { DAYSOFWEEK, isAdminOrMod, calendarIcon, homeIcon, personIcon, happyFaceIcon, sadFaceIcon, heartIcon } from "@/Utils"
import { includes, without } from "ramda"

const updateEventTask = (mdl) => (id) => (event) =>
  mdl.http.back4App.putTask(mdl)(`events/${id}`)(event)

const onError = (e) => console.log("e", e)

const onSuccess = (event, field, value) => () => (event[field] = value)

const updateEvent = (xs) => (x) =>
  xs.includes(x) ? without([x], xs) : xs.concat([x])

const updateAttendees = (mdl, event) => {
  let attendees = updateEvent(event.attendees)(mdl.user.objectId)
  updateEventTask(mdl)(event.id)({ attendees }).fork(
    onError,
    onSuccess(event, "attendees", attendees)
  )
}
const updateLikes = (mdl, event) => {
  let likes = updateEvent(event.likes)(mdl.user.objectId)
  updateEventTask(mdl)(event.id)({ likes }).fork(
    onError,
    onSuccess(event, "likes", likes)
  )
}

const Event = {
  view: ({
    attrs: { mdl, event, previewEvent, editEvent, resetState, state },
  }) =>
    m(
      "section.modal-container",
      m(
        "article.modal",
        m(
          "header.modal-header",
          m("h2.text-primary strong is-center", event.title.toUpperCase())
        ),

        m(
          "section.modal-content ",

          m(
            ".row",
            m(
              ".col",
              m(
                ".grouped",
                m('span', calendarIcon),
                m(DateTime, { event })
              ),

              event.isRecur &&
              m(
                ".grouped",
                "This event reoccurs on the following days: ",
                event.daysRecur.map((idx) => DAYSOFWEEK[idx]).join(", ")
              ),

              event.location &&
              m(
                "h4.grouped",

                m('span', { color: "#14854f", height: 35, width: 35 }, homeIcon),
                m("label", event.location)
              ),
              event.allDay &&
              m(".grouped", m("label.tag.primary", "All Day Event"))
            ),
            m(
              ".col",
              m(
                ".grouped clear icon",
                m('span', { color: "#14854f", height: 35, width: 35 }, personIcon),
                m("label", "Attendees: ", event.attendees.length)
              ),
              mdl.state.isAuth() &&
              m(
                ".grouped",
                m(
                  ".button.clear icon",
                  { onclick: () => updateAttendees(mdl, event) },
                  includes(mdl.user.objectId, event.attendees)
                    ? m(
                      "",
                      m('span', { color: "#14854f", height: 35, width: 35 }, happyFaceIcon),
                      m("", "I'm Attending!")
                    )
                    : m("", m('span', { color: "#14854f", height: 35, width: 35 }, sadFaceIcon), m("", "Not Attending"))
                ),
                m(
                  ".button.clear icon-only.tag",
                  { onclick: () => updateLikes(mdl, event) },
                  m('span', {
                    color: includes(mdl.user.objectId, event.likes) && "red",
                  },
                    m('span', { color: "#14854f", height: 35, width: 35 },
                      heartIcon)
                  )
                )
              )
            )
          ),
          m(".grouped", m("img", { src: event.image })),
          m("hr.bd-primary"),
          m(".grouped.container", m("p.p-t-25", { style: { 'overflow-wrap': 'anywhere' } }, event.description))
        ),
        m(
          "footer.modal-footer",

          m(
            ".tabs grouped",
            (event.createdBy == mdl.user.name || isAdminOrMod(mdl)) &&
            m(
              "button.button.secondary.is-full-width",
              {
                onclick: (e) => {
                  editEvent(true)
                  previewEvent(false)
                  e.preventDefault()
                },
                role: "button",
                disabled: false,
              },
              "Edit"
            ),
            m(
              "button.button.primary.is-full-width",
              {
                onclick: () => {
                  resetState(state)
                  previewEvent(false)
                  mdl.state.selectedPreviewEvent(null)
                  m.route.set(mdl.state.locationPreEvent())
                },
              },
              "Close"
            )
          )
        )
      )
    ),
}

export default Event

