import Calendar from "./calendar"
import Editor from "./editor"
import Event from "./event"
import { propEq, prop, head, tail, clone } from "ramda"
import Loader from "Components/loader.js"
import Task from "data.task"
import { log } from "Utils"

const state = {
  status: Stream("loading"),
  calendar: null,
  showEditor: Stream(false),
  selectedDate: Stream(null),
  events: [],
  previewEvent: Stream(false),
  files: [],
  event: {
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
  },
}

const resetState = (state) =>
  (state.event = {
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
    allDay: false,
  })

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

const onSubmitError = (e) => {
  state.errors = e
  state.status("error")
}
const onImgSuccess = (img) => {
  console.log(img)
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
  const image = new FormData()
  image.append("image", file)
  mdl.http.imgBB
    .postTask(mdl)(image)
    .chain(saveImgToGalleryTask(mdl))
    .fork(onSubmitError, onImgSuccess)
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
  }
  console.log(startTime, endTime, start, end)

  const onError = (e) => {
    console.error(e)
  }

  const onSuccess = (evt) => {
    fetchEvents({ attrs: { mdl } })
    state.showEditor(false)
  }

  state.previewEvent(true)

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
        m(Event, {
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
