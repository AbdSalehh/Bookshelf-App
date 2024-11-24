function toastComponent(message, color) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  Object.assign(toast.style, {
    opacity: "1",
    top: "10px",
    visibility: "visible",
    maxWidth: "200px",
    borderColor: color,
    background: color,
    color: "#fff",
  });
  toast.innerHTML = message;

  return toast;
}

export default toastComponent;
