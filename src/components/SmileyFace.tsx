import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useSharedValue,
} from "react-native-reanimated";
import { Arch } from "./Arch";
import { colors } from "../constants/colors";

interface SmileyFaceProps {
  translateX: Animated.SharedValue<number>;
  snapPositions: {
    first: number;
    second: number;
    third: number;
  };
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const SmileyFace: React.FC<SmileyFaceProps> = ({
  translateX,
  snapPositions,
}) => {
  const leftEye = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [snapPositions.first, snapPositions.second, snapPositions.third],
      [1, 1.5, 2.5],
      Extrapolation.CLAMP
    );

    const eyeX = interpolate(
      translateX.value,
      [snapPositions.first, snapPositions.second, snapPositions.third],
      [-10, -15, -20],
      Extrapolation.CLAMP
    );

    const eyeHeight = interpolate(
      translateX.value,
      [snapPositions.first, snapPositions.second, snapPositions.third],
      [50, 30, 50],
      Extrapolation.CLAMP
    );

    const eyeWidth = interpolate(
      translateX.value,
      [snapPositions.first, snapPositions.second, snapPositions.third],
      [50, 60, 50],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }, { translateX: eyeX }],
      height: eyeHeight,
      width: eyeWidth,
    };
  });

  const rightEye = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [snapPositions.first, snapPositions.second, snapPositions.third],
      [1, 1.5, 2.5],
      Extrapolation.CLAMP
    );

    const eyeX = interpolate(
      translateX.value,
      [snapPositions.first, snapPositions.second, snapPositions.third],
      [10, 15, 20],
      Extrapolation.CLAMP
    );

    const eyeHeight = interpolate(
      translateX.value,
      [snapPositions.first, snapPositions.second, snapPositions.third],
      [50, 30, 50],
      Extrapolation.CLAMP
    );

    const eyeWidth = interpolate(
      translateX.value,
      [snapPositions.first, snapPositions.second, snapPositions.third],
      [50, 60, 50],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }, { translateX: eyeX }],
      height: eyeHeight,
      width: eyeWidth,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.eyesContainer}>
        <AnimatedView style={[styles.eye, leftEye]} />
        <AnimatedView style={[styles.eye, rightEye]} />
      </View>
      <Arch
        translateX={translateX}
        snapPositions={snapPositions}
        stroke={colors.black}
        size={100}
        strokeWidth={4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 275,
  },
  eyesContainer: {
    flexDirection: "row",
  },
  eye: {
    backgroundColor: colors.black,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  mouthContainer: {},
});
