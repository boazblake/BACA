import m from "mithril"
import { isAdminOrMod } from "@/Utils/helpers"
import Loader from '@/Components/loader'
import {
  state,
  loadResidentsTask,
  findLocationTask,
  createMap,
  // saveResidentTask,
  // selectLocation,
} from "./model.js"
import '@/Utils/stamen.js'
import { value } from "@boazblake/fun-config/lib/src/util.js"

const findResident = (mdl, state) => {
  const onError = (e) => {
    let msg = "error finding resident"
    console.log(msg, e)
  }

  const onSuccess = (results) =>
    results.bindPopup(`added`).openPopup()


  state.input?.length > 5 &&
    findLocationTask(mdl, state.input).fork(onError, onSuccess)
}

const restartFindResident = (mdl, state) => {
  loadResidentsTask(mdl, state).fork(log("e"), () => {
    state.newLocation = null
    state.findLocationResults = []
    state.input = null
  })
}

const toggleEditResidents = (state) => state.isEdit(!state.isEdit())
const resetState = (mdl, state) => {
  const onError = (err) => log("err")(err)
  const onSuccess = (state) => {
    state.map.on('mapReady', map => {
      console.log('map', map)
      setTimeout(() => {
        map.invalidateSize();
      }, 0);
    })
    state.status = 'loaded'
  }

  toggleEditResidents(state)
  state.map.remove()
  createMap(state)({ dom: state.dom })
  loadResidentsTask(mdl, state).fork(onError, onSuccess)
}

const saveResident = (mdl, state) => {
  const onError = (e) => log("e")(e)
  const onSuccess = (data) => { console.log('saveresident', data); }

  saveResidentTask(mdl, state.newLocation).chain(() => loadResidentsTask(mdl, state))
    .fork(onError, onSuccess)
}

const BonhamAcresMap = ({ attrs: { mdl } }) => {
  state.opts.center = mdl.Map.bh
  state.opts.bounds = mdl.Map.bounds
  const onError = (err) => log("err")(err)
  const onSuccess = (state) => {
    state.map.on('mapReady', map => {
      console.log('map', map)
      setTimeout(() => {
        map.invalidateSize();
      }, 0);
    })
    state.status = 'loaded'
  }
  loadResidentsTask(mdl, state).fork(onError, onSuccess)
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "section",
        state.status == 'loading' && m(Loader),
        isAdminOrMod(mdl) &&
        m(
          "section",
          state.isEdit()
            ? m(
              ".grouped",
              m("input", {
                type: "text",
                value: state.input,
                oninput: (e) => (state.input = e.target.value),
              }),
              state.newLocation
                ? [
                  m(
                    "button.outline.bd-danger",
                    { onclick: () => restartFindResident(mdl, state) },
                    "restart"
                  ),
                  m(
                    "button.outline.bd-primary",
                    { onclick: () => saveResident(mdl, state) },
                    "Save"
                  ),
                ]
                : [
                  m(
                    "button.primary",
                    { onclick: () => findResident(mdl, state) },
                    "Search"
                  ),
                  m(
                    "button.primary",
                    { onclick: () => saveResident(mdl, state) },
                    "Save"
                  ),
                  m(
                    "button.outline.bd-danger",
                    { onclick: () => resetState(mdl, state) },
                    "Cancel"
                  ),
                ]
            )
            : m(
              "button.outline.bd-primary",
              { onclick: () => resetState(mdl, state) },
              "Edit"
            ),
          m(
            "select.outline.bd-primary",
            {
              onchange: ({ target: { value } }) => {
                state.layerType = value
                resetState(mdl, state)
              }
            },
            [
              m('option', 'watercolor'),
              m('option', 'toner'),
              m('option', 'terrain'),
            ]
          ),

        ),

        m("section#map", {
          oncreate: createMap(state),
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

