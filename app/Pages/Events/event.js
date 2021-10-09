import {
  CalendarLine,
  CheckCircleLine,
  HappyFaceLine,
  HeartLine,
  HomeSolid,
  SadFaceLine,
  TimesCircleLine,
  UserLine,
} from "@mithril-icons/clarity"
import DateTime from "Components/DateTime"
import { includes, without } from "ramda"

const updateEventTask = (mdl) => (id) => (event) =>
  mdl.http.back4App.putTask(mdl)(`Classes/Events/${id}`)(event)

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
              m(
                ".grouped clear icon",
                m(UserLine, { fill: "#14854f" }),
                m("p", "Attendees: ", event.attendees.length)
              ),
              mdl.state.isAuth() &&
                m(
                  ".tag grouped",
                  m(
                    ".button.clear icon",
                    { onclick: () => updateAttendees(mdl, event) },
                    includes(mdl.user.objectId, event.attendees)
                      ? m(
                          "",
                          m(HappyFaceLine, {
                            fill: "green",
                          }),
                          m("", "I'm Attending!")
                        )
                      : m("", m(SadFaceLine), m("", "Not Attending"))
                  ),
                  m(
                    ".button.clear icon-only",
                    { onclick: () => updateLikes(mdl, event) },
                    m(HeartLine, {
                      fill: includes(mdl.user.objectId, event.likes) && "red",
                    })
                  )
                )
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
