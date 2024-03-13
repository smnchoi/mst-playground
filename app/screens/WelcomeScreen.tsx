import { Observer, observer } from "mobx-react-lite"
import React, { FC, useCallback, useEffect, useState } from "react"
import { FlatList, View, ViewStyle } from "react-native"
import { Button, Card, Text } from "app/components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import type { NotiModelType } from "app/models"
import { useStores } from "app/models"
import sampleData from "../screens/sample-data.json"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen() {
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
        text={isHappy ? "❤️" : "💙"}
        onPress={() => {
          console.log("isHappy", isHappy)
          setIsHappy(!isHappy)
        }}
      />

      {/* MST */}
      <View style={$topContainer}>
        <Text size="lg" text="MobX State Tree" />
        <FlatList
          data={notiStore.notiArryForList}
          renderItem={({ item }) => (
            <Observer>
              {() => (
                <Card
                  heading={`${item.createdAt.toLocaleDateString()}: ${item.title}`}
                  content={item.content}
                  footer={notiStore.isChecked(item) ? "🔘" : "🔵"}
                  footerStyle={$checkMark}
                  onPress={() => notiStore.toggleCheck(item)}
                />
              )}
            </Observer>
          )}
        />
      </View>

      {/* React State */}
      <View style={$bottomContainer}>
        <Text size="lg" text="React State" />
        <FlatList
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
