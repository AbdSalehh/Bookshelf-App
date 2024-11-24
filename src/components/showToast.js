import toastComponent from "./toastComponent.js";

function showToast(message, color, duration = 1500) {
  const toast = toastComponent(message, color);

  document.body.append(toast);

  setTimeout(() => {
    Object.assign(toast.style, {
      opacity: "0",
      top: "0px",
      visibility: "hidden",
      borderColor: "transparent",
      background: "transparent",
    });
  }, duration);
}

export default showToast;
