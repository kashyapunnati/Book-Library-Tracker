let books = [];
let editingId = null;
let activeStatus = "all";

const bookTitle = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");
const bookStatus = document.getElementById("bookStatus");
const bookRating = document.getElementById("bookRating");

const addBookBtn = document.getElementById("addBookBtn");
const bookList = document.getElementById("bookList");
const stats = document.getElementById("stats");

const tabButtons = document.querySelectorAll(".tab-btn");

const savedBooks = localStorage.getItem("books");

if (savedBooks) {
    books = JSON.parse(savedBooks);
}

addBookBtn.addEventListener("click", function () {

    const title = bookTitle.value.trim();
    const author = bookAuthor.value.trim();
    const status = bookStatus.value;
    const rating = Number(bookRating.value);

    if (
        title === "" ||
        author === "" ||
        status === ""
    ) {
        alert("Please fill in the title, author and status.");
        return;
    }

    if (editingId !== null) {

        const book = books.find(function (item) {
            return item.id === editingId;
        });

        if (book) {
            book.title = title;
            book.author = author;
            book.status = status;

            book.rating = status === "read" ? rating : 0;
        }

        editingId = null;
        addBookBtn.textContent = "Add Book";

        alert("Book updated successfully!");

    } else {

        const newBook = {
            id: Date.now(),
            title: title,
            author: author,
            status: status,
            rating: status === "read" ? rating : 0
        };

        books.push(newBook);

        alert("Book added successfully!");
    }

    saveBooks();
    clearForm();
    displayBooks();
    displayStats();
});

function displayBooks() {

    bookList.innerHTML = "";

    let filteredBooks = books;

    if (activeStatus !== "all") {
        filteredBooks = books.filter(function (book) {
            return book.status === activeStatus;
        });
    }

    if (filteredBooks.length === 0) {
        bookList.innerHTML = "<p>No books found.</p>";
        return;
    }

    filteredBooks.forEach(function (book) {

        const card = document.createElement("div");

        card.className = "book-card";

        const statusText = getStatusText(book.status);

        let ratingHTML = "";

        if (book.status === "read") {
            ratingHTML = `
                <p class="rating">
                    ${getStars(book.rating)}
                </p>
            `;
        }

        card.innerHTML = `
            <h3>${book.title}</h3>

            <p>
                <strong>Author:</strong>
                ${book.author}
            </p>

            <span class="book-status">
                ${statusText}
            </span>

            ${ratingHTML}

            <br>

            <button
                class="edit-btn"
                onclick="editBook(${book.id})">
                Edit
            </button>

            <button
                class="delete-btn"
                onclick="deleteBook(${book.id})">
                Delete
            </button>
        `;

        bookList.appendChild(card);
    });
}

function getStatusText(status) {

    if (status === "read") {
        return "Read";
    }

    if (status === "reading") {
        return "Currently Reading";
    }

    if (status === "want-to-read") {
        return "Want to Read";
    }

    return status;
}

function getStars(rating) {

    if (rating === 0) {
        return "No rating";
    }

    return "⭐".repeat(rating);
}

function editBook(id) {

    const book = books.find(function (item) {
        return item.id === id;
    });

    if (!book) {
        return;
    }

    bookTitle.value = book.title;
    bookAuthor.value = book.author;
    bookStatus.value = book.status;
    bookRating.value = book.rating;

    editingId = id;

    addBookBtn.textContent = "Update Book";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function deleteBook(id) {

    const book = books.find(function (item) {
        return item.id === id;
    });

    if (!book) {
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete "${book.title}"?`
    );

    if (!confirmed) {
        return;
    }

    books = books.filter(function (item) {
        return item.id !== id;
    });

    saveBooks();
    displayBooks();
    displayStats();

    alert("Book deleted successfully!");
}

tabButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        tabButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        activeStatus = button.dataset.status;

        displayBooks();
    });
});

function displayStats() {

    const totalBooks = books.length;

    const booksRead = books.filter(function (book) {
        return book.status === "read";
    }).length;

    const currentlyReading = books.filter(function (book) {
        return book.status === "reading";
    }).length;

    const wantToRead = books.filter(function (book) {
        return book.status === "want-to-read";
    }).length;


    stats.innerHTML = `
        <div class="stat-card">
            Total Books
            <strong>${totalBooks}</strong>
        </div>

        <div class="stat-card">
            Books Read
            <strong>${booksRead}</strong>
        </div>

        <div class="stat-card">
            Currently Reading
            <strong>${currentlyReading}</strong>
        </div>

        <div class="stat-card">
            Want to Read
            <strong>${wantToRead}</strong>
        </div>
    `;
}

function saveBooks() {

    localStorage.setItem(
        "books",
        JSON.stringify(books)
    );
}

function clearForm() {

    bookTitle.value = "";
    bookAuthor.value = "";
    bookStatus.value = "";
    bookRating.value = "0";
}

displayBooks();
displayStats();