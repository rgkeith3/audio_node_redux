export const transformValue = (sliderAction, value) => {
  switch(sliderAction) {
    case "exp":
      return Math.pow(value, 2);
    case "cub":
      return Math.pow(value, 3);
    default:
      return value;
  }
}

export const reverseTransformValue = (sliderAction, value) => {
  switch(sliderAction) {
    case "exp":
      return Math.sqrt(value);
    case "cub":
      return Math.cbrt(value);
    default:
      return value;
  }
}