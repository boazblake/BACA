import {
  loadResidentsTask,
  loadMapConfig,
  findLatLongTask,
  getCenterView,
  setCenterView,
  defaultPushPin,
} from "./model.js"

const addResident = (mdl, state) => {
  const onError = (e) => {
    let msg = "error finding resident"
    console.log(msg, e)
  }
  const onSuccess = (pin) => {
    state.entities.push(pin)
    state.map.entities.push(pin)
    setCenterView(state)(
      getCenterView(state.entities.map((e) => e.getLocation()))
    )
  }

  findLatLongTask(mdl, state.input).fork(onError, onSuccess)
}

const BonhamAcresMap = ({ attrs: { mdl } }) => {
  const onError = (err) => log("err")(err)
  const onSuccess = (data) => {}

  const state = {
    dom: null,
    entities: defaultPushPin(mdl),
    input: null,
    map: null,
    opts: {
      credentials:
        "AhqSb9RscePM37EHU7fTFalyXaXPiKCbkxRjYld0ZKrUsOUHzwNCMngoGVgqrht_",
      mapTypeId: Microsoft.Maps.MapTypeId.road,
      zoom: 16,
      // center: Microsoft.Maps.Location(
      //   Microsoft.Maps.Location.parseLatLong(mdl.Map.bh).latitude,
      //   Microsoft.Maps.Location.parseLatLong(mdl.Map.bh).longitude
      // ),
    },
  }

  loadResidentsTask(mdl, state).map(loadMapConfig(mdl)).fork(onError, onSuccess)
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "section",

        ["mod", "admin"].includes(mdl.user.role) &&
          m(
            "section.grouped",
            m("input", {
              type: "text",
              oninput: (e) => (state.input = e.target.value),
            }),
            m(
              "button",
              { onclick: () => addResident(mdl, state) },
              "Add Resident"
            )
          ),

        m("section#map", {
          oncreate: ({ dom }) => (state.dom = dom),
          style: {
            position: "relative",
            width: "500px",
            height: "500px",
            margin: "0 auto",
          },
        })
      ),
  }
}

export default BonhamAcresMap

