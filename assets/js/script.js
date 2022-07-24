const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF';

inputBookIsComplete.addEventListener('change', function () {
    const bookSubmit = document.querySelector('#bookSubmit>span')
    if (inputBookIsComplete.checked) {
        bookSubmit.innerText = 'Selesai Dibaca'
    } else {
        bookSubmit.innerText = 'Belum Selesai Dibaca'
    }
})

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, category, image, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        category,
        image,
        isCompleted
    }
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}


/**
 * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
 *
 * @returns boolean
 */
function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
function saveData() {
    if (isStorageExist()) {
        const parsed /* string */ = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

/**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel {@see todos}
 */
function loadDataFromStorage() {
    const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}


function makeBook(bookObject) {
    const {
        id,
        title,
        author,
        year,
        category,
        image,
        isCompleted
    } = bookObject;

    const bookImage = document.createElement('img');
    bookImage.setAttribute('src', `${image}`);

    const bookCover = document.createElement('div');
    bookCover.classList.add('BookCover');
    bookCover.append(bookImage);

    const bookTitle = document.createElement('div');
    bookTitle.classList.add('BookTitle');
    bookTitle.innerText = title;

    const bookAuthor = document.createElement('div');
    bookAuthor.classList.add('BookAuthor');
    bookAuthor.innerText = author;

    const bookGenre = document.createElement('div');
    bookGenre.classList.add('BookGenre');
    bookGenre.innerText = category;

    const bookYear = document.createElement('div');
    bookYear.classList.add('year');
    bookYear.innerText = year;

    const BookDetail = document.createElement('div');
    BookDetail.classList.add('bookDetail');
    BookDetail.append(bookTitle, bookAuthor, bookGenre, bookYear);

    const iconDelete = document.createElement('div');
    iconDelete.classList.add('fa', 'fa-trash');

    const iconChecklist = document.createElement('div');
    iconChecklist.classList.add('fa', 'fa-check');

    const iconDoubleChecklist = document.createElement('div');
    iconDoubleChecklist.classList.add('fa', 'fa-check-double');

    const bookCard = document.createElement('div');
    bookCard.classList.add('Book', 'shadow')
    bookCard.append(bookCover, BookDetail);
    bookCard.setAttribute('id', `book-${id}`);

    // const isCompletedBook = document.getElementById("inputBookIsCompleted");
    if(isCompleted) {
        const buttonDoubleChecklist = document.createElement('button');
        buttonDoubleChecklist.setAttribute('id', `checklist`);
        buttonDoubleChecklist.append(iconDoubleChecklist);
        buttonDoubleChecklist.addEventListener('click', function () {
            undoBookFromCompleted(id);
        });

        const buttonDelete = document.createElement('button');
        buttonDelete.setAttribute('id', `delete`);
        buttonDelete.append(iconDelete);
        buttonDelete.addEventListener('click', function () {
            removeBookFromCompleted(id);
        });

        const actionButton = document.createElement('div');
        actionButton.classList.add('actionButton');
        actionButton.append(buttonDoubleChecklist, buttonDelete);

        bookCard.append(actionButton);
    }else{
        const buttonChecklist = document.createElement('button');
        buttonChecklist.setAttribute('id', `checklist`);
        buttonChecklist.append(iconChecklist);
        buttonChecklist.addEventListener('click', function () {
            addBookToCompleted(id);
        });

        const buttonDelete = document.createElement('button');
        buttonDelete.setAttribute('id', `delete`);
        buttonDelete.append(iconDelete);
        buttonDelete.addEventListener('click', function () {
            removeBookFromCompleted(id);
        });

        const actionButton = document.createElement('div');
        actionButton.classList.add('actionButton');
        actionButton.append(buttonChecklist, buttonDelete);

        bookCard.append(actionButton);
    }
    return bookCard;
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId) {

    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

inputBook.addEventListener('submit', function (event) {
    event.preventDefault()
    const bookTitle = document.getElementById("inputBookTitle").value
    const bookAuthor = document.getElementById("inputBookAuthor").value
    const bookYear = document.getElementById("inputBookYear").value
    const bookCategory = document.getElementById("inputBookCategory").value
    const bookImage = document.getElementById("inputBookImage").value
    const bookIsCompleted = document.getElementById("inputBookIsComplete").checked

    const newBook = {
        id: +new Date(),
        title: bookTitle,
        author: bookAuthor,
        year: bookYear,
        category: bookCategory,
        image: bookImage,
        isComplete: bookIsCompleted
    }

    if (typeof Storage !== undefined) {
        const bookObject = generateBookObject(newBook.id, newBook.title, newBook.author, newBook.year, newBook.category, newBook.image, newBook.isComplete);
        books.push(bookObject)
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } else {
        alert("Browser yang Anda gunakan tidak mendukung Web Storage")
    }

});



document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('uncompleteBook');
    const listCompleted = document.getElementById('completeBook');

    // clearing list item
    uncompletedBookList.innerHTML = '';
    listCompleted.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isCompleted===true) {
            listCompleted.append(bookElement);
        } else {
            uncompletedBookList.append(bookElement);
        }
    }
});