let calendar

const Events = {
  oncreate: ({ dom }) => {
    calendar = new FullCalendar.Calendar(dom, {
      initialView: "dayGridMonth",
      initialDate: new Date(),
      selectable: true,
      editable: true,
      // plugins: [interactionPlugin],
      droppable: true,
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
    })
    console.log("calendar")
    calendar.render()
  },
  onupdate: () => calendar.render(),
  view: ({ attrs: { mdl } }) =>
    m("#calendar", { onclick: (e) => console.log("e", e) }),
}

export default Events
