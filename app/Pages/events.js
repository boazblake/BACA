const initCal = (dom) =>
  new FullCalendar.Calendar(dom, {
    initialView: "dayGridMonth",
    initialDate: new Date(),
    selectable: true,
    editable: true,
    droppable: true,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
  })

const state = {
  calendar: null,
}

const Events = {
  oncreate: ({ dom }) => {
    state.calendar = initCal(dom).render()
  },
  onupdate: ({ dom }) => state.calendar.render(),
  view: ({ attrs: { mdl } }) =>
    m("#calendar", {
      onclick: (e) => console.log("e", e, e.target["data-date"]),
    }),
}

export default Events
