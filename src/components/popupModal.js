function popupModal() {
  return `
      <input type="checkbox" id="check">
      <div class="background"></div>
      <div class="popup_box">
        <i class="fa fa-exclamation"></i>
        <h1>Apakah kamu yakin ingin menghapus buku ini?</h1>
        <label>Jika yakin, klik button "Hapus"</label>
        <button class="btns">
          <a class="btn2" id="btnDelete">Hapus</a>
          <a class="btn1" id="btnCancel">Batal</a>
        </button>
      </div>
    `;
}

export default popupModal;
