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
    deleted: types.array(types.reference(NotiModel)),
    deletedOnly: false,
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get notiArryForList() {
      if (self.checkedOnly) return self.checked

      return self.deletedOnly
        ? self.notiArray.filter((noti) => self.deleted.includes(noti))
        : self.notiArray.filter((noti) => !self.deleted.includes(noti))

      //! DO NOT USE LIKE THIS:
      // return self.deletedOnly
      //   ? self.deleted
      //   : self.notiArray.filter((noti) => !self.deleted.includes(noti))
      //! 위와 같이 하면, .delete 와, .restore 메서드가 FlatList 에서 의도와 다르게 동작한다.
      //! [이유]
      //!   1. self.deleted 는 reference 타입이다.
      //!   2. FlatList 는 data prop 에 변화가 생길 경우, "조금 느리게" 반영된다. (🐞 RN 버그인가?)
      //!   3. <Observer><Card/></Observer> UI 는 바뀌지만, data 는 안 바뀐다.
      //!   4. "스크롤" 액션이 발생하면, 그제서야 바뀐다.
    },

    isChecked(noti: Noti) {
      return self.checked.includes(noti)
    },

    isDeleted(noti: Noti) {
      return self.deleted.includes(noti)
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
  .actions((self) => ({
    delete(noti: Noti) {
      self.deleted.push(noti)
    },
    restore(noti: Noti) {
      self.deleted.remove(noti)
    },
  }))

export interface NotiStore extends Instance<typeof NotiStoreModel> {}
export interface NotiStoreSnapshotOut extends SnapshotOut<typeof NotiStoreModel> {}
export interface NotiStoreSnapshotIn extends SnapshotIn<typeof NotiStoreModel> {}
export const createNotiStoreDefaultModel = () => types.optional(NotiStoreModel, {})
