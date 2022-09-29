import m from "mithril"
import Calendar from "./calendar"
import { propEq, prop, head, tail, clone } from "ramda"
import Loader from "@/Components/loader.js"
import { validateEventTask } from "./validations.js"
import Stream from "mithril-stream"
import { resizeImageTask } from "../../Utils/helpers"

export const state = {
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
    likes: [],
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
    isRecur: false,
    daysRecur: [], //0 = sunday, 1 = monday ...
  },
}

export const resetState = (s) => {
  state.event = {
    attendees: [],
    likes: [],
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
    isRecur: false,
    daysRecur: [], //0 = sunday, 1 = monday ...
  }

  state.files = []
  state.errors = {}
}
const toPreviewModel = (event) => {
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
          .map(toPreviewModel)
      )

      state.previewEvent(true)
    }
    state.status("loaded")
  }
  mdl.http.back4App
    .getTask(mdl)("events")
    .map(prop("results"))
    .fork(onError, onSuccess)
}

export const deleteEvent = (mdl, id) => {
  state.status("loading")
  const onError = (e) => {
    console.error(e)
  }

  const onSuccess = (evt) => {
    state.showEditor(false)
    state.previewEvent(false)
    mdl.state.selectedPreviewEvent(null)
    fetchEvents({ attrs: { mdl } })
  }

  mdl.http.back4App
    .deleteTask(mdl)(`events/${id}`)
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
  state.event.image = img.image
  state.event.thumb = img.thumb
  state.status("loaded")
}


const getImageTask = mdl => ({ objectId }) =>
  mdl.http.back4App.getTask(mdl)(`gallery/album/${objectId}`)
    .map(prop('results'))

export const uploadImage = (mdl) => (file) => {
  state.status("uploading-image")


  resizeImageTask(file).chain(img =>
    mdl.http.back4App.postTask(mdl)("gallery")({
      album: 'events',
      image: img,
    }))
    .map(prop('results'))
    .chain(getImageTask(mdl))
    .fork(onImgError, onImgSuccess)
}

export const submitEvent = (
  mdl,
  {
    id,
    attendees,
    likes,
    startDate,
    startTime,
    endDate,
    endTime,
    title,
    allDay,
    description,
    image,
    location,
    isRecur,
    daysRecur,
  }
) => {
  let start = formatDate(startDate, startTime)
  let end = formatDate(endDate, endTime)
  let event = {
    attendees,
    likes,
    start,
    end,
    title,
    allDay: JSON.parse(allDay),
    description,
    createdBy: mdl.user.name,
    image,
    location,
    isRecur,
    daysRecur: daysRecur.sort(),
  }

  const onError = (errors) => {
    state.errors = errors
    console.error(errors)
  }

  const onSuccess = (evt) => {
    console.log(evt)
    fetchEvents({ attrs: { mdl } })
    state.showEditor(false)
  }

  const submitOrUpdateTask = (id) => (data) =>
    id
      ? mdl.http.back4App.putTask(mdl)(`events/${id}`)(data)
      : mdl.http.back4App.postTask(mdl)("events")(data)

  return validateEventTask(event)
    .chain(submitOrUpdateTask(id))
    .fork(onError, onSuccess)
}

const Events = {
  oninit: fetchEvents,
  view: ({ attrs: { mdl } }) =>
    m(
      "article",
      state.status() == "loaded" &&
      m("section.container", m(Calendar, { mdl, state })),
      state.status() == "loading" && m("section", m(Loader)),
      state.status() == "error" && m("section", "is error")
    ),
}

export default Events

