import { propEq } from "ramda"

const getCellDate = (target) => {
  if (["MAIN", "BUTTON"].includes(target.tagName)) return null
  return target.tagName == "TD"
    ? target.dataset.date
    : getCellDate(target.parentNode)
}

const onEventClick = (state) => (info) => {
  info.jsEvent.preventDefault()
  let id = info.event.extendedProps.objectId
  state.selectedEvent = state.events().find(propEq("objectId", id))
  state.previewEvent(true)
  state.selectedEvent.startDate = state.selectedEvent.start.split("T")[0]
  state.selectedEvent.startTime = state.selectedEvent.start.split("T")[1]
  state.selectedEvent.endDate = state.selectedEvent.end.split("T")[0]
  state.selectedEvent.endTime = state.selectedEvent.end.split("T")[1]
  state.selectedEvent.id = id
  console.log(id, state.selectedEvent)
  if (info.event.url) {
    window.open(info.event.url)
  }
}

const initCal = (dom, state) => {
  return new FullCalendar.Calendar(dom, {
    events: state.events(),
    eventClick: onEventClick(state),
    initialView: "dayGridMonth",
    initialDate: new Date(),
    selectable: true,
    editable: true,
    droppable: true,
    headerToolbar: {
      left: "today",
      center: "title",
      right: "prev next",
      // right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    // eventDidMount: function (info) {
    // var tooltip = new Tooltip(info.el, {
    // title: info.event.extendedProps.description,
    // placement: "top",
    // trigger: "hover",
    // container: "body",
    // })
    // },
  })
}

const Calendar = {
  view: ({ attrs: { mdl, state } }) =>
    m("section#calendar", {
      oncreate: ({ dom }) => {
        state.events()
        state.calendar = initCal(dom, state)
        state.calendar.render()
      },
      onclick: (e) => {
        if (
          mdl.state.isAuth() &&
          !state.previewEvent() &&
          getCellDate(e.target)
        ) {
          state.selectedDate(getCellDate(e.target))
          state.event.startDate = state.selectedDate()
          console.log(state.selectedDate(), e)
          state.selectedDate() && state.showEditor(true)
        }
      },
    }),
}

export default Calendar
