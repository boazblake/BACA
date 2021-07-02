let calendar = (dom) =>
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

const Events = {
  oncreate: ({ dom }) => calendar(dom).render(),
  onupdate: ({ dom }) => calendar(dom).render(),
  view: ({ attrs: { mdl } }) =>
    m("#calendar", {
      onclick: (e) => console.log("e", e, e.target["data-date"]),
    }),
}

export default Events
