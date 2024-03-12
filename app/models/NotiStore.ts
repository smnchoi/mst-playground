import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Noti, NotiModel } from "./Noti"
/**
 * Model description here for TypeScript hints.
 */
export const NotiStoreModel = types
  .model("NotiStore")
  .props({
    notiArray: types.array(NotiModel),
    checked: types.array(types.reference(NotiModel)),
    checkedOnly: false,
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get notiArryForList() {
      return self.checkedOnly ? self.checked : self.notiArray
    },

    isAlreadyChecked(noti: Noti) {
      return self.checked.includes(noti)
    },
  }))
  .actions((self) => ({
    setNotiArray() {
      // WIP 1.
      // const result: NotiStoreSnapshotIn[] = sampleData.map((noti) => ({
      //   ...noti,
      //   createdAt: new Date(noti.createdAt),
      // }))
      // console.log("result", result)
      // self.setProp("notiArray", result)
      //
      // WIP 2.
      // const result: NotiStoreSnapshotIn[] = sampleData.map((noti) => ({
      //   ...noti,
      //   createdAt: new Date(noti.createdAt),
      // }))
      // console.log("result", result)
      // const notiInstances = result.map((noti) => NotiModel.create(noti))
      // self.setProp("notiArray", notiInstances)
    },
  }))
  .actions((self) => ({
    check(noti: Noti) {
      self.checked.push(noti)
    },
    uncheck(noti: Noti) {
      self.checked.remove(noti)
    },
  }))
  .actions((self) => ({
    toggleCheck(noti: Noti) {
      self.isAlreadyChecked(noti) ? self.uncheck(noti) : self.check(noti)
    },
  }))

export interface NotiStore extends Instance<typeof NotiStoreModel> {}
export interface NotiStoreSnapshotOut extends SnapshotOut<typeof NotiStoreModel> {}
export interface NotiStoreSnapshotIn extends SnapshotIn<typeof NotiStoreModel> {}
export const createNotiStoreDefaultModel = () => types.optional(NotiStoreModel, {})
