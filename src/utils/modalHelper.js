import popupModal from "../components/popupModal.js";

function handleModal(container, onConfirm) {
  container.insertAdjacentHTML("beforeend", popupModal());

  const popup = container.querySelector(".popup_box");
  const background = container.querySelector(".background");

  function showModal() {
    Object.assign(popup.style, {
      opacity: "1",
      position: "fixed",
      pointerEvents: "auto",
    });
    Object.assign(background.style, {
      opacity: "1",
      pointerEvents: "auto",
    });
  }

  function hideModal() {
    popup.remove();
    background.remove();
    document.querySelector("#check").remove();
  }

  container.querySelector("#btnCancel").addEventListener("click", (e) => {
    e.preventDefault();
    hideModal();
  });

  container.querySelector("#btnDelete").addEventListener("click", (e) => {
    e.preventDefault();
    onConfirm();
    hideModal();
  });

  showModal();
}

export default handleModal;
