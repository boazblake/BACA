import m from "mithril"
import { map, prop, head, reverse } from "ramda"
import { formatDate } from "@/Utils/helpers"
import Task from "data.task"
// import D from "dayjs"
// import af from "dayjs/plugin/advancedFormat"
// D.extend(af)

// const getAddressTask = (mdl) => (id) =>
//   mdl.http.back4App.getTask(mdl)(`classes/Addresses/${id}`)

// const getAddressesTask = (mdl) => (ids) =>
//   ids.any() ? ids.traverse(getAddressTask(mdl), Task.of) : Task.of([])

// const toProfileVM =
//   ({
//     user: { emailVerified, email, name },
//     data: {
//       account: { objectId, avatar, address, telephone },
//     },
//   }) =>
//     ({ addressIds }) => ({
//       objectId,
//       address,
//       addressIds,
//       telephone,
//       emailVerified,
//       email,
//       name,
//       avatar,
//     })



const getDuesTask = (mdl) => (id) =>
  mdl.http.back4App
    .getTask(mdl)(`classes/Dues?${id}`)
    .map(prop("results"))
    .map(map(toDuesVM))
    .map(reverse)

const toMessagesVM = (msgs) => msgs

const hasNotifications = (mdl) => (msgs) => {
  mdl.state.hasNotifications(msgs.any())
  return msgs
}

const getMessagesTask = (mdl) => (id) =>
  mdl.http.back4App
    .getTask(mdl)(`classes/Messages?${id}`)
    .map(prop("results"))
    .map(hasNotifications(mdl))
    .map(map(toMessagesVM))

export const loadAllTask = (mdl) => {
  let id = encodeURI(`where={"userId":"${mdl.user.objectId}"}`)
  return Task.of((profile) => (dues) => (messages) => (addresses) => {
    return {
      profile,
      dues,
      messages,
      addresses,
    }
  })
    .ap(getProfileTask(mdl)(id))
    .ap(getDuesTask(mdl)(id))
    .ap(getMessagesTask(mdl)(id))
    .ap(getAddressesTask(mdl)(mdl.data.account.addressIds))
}

