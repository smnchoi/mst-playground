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

    isChecked(noti: Noti) {
      return self.checked.includes(noti)
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
      self.isChecked(noti) ? self.uncheck(noti) : self.check(noti)
    },
  }))

export interface NotiStore extends Instance<typeof NotiStoreModel> {}
export interface NotiStoreSnapshotOut extends SnapshotOut<typeof NotiStoreModel> {}
export interface NotiStoreSnapshotIn extends SnapshotIn<typeof NotiStoreModel> {}
export const createNotiStoreDefaultModel = () => types.optional(NotiStoreModel, {})
