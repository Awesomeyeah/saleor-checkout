const getSpacing = (
  base /* number */,
  unit /* "px" | "rem" */,
  values /* number[] */
) => {
  return values.reduce((acc, value) => {
    return { ...acc, [value]: base * value + unit };
  }, {});
};

const spacing = getSpacing(
  0.4,
  "rem",
  [0, 1, 2, 3, 4, 5, 6, 8, 10, 11, 12, 18, 21, 22, 28, 256, 350]
);

const theme = {
  colors: {
    background: {
      primary: "#FAFAFA",
      secondary: "#FFFFFF",
      tertiary: "#EEF1F7",
    },
    text: {
      primary: "#394052",
      secondary: "#8A919F",
      tertiary: "#EEF1F7",
      error: "#B65757",
    },
    button: {
      primary: "#394052",
      secondary: "#FFFFFF",
      tertiary: "#DEE4EF",
      quaternary: "#EEF1F7",
      transparent: "transparent",
    },
    border: {
      primary: "#B9C1CF",
      active: "#394052",
      error: "#B65757",
    },
    tooltip: {
      primary: "#28234A",
    },
    snackbar: {
      error: "#FFE9EA",
      success: "#EDF9F0",
    },
  },
  fontFamily: {
    sans: ["Inter"],
  },
  spacing: {
    px: "1px",
    ...spacing,
  },
  fontWeight: {
    normal: 400,
    bold: 600,
  },
  fontSize: {
    xs: ["1.1rem", "1.6rem"],
    sm: ["1.2rem", "2.1rem"],
    base: ["1.4rem", "2.1rem"],
    lg: ["1.6rem", "2.3rem"],
    xl: ["3.2rem", "4.6rem"],
  },
  extend: {
    minHeight: spacing,
  },
};

module.exports = {
  content: ["./src/**/*.tsx"],
  mode: "jit",
  theme: theme,
  plugins: [],
};
