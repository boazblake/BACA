import { m } from "mithril"
import {
  loadResidentsTask,
  loadMapConfig,
  findLocationTask,
  getCenterView,
  setCenterView,
  saveResidentTask,
  defaultPushPinEntities,
  toPushPin,
} from "./model.js"

const load = (mdl, state) =>
  loadResidentsTask(mdl, state).map(loadMapConfig(mdl))

const findResident = (mdl, state) => {
  const onError = (e) => {
    let msg = "error finding resident"
    console.log(msg, e)
  }

  const onSuccess = (results) => {
    console.log(results)
    state.findLocationResults = results
  }

  findLocationTask(mdl, state.input).fork(onError, onSuccess)
}

const restartFindResident = (mdl, state) => {
  load(mdl, state).fork(log("e"), () => {
    state.newLocation = null
    state.findLocationResults = []
    state.input = null
    log("restardone")(state)
  })
}

const saveResident = (mdl, state) => {
  const onError = (e) => log("e")(e)
  const onSuccess = (data) => log("suc")(data)

  saveResidentTask(mdl, state.newLocation)
    .chain(() => load(mdl, state))
    .fork(onError, onSuccess)
}

const selectLocation = (mdl, state, { formatted, geometry: { lat, lng } }) => {
  state.newLocation = { property: formatted, lat, lng }
  let pin = toPushPin(state.newLocation, { color: "green", draggable: true })
  state.findLocationResults = []
  state.entities.push(pin)
  state.map.entities.push(pin)
  setCenterView(state)(
    getCenterView(state.entities.map((e) => e.getLocation()))
  )
  // Microsoft.Maps.Events.addHandler(pin, "drag", () => log("pushpinDrag")(pin))
  Microsoft.Maps.Events.addHandler(pin, "dragend", () => {
    log("pushpinDragEnd")(pin)
    state.newLocation.lng = pin.geometry.x
    state.newLocation.lat = pin.geometry.y
  })
  // Microsoft.Maps.Events.addHandler(pin, "dragstart", () =>
  //   log("pushpinDragStart")(pin)
  // )
}

const BonhamAcresMap = ({ attrs: { mdl } }) => {
  const state = {
    findLocationResults: [],
    newLocation: null,
    dom: null,
    entities: defaultPushPinEntities(mdl),
    input: null,
    map: null,
    opts: {
      mapTypeId: Microsoft.Maps.MapTypeId.road,
      zoom: 16,
      // center: Microsoft.Maps.Location(
      //   Microsoft.Maps.Location.parseLatLong(mdl.Map.bh).latitude,
      //   Microsoft.Maps.Location.parseLatLong(mdl.Map.bh).longitude
      // ),
    },
  }

  const onError = (err) => log("err")(err)
  const onSuccess = (location) => {}

  load(mdl, state).fork(onError, onSuccess)
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "section",

        ["mod", "admin"].includes(mdl.user.role) &&
          m(
            "section",
            m(
              ".grouped",
              m("input", {
                type: "text",
                value: state.input,
                oninput: (e) => (state.input = e.target.value),
              }),
              state.newLocation
                ? [
                    m(
                      "button.grouped",
                      { onclick: () => restartFindResident(mdl, state) },
                      "Restart",
                      m("icon", "icon")
                    ),
                    m(
                      "button",
                      { onclick: () => saveResident(mdl, state) },
                      "Add Resident"
                    ),
                  ]
                : m(
                    "button",
                    { onclick: () => findResident(mdl, state) },
                    "Find Resident"
                  )
            ),

            state.findLocationResults.any() &&
              m(
                "ul",
                state.findLocationResults.map((location) =>
                  m(
                    "li.grouped",
                    m("p", location.formatted),
                    m(
                      "button",
                      {
                        onclick: () => selectLocation(mdl, state, location),
                      },
                      "Select"
                    )
                  )
                )
              )
          ),

        m("section#map", {
          oncreate: ({ dom }) => (state.dom = dom),
          style: {
            position: "relative",
            // width: "500px",
            height: "500px",
            margin: "0 auto",
          },
        })
      ),
  }
}

export default BonhamAcresMap

