import {
  CalendarLine,
  CheckCircleLine,
  HeartLine,
  HomeSolid,
  TimesCircleLine,
} from "@mithril-icons/clarity"
import DateTime from "Components/DateTime"
import { includes, without } from "ramda"

const updateEventTask = (mdl) => (id) => (event) =>
  mdl.http.back4App.putTask(mdl)(`Classes/Events/${id}`)(event)

const onError = (e) => console.log("e", e)

const onSuccess = (s) => console.log("s", s)

const updateAttendees = (mdl, event) => {
  event.attendees = event.attendees.includes(mdl.user.objectId)
    ? without([mdl.user.objectId], event.attendees)
    : event.attendees.concat([mdl.user.objectId])
  console.log("attendees", event.attendees)
  updateEventTask(mdl)(event.id)({ attendees: event.attendees }).fork(
    onError,
    onSuccess
  )
}
const updateLikes = (mdl, event) => {
  event.likes = event.likes.includes(mdl.user.objectId)
    ? without([mdl.user.objectId], event.likes)
    : event.likes.concat([mdl.user.objectId])
  console.log("likes", event.likes)
  updateEventTask(mdl)(event.id)({ likes: event.likes }).fork(
    onError,
    onSuccess
  )
}

const Event = {
  view: ({
    attrs: { mdl, event, previewEvent, editEvent, resetState, state },
  }) =>
    m(
      ".modal-container",
      m(
        ".modal",
        m(
          "header.modal-header",
          m("h2.text-primary", event.title.toUpperCase()),

          m(
            ".row",
            m(
              ".col",
              m(
                ".grouped",
                m(CalendarLine, { fill: "#14854f" }),
                m(DateTime, { event })
              ),
              event.location &&
                m(
                  ".grouped",
                  m(HomeSolid, { fill: "#14854f", height: 60, width: 60 }),
                  m("p", event.location)
                ),
              event.allDay &&
                m(".grouped", m("label.tag.primary", "All Day Event"))
            ),
            m(
              ".col",

              mdl.state.isAuth() &&
                m(
                  ".grouped",
                  m(
                    ".button.clear icon",
                    { onclick: () => updateAttendees(mdl, event) },
                    includes(mdl.user.objectId, event.attendees)
                      ? [
                          m(CheckCircleLine, {
                            fill: "green",
                          }),
                          "I'm Attending!",
                        ]
                      : [m(TimesCircleLine), "Not Attending"]
                  ),
                  m(
                    ".button.clear icon-only",
                    { onclick: () => updateLikes(mdl, event) },
                    m(HeartLine, {
                      fill: includes(mdl.user.objectId, event.likes) && "red",
                    })
                  )
                ),
              m(".tag", event.attendees.length)
            )
          ),

          m(".grouped", m("img", { src: event.image }))
        ),

        m(
          "section.modal-content container card",

          m(".grouped", m("label", event.description))
        ),
        m(
          "footer.modal-footer",

          m(
            ".tabs grouped",
            (event.createdBy == mdl.user.name ||
              ["admin", "mod"].includes(mdl.user.role)) &&
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
                  mdl.state.selectedPreviewEvent(null)
                  previewEvent(false)
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
