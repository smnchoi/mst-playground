import { Observer, observer } from "mobx-react-lite"
import React, { FC, useCallback, useEffect, useState } from "react"
import { FlatList, View, ViewStyle, TouchableOpacity } from "react-native"
import { Button, Card, Text } from "app/components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import type { NotiModelType } from "app/models"
import { useStores } from "app/models"
import sampleData from "./sample-data.json"

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen() {
  const { notiStore } = useStores()

  const [notiArrayState, setNotiArrayState] = useState<NotiModelType[]>([])
  const [checkedIds, setCheckedIds] = useState<NotiModelType["id"][]>([])
  const [isHappy, setIsHappy] = useState(false)

  useEffect(() => {
    const result: NotiModelType[] = sampleData.map((noti) => ({
      ...noti,
      createdAt: new Date(noti.createdAt),
    }))

    setNotiArrayState(result)
    notiStore.setProp("notiArray", result)
  }, [])

  const isChecked = useCallback((id: NotiModelType["id"]) => checkedIds.includes(id), [checkedIds])

  const toggleCheck = useCallback(
    (item: NotiModelType) => {
      checkedIds.includes(item.id)
        ? // UNCHECK
          setCheckedIds((ids) => ids.filter((id) => id !== item.id))
        : //  CHECK
          setCheckedIds((ids) => [...ids, item.id])
    },
    [checkedIds],
  )
  return (
    <View style={[$container, useSafeAreaInsetsStyle(["top", "bottom"])]}>
      <Button
        text={notiStore.deletedOnly ? "삭제된 알림" : "전체 알림"}
        onPress={() => {
          console.log("isHappy", isHappy)
          setIsHappy(!isHappy)

          notiStore.setProp("deletedOnly", !notiStore.deletedOnly)
        }}
      />

      {/* MST */}
      <View style={$topContainer}>
        <Text size="lg" text="MobX State Tree" />
        <FlatList
          key="MST"
          data={notiStore.notiArryForList}
          renderItem={({ item: noti }) => (
            <Observer>
              {() => (
                <View style={{ opacity: !notiStore.isDeleted(noti) ? 1 : 0.6 }}>
                  <Card
                    heading={noti.title}
                    content={noti.content}
                    // footer={notiStore.isChecked(item) ? "🔘" : "🔵"}
                    // footerStyle={$checkMark}
                    // onPress={() => notiStore.toggleCheck(item)}
                    LeftComponent={
                      <View
                        style={{
                          width: 12,
                          borderRightWidth: 1,
                          borderRightColor: colors.palette.neutral300,
                        }}
                      >
                        <Text
                          text={noti.labelFromPriority}
                          size="xxs"
                          style={{
                            top: 2,
                            left: -4,
                            color: colors.palette.neutral300,
                          }}
                        />
                      </View>
                    }
                    RightComponent={
                      <View
                        style={{
                          width: 20,
                          height: "100%",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            !notiStore.isDeleted(noti)
                              ? notiStore.delete(noti)
                              : notiStore.restore(noti)
                          }
                          hitSlop={4}
                        >
                          <Text text={!notiStore.isDeleted(noti) ? "✖️" : "🔙"} size="xxs" />
                        </TouchableOpacity>

                        <Text
                          text={noti.timestamp}
                          size="xxs"
                          style={{
                            width: 78,
                            position: "absolute",
                            bottom: -8,
                            right: 0,
                            textAlign: "right",
                            color: colors.palette.neutral300,
                          }}
                          numberOfLines={1}
                        />
                      </View>
                    }
                  />
                </View>
              )}
            </Observer>
          )}
          contentContainerStyle={{ backgroundColor: colors.background }}
        />
      </View>

      {/* React State */}
      <View style={$bottomContainer}>
        <Text size="lg" text="React State" />
        <FlatList
          key="React_State"
          data={notiArrayState}
          renderItem={({ item }) => (
            <Card
              heading={`${item.createdAt.toLocaleDateString()}: ${item.title}`}
              content={item.content}
              footer={isChecked(item.id) ? "🔘" : "🔵"}
              footerStyle={$checkMark}
              onPress={() => toggleCheck(item)}
            />
          )}
        />
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  flex: 1,
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
}

const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "43%",
  flex: 1,
  backgroundColor: colors.palette.neutral400,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
}

const $checkMark: ViewStyle = { position: "absolute", top: 0, right: 4 }
