import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Dimensions, Alert } from "react-native";

import { Fontisto } from "@expo/vector-icons";
import { Svg, Circle, Path } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  interpolate,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";

import { styles } from "./styles";
import { theme } from "../../styles/theme";
import { Header } from "../components/Header";

const { width, height } = Dimensions.get("screen");
let bottomNavBarHeight = height - Dimensions.get("window").height;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export function Home() {
  const waveAnimated = useSharedValue(5);
  const heightAnimated = useSharedValue(0);
  const buttonBorderAnimated = useSharedValue(0);
  const [percentage, setPercentage] = useState(0);

  const buttonProps = useAnimatedProps(() => {
    return {
      strokeWidth: interpolate(
        buttonBorderAnimated.value, //animated state
        [0, 0.5, 1], // frames
        [17, 40, 17] // values ref animated state
      ),
    };
  });

  const svgContainerProps = useAnimatedProps(() => {
    return {
      width,
      height:
        heightAnimated.value === 0
          ? 0.1
          : heightAnimated.value + bottomNavBarHeight,
      viewBox: `0 0 ${width} ${
        heightAnimated.value === 0
          ? 0.1
          : heightAnimated.value + bottomNavBarHeight
      }`,
    };
  });

  const firstWaveProps = useAnimatedProps(() => {
    return {
      d: `
      M 0 0
      Q 45 ${waveAnimated.value} 90 0
      T 180 0
      T 270 0
      T 360 0
      T 900 0
      T 540 0
      V ${heightAnimated.value} 
      H 0
      Z
    `,
    };
  });

  const secondWaveProps = useAnimatedProps(() => {
    return {
      d: `
            M 0 0
            Q 35 ${waveAnimated.value + 5} 70 0
            T 148 0
            T 210 0
            T 280 0
            T 350 0
            T 420 0
            V ${heightAnimated.value} 
            H 0
            Z
          `,
    };
  });

  function handleDrink() {
    buttonBorderAnimated.value = 0;
    waveAnimated.value = 5;

    buttonBorderAnimated.value = withTiming(1, {
      duration: 500,
      easing: Easing.ease,
    });

    waveAnimated.value = withRepeat(
      withTiming(17, { duration: 500, easing: Easing.ease }),
      2,
      true
    );

    heightAnimated.value = withTiming(heightAnimated.value + 100, {
      duration: 1000,
      easing: Easing.ease,
    });

    setPercentage(Math.trunc((heightAnimated.value + 100) / 10));
  }

  useEffect(() => {
    if (percentage >= 100) {
      heightAnimated.value = 0;
      setPercentage(0);
    }
  }, [percentage]);

  return (
    <View style={styles.container}>
      <Header ml={percentage} percent={percentage} />

      <AnimatedSvg animatedProps={svgContainerProps}>
        <AnimatedPath
          animatedProps={firstWaveProps}
          fill={theme.colors.blue100}
          transform="translate(0,10)"
        />

        <AnimatedPath
          animatedProps={secondWaveProps}
          fill={theme.colors.blue70}
          transform="translate(0,15)"
        />
      </AnimatedSvg>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleDrink}>
          <Svg width={120} height={120}>
            <AnimatedCircle
              animatedProps={buttonProps}
              strokeOpacity={0.5}
              fill={theme.colors.blue100}
              stroke={theme.colors.blue90}
              r={40}
              cx={60}
              cy={60}
            />
          </Svg>
          <Fontisto
            name="blood-drop"
            size={32}
            color={theme.colors.blue90}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
