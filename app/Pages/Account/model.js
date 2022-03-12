import { toPairs, compose, map, prop, filter, keys, head, reverse } from "ramda"
import Task from "data.task"
import D from "dayjs"
import af from "dayjs/plugin/advancedFormat"
D.extend(af)

const toProfileVM =
  ({ emailVerified, email, name }) =>
  ({ objectId, avatar, address }) => ({
    objectId,
    address,
    emailVerified,
    email,
    name,
    avatar,
  })

const getProfile = (mdl) => (id) =>
  mdl.http.back4App
    .getTask(mdl)(`classes/Accounts?${id}`)
    .map(prop("results"))
    .map(head)
    .map(toProfileVM(mdl.user))

const toDuesVM = (dues) => {
  dues.date = new Date(dues.date).toString().split(" ").splice(0, 4).join(" ")
  return dues
}

const getDues = (mdl) => (id) =>
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

const getMessages = (mdl) => (id) =>
  mdl.http.back4App
    .getTask(mdl)(`classes/Messages?${id}`)
    .map(prop("results"))
    .map(hasNotifications(mdl))
    .map(map(toMessagesVM))

export const loadAllTask = (mdl) => {
  let id = encodeURI(`where={"userId":"${mdl.user.objectId}"}`)
  return Task.of((profile) => (dues) => (messages) => ({
    profile,
    dues,
    messages,
  }))
    .ap(getProfile(mdl)(id))
    .ap(getDues(mdl)(id))
    .ap(getMessages(mdl)(id))
}
