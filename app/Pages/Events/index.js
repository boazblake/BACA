import Calendar from "./calendar"
import Editor from "./editor"
import EventPreview from "./event"
import { propEq, prop, head, tail, clone } from "ramda"
import Loader from "Components/loader.js"
import Task from "data.task"
import { validateEventTask } from "./validations.js"

const state = {
  errors: {},
  status: Stream("loading"),
  calendar: null,
  showEditor: Stream(false),
  selectedDate: Stream(null),
  events: [],
  previewEvent: Stream(false),
  files: [],
  event: {
    attendees: [],
    image: null,
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
    location: "",
  },
}

const resetState = (s) => {
  state.event = {
    image: "",
    id: "",
    startDate: "",
    start: "",
    startTime: "00:00:00",
    end: "",
    endDate: "",
    endTime: "00:00:00",
    title: "",
    description: "",
    location: "",
    allDay: false,
  }

  state.files = []
  state.errors = {}
}
const toViewModel = (event) => {
  let start = event.start.split("T")
  let end = event.end.split("T")
  event.startDate = head(start)
  event.startTime = head(tail(start))
  event.endDate = head(end)
  event.endTime = head(tail(end))
  event.id = event.objectId
  return event
}

const fetchEvents = ({ attrs: { mdl } }) => {
  state.status("loading")
  const onError = (e) => {
    state.status("error")
    console.error(e)
  }
  const onSuccess = (events) => {
    state.events = events
    if (mdl.state.selectedPreviewEvent()) {
      state.event = head(
        events
          .filter(propEq("objectId", mdl.state.selectedPreviewEvent()))
          .map(clone)
          .map(toViewModel)
      )
      state.previewEvent(true)
    }
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

const formatDate = (date, time) => {
  // clean time
  let t = time
    .replaceAll("am", "")
    .replaceAll("pm", "")
    .replaceAll("AM", "")
    .replaceAll("PM", "")
    .trim()

  return `${date}T${t}`
}

const onImgError = (e) => {
  state.errors.img = e
  state.status("error")
}
const onImgSuccess = (img) => {
  state.event.image = img.thumb
  state.status("loaded")
}

const saveImgToGalleryTask =
  (mdl) =>
  ({ data: { image, thumb } }) =>
    mdl.http.back4App
      .postTask(mdl)("Classes/Gallery")({
        album: "events",
        image: image.url,
        thumb: thumb.url,
      })
      .chain((_) => Task.of({ image: image.url, thumb: thumb.url }))

const uploadImage = (mdl) => (file) => {
  state.status("uploading-image")

  mdl.http.imgBB
    .postTask(mdl)(file)
    .chain(saveImgToGalleryTask(mdl))
    .fork(onImgError, onImgSuccess)
}

const submitEvent = (
  mdl,
  {
    id,
    startDate,
    startTime,
    endDate,
    endTime,
    title,
    allDay,
    description,
    image,
    location,
  }
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
    image,
    location,
  }

  const onError = (errors) => {
    state.errors = errors
    console.error(errors)
  }

  const onSuccess = (evt) => {
    fetchEvents({ attrs: { mdl } })
    state.showEditor(false)
  }

  const submitOrUpdateTask = (id) => (data) =>
    id
      ? mdl.http.back4App.putTask(mdl)(`Classes/Events/${id}`)(data)
      : mdl.http.back4App.postTask(mdl)("Classes/Events")({
          ...data,
          attendees: [],
          likes: [],
        })

  return validateEventTask(event)
    .chain(submitOrUpdateTask(id))
    .fork(onError, onSuccess)
}

const Events = {
  oninit: fetchEvents,
  view: ({ attrs: { mdl } }) =>
    m(
      "article",
      state.showEditor() &&
        m(Editor, {
          mdl,
          state,
          showEditor: state.showEditor,
          submitEvent,
          deleteEvent,
          resetState,
          uploadImage: uploadImage(mdl),
        }),

      state.previewEvent() &&
        m(EventPreview, {
          mdl,
          state,
          editEvent: state.showEditor,
          previewEvent: state.previewEvent,
          event: state.event,
          resetState,
        }),

      state.status() == "loaded" &&
        m("section.container", m(Calendar, { mdl, state })),
      state.status() == "loading" && m("section", m(Loader)),
      state.status() == "error" && m("section", "is error")
    ),
}

export default Events
