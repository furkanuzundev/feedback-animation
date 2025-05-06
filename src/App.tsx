import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { registerRootComponent } from "expo";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "./constants/colors";
import { typography } from "./constants/fonts";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  withSpring,
  interpolateColor,
  Extrapolation,
  runOnJS,
} from "react-native-reanimated";
import {
  FlatList,
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { Arch } from "./components/Arch";
import { SmileyFace } from "./components/SmileyFace";

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

type ExperienceType = {
  id: string;
  mainTitle: string;
  progressTitle: string;
  color: string;
};

const EXPERIENCE_TYPES: Record<string, ExperienceType> = {
  bad: {
    id: "1",
    mainTitle: "BAD",
    progressTitle: "Bad",
    color: "rgba(255, 25, 0, 0.7)",
  },
  notBad: {
    id: "2",
    mainTitle: "NOT BAD",
    progressTitle: "Not bad",
    color: "rgba(231, 177, 60, 0.5)",
  },
  good: {
    id: "3",
    mainTitle: "GOOD",
    progressTitle: "Good",
    color: "rgba(117, 231, 60, 0.5)",
  },
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_PADDING_HORIZONTAL = 36;
const SCREEN_PADDING_VERTICAL = 24;

const App: React.FC = () => {
  const [fontsLoaded, fontError] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  const progressLineWidth =
    (SCREEN_WIDTH - SCREEN_PADDING_HORIZONTAL * 2) * 0.9;

  const sectionWidth = progressLineWidth / 3;
  const firstSection = sectionWidth / 2;
  const secondSection = sectionWidth * 2;

  const snapPositions = {
    first: -14,
    second: progressLineWidth / 2 - 21,
    third: progressLineWidth - 20,
  };

  const translateX = useSharedValue(-12);
  const flatlistRef = useRef<FlatList>(null);

  const scrollToIndex = (index: number) => {
    flatlistRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  // Add keyboard state
  const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);

  // Add keyboard listeners
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener("keyboardWillShow", () => {
      setIsKeyboardVisible(true);
    });
    const keyboardWillHide = Keyboard.addListener("keyboardWillHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      const newPosition = context.startX + event.translationX;
      const maxX = progressLineWidth - 20;
      translateX.value = Math.max(-12, Math.min(newPosition, maxX));
    },
    onEnd: () => {
      if (translateX.value <= firstSection) {
        translateX.value = withSpring(snapPositions.first);
        runOnJS(scrollToIndex)(0);
      } else if (translateX.value <= secondSection) {
        translateX.value = withSpring(snapPositions.second);
        runOnJS(scrollToIndex)(1);
      } else {
        translateX.value = withSpring(snapPositions.third);
        runOnJS(scrollToIndex)(2);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const animatedSafeAreaStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translateX.value,
      [snapPositions.first, snapPositions.second, snapPositions.third],
      [
        EXPERIENCE_TYPES.bad.color,
        EXPERIENCE_TYPES.notBad.color,
        EXPERIENCE_TYPES.good.color,
      ],
      "RGB"
    );
    return {
      backgroundColor,
    };
  });

  const badTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      translateX.value,
      [snapPositions.first, snapPositions.second, snapPositions.third],
      [colors.darkGray, colors.lightGray, colors.lightGray]
    );

    return {
      color,
    };
  });

  const notBadTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      translateX.value,
      [snapPositions.first, snapPositions.second, snapPositions.third],
      [colors.lightGray, colors.darkGray, colors.lightGray]
    );

    return {
      color,
    };
  });

  const goodTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      translateX.value,
      [snapPositions.first, snapPositions.second, snapPositions.third],
      [colors.lightGray, colors.lightGray, colors.darkGray]
    );

    return {
      color,
    };
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <AnimatedSafeAreaView style={[styles.container, animatedSafeAreaStyle]}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.iconView}>
                <MaterialIcons name="close" size={24} color="black" />
              </View>
              <View style={styles.iconView}>
                <MaterialIcons name="info-outline" size={24} color="black" />
              </View>
            </View>
            <Text style={styles.title}>
              How was your shopping{"\n"}experience?
            </Text>
            <SmileyFace translateX={translateX} snapPositions={snapPositions} />
            {!isKeyboardVisible && (
              <>
                <View>
                  <FlatList
                    ref={flatlistRef}
                    data={Object.keys(EXPERIENCE_TYPES)}
                    renderItem={({ item }) => (
                      <Animated.Text
                        style={[
                          styles.scrollText,
                          {
                            width: SCREEN_WIDTH - SCREEN_PADDING_HORIZONTAL * 2,
                          },
                        ]}
                      >
                        {EXPERIENCE_TYPES[item].mainTitle}
                      </Animated.Text>
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
                <View style={styles.progressbarContainer}>
                  <View style={styles.progressLine} />
                  <View style={styles.circleViewContainer}>
                    <Pressable
                      onPress={() => {
                        scrollToIndex(0);
                        translateX.value = withSpring(snapPositions.first);
                      }}
                      style={[
                        styles.circleView,
                        {
                          right: 10,
                        },
                      ]}
                    >
                      <View style={styles.circlePoint} />
                      <Animated.Text style={[styles.circleText, badTextStyle]}>
                        Bad
                      </Animated.Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        scrollToIndex(1);
                        translateX.value = withSpring(snapPositions.second);
                      }}
                      style={styles.circleView}
                    >
                      <View style={styles.circlePoint} />
                      <Animated.Text
                        style={[styles.circleText, notBadTextStyle]}
                      >
                        Not bad
                      </Animated.Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        scrollToIndex(2);
                        translateX.value = withSpring(snapPositions.third);
                      }}
                      style={[
                        styles.circleView,
                        {
                          left: 10,
                        },
                      ]}
                    >
                      <View style={styles.circlePoint} />
                      <Animated.Text style={[styles.circleText, goodTextStyle]}>
                        Good
                      </Animated.Text>
                    </Pressable>
                  </View>
                  <PanGestureHandler onGestureEvent={panGestureHandler}>
                    <Animated.View
                      style={[styles.animatedCircle, animatedStyle]}
                    >
                      <Arch
                        translateX={translateX}
                        snapPositions={snapPositions}
                      />
                    </Animated.View>
                  </PanGestureHandler>
                </View>
              </>
            )}

            <View style={styles.buttonContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type your feedback"
              />
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Submit</Text>
                <MaterialIcons name="arrow-right-alt" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </AnimatedSafeAreaView>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingVertical: SCREEN_PADDING_VERTICAL,
    justifyContent: "space-between",
    gap: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconView: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    ...typography.h3,
    textAlign: "center",
    color: colors.black,
  },
  faceAnimationView: {
    justifyContent: "center",
    alignItems: "center",
  },
  mainTitleView: {
    flexDirection: "row",
  },
  mainTitle: {
    ...typography.h1,
    color: colors.black,
  },
  progressbarContainer: {
    width: "90%",
    alignSelf: "center",
  },
  circleViewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: 12,
  },
  circleView: {
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  circlePoint: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
  },

  progressLine: {
    width: "100%",
    height: 8,
    borderRadius: 10,
    backgroundColor: colors.lightGray,
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 30,
    overflow: "hidden",
  },
  button: {
    backgroundColor: colors.black,
    padding: 16,
    width: "35%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    flexDirection: "row",
    gap: 8,
  },
  buttonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  animatedCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.darkGray,
    position: "absolute",
    top: -12,
  },
  circleText: {
    ...typography.body,
    color: colors.lightGray,
    fontSize: 12,
  },
  scrollView: {
    flexDirection: "row",
  },
  scrollText: {
    ...typography.h1,
    textAlign: "center",
    fontSize: 40,
    color: "rgba(51, 51, 51, 0.8)",
  },
  textInput: {
    flex: 1,
    padding: 16,
    ...typography.body,
  },
});

export default App;
registerRootComponent(App);
