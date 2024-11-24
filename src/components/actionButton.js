function actionButton(isCompleted, id) {
  return `
      <button id="checklist" class="checklist-${id}">
        <div class="fa fa-${isCompleted ? "check-double" : "check"}"></div>
      </button>
      <button id="delete" class="delete-${id}">
        <div class="fa fa-trash"></div>
      </button>
    `;
}

export default actionButton;
