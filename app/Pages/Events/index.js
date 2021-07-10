import Calendar from "./calendar"
import Editor from "./editor"
import Event from "./event"
import { prop } from "ramda"

const state = {
  status: Stream("loading"),
  calendar: null,
  showEditor: Stream(false),
  selectedDate: Stream(null),
  events: [],
  previewEvent: Stream(false),
  event: {
    id: "",
    startDate: "",
    start: "",
    startTime: "00:00:00",
    end: "",
    endDate: "",
    endTime: "00:00:00",
    title: "",
    description: "",
    allDay: false,
  },
}

const resetState = (state) =>
  (state.event = {
    id: "",
    startDate: "",
    start: "",
    startTime: "00:00:00",
    end: "",
    endDate: "",
    endTime: "00:00:00",
    title: "",
    description: "",
    allDay: false,
  })

const fetchEvents = ({ attrs: { mdl } }) => {
  state.status("loading")
  const onError = (e) => {
    state.status("error")
    console.error(e)
  }
  const onSuccess = (events) => {
    state.events = events
    state.status("loaded")
  }
  mdl.http.back4App
    .getTask(mdl)("Classes/Events")
    .map(prop("results"))
    .fork(onError, onSuccess)
}

const deleteEvent = (mdl, id) => {
  state.status("loading")
  const onError = (e) => {
    console.error(e)
  }

  const onSuccess = (evt) => {
    fetchEvents({ attrs: { mdl } })
    state.showEditor(false)
  }

  mdl.http.back4App
    .deleteTask(mdl)(`Classes/Events/${id}`)
    .fork(onError, onSuccess)
}

const formatDate = (date, time) => `${date}T${time}`

const submitEvent = (
  mdl,
  { id, startDate, startTime, endDate, endTime, title, allDay, description }
) => {
  let start = formatDate(startDate, startTime)
  let end = formatDate(endDate, endTime)
  let event = {
    start,
    end,
    title,
    allDay: JSON.parse(allDay),
    description,
    createdBy: mdl.user.name,
  }

  const onError = (e) => {
    console.error(e)
  }

  const onSuccess = (evt) => {
    fetchEvents({ attrs: { mdl } })
    state.showEditor(false)
  }

  const submitOrUpdate = (id) =>
    id
      ? mdl.http.back4App.putTask(mdl)(`Classes/Events/${id}`)(event)
      : mdl.http.back4App.postTask(mdl)("Classes/Events")(event)
  submitOrUpdate(id).fork(onError, onSuccess)
}

const Events = {
  oninit: fetchEvents,
  view: ({ attrs: { mdl } }) =>
    m(
      "article",

      m(
        "aside",
        // m(
        //   "button.is-primary",
        //   {
        //     onclick: (e) => {},
        //   },
        //   "Add Event"
        // ),
        state.showEditor() &&
          m(Editor, {
            mdl,
            state,
            showEditor: state.showEditor,
            submitEvent,
            deleteEvent,
            resetState,
          }),

        state.previewEvent() &&
          m(Event, {
            mdl,
            state,
            editEvent: state.showEditor,
            previewEvent: state.previewEvent,
            event: state.event,
            resetState,
          })
      ),

      state.status() == "loaded" && m("section", m(Calendar, { mdl, state })),
      state.status() == "loading" && m("section", "is loading"),
      state.status() == "error" && m("section", "is error")
    ),
}

export default Events
