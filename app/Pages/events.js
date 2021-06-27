let calendar

const Events = {
  oncreate: ({ dom }) => {
    calendar = new FullCalendar.Calendar(dom, {
      initialView: "dayGridMonth",
      initialDate: new Date(),
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
  view: ({ attrs: { mdl } }) => m("#calendar"),
}

export default Events
