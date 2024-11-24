import { books, RENDER_EVENT, SAVED_EVENT, STORAGE_KEY } from "../utils/app.js";
import {
  generateBookObject,
  findBookIndex,
  isStorageExist,
  loadDataFromStorage,
} from "../services/bookServices.js";
import {
  saveData,
  addBookToCompleted,
  undoBookFromCompleted,
} from "../controller/bookControllers.js";
import actionButton from "../components/actionButton.js";
import showToast from "../components/showToast.js";
import handleModal from "../utils/modalHelper.js";

inputBookIsComplete.addEventListener("change", function () {
  const bookSubmit = document.querySelector("#bookSubmit > span");
  if (inputBookIsComplete.checked) {
    bookSubmit.innerText = "Selesai Dibaca";
  } else {
    bookSubmit.innerText = "Belum Selesai Dibaca";
  }
});

function makeBook(bookObject) {
  const { id, title, author, year, category, image, isCompleted } = bookObject;

  const bookCard = document.createElement("div");
  bookCard.classList.add("Book", "shadow");
  bookCard.setAttribute("id", `book-${id}`);

  bookCard.innerHTML = `
    <div class="BookCover">
      <img src="${image}">
    </div>
    <div class="bookDetail">
      <div class="BookTitle">${title}</div>
      <div class="BookAuthor">${author}</div>
      <div class="BookGenre">${category}</div>
      <div class="year">${year}</div>
    </div>
    <div class="actionButton">
      ${actionButton(isCompleted, id)}
    </div>
  `;

  const checklistBtn = bookCard.querySelector("#checklist");
  const deleteBtn = bookCard.querySelector("#delete");

  checklistBtn.addEventListener("click", () => {
    isCompleted ? undoBookFromCompleted(id) : addBookToCompleted(id);
  });

  deleteBtn.addEventListener("click", () => removeBook(id));

  return bookCard;
}

function handleBookSubmit(event) {
  event.preventDefault();

  const formData = {
    id: +new Date(),
    title: document.getElementById("inputBookTitle").value,
    author: document.getElementById("inputBookAuthor").value,
    year: Number(document.getElementById("inputBookYear").value),
    category: document.getElementById("inputBookCategory").value,
    image: document.getElementById("inputBookImage").value,
    isComplete: document.getElementById("inputBookIsComplete").checked,
  };

  if (typeof Storage === undefined) {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
    return;
  }

  const bookObject = generateBookObject(...Object.values(formData));
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));

  showToast(
    `Buku <b>&nbsp;${formData.title}&nbsp;</b> berhasil ditambahkan`,
    "#00c02b"
  );
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", handleBookSubmit);

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil di simpan.");
});

searchSubmit.addEventListener("click", function (event) {
  event.preventDefault();
  const searchTitle = document.querySelector("#search-txt");
  const searchResult = document.querySelector("#search>.BookCard");

  searchResult.innerHTML = `<p>Hasil pencarian judul buku <b>${searchTitle.value}</b></p>`;

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTitle.value.toLowerCase())
  );

  filteredBooks.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("Book", "shadow");

    const statusClass = book.isCompleted ? "Complete" : "Incomplete";
    const statusText = book.isCompleted ? "Selesai Dibaca" : "Belum Selesai";

    bookCard.innerHTML = `
      <div class="BookCover">
        <img src="${book.image}">
      </div>
      <div class="bookDetail">
        <div class="bookTitle">${book.title}</div>
        <div class="BookAuthor">${book.author}</div>
        <div class="BookGenre">${book.category}</div>
        <div class="status ${statusClass}">${statusText}</div>
      </div>
      <div class="actionButton">
        ${actionButton(book.isCompleted, book.id)}
      </div>
    `;

    const checklistBtn = bookCard.querySelector("#checklist");
    const deleteBtn = bookCard.querySelector("#delete");

    checklistBtn.addEventListener("click", () => {
      book.isCompleted
        ? undoBookFromCompleted(book.id)
        : addBookToCompleted(book.id);
    });

    deleteBtn.addEventListener("click", () => removeBook(book.id));

    searchResult.append(bookCard);
  });
});

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;

  const existingElements = [".popup_box", ".background", "#check"].forEach(
    (selector) => {
      const element = document.querySelector(selector);
      if (element) element.remove();
    }
  );

  const container = document.querySelector(".container");

  handleModal(container, () => {
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    showToast("Buku berhasil dihapus", "#FA532E");
  });
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById("uncompleteBook");
  const listCompleted = document.getElementById("completeBook");

  uncompletedBookList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }
});
