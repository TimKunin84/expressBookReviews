const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "User already exists." });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop (Task 1)
public_users.get('/', function (req, res) {
    return res.status(200).json({ books: books });
});

// Get book details based on ISBN (Task 2)
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

// Get book details based on author (Task 3)
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];

    for (let key in books) {
        if (books[key].author === author) {
            matchingBooks.push(books[key]);
        }
    }

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({ message: "No books found by this author." });
    }
});

// Get all books based on title (Task 4)
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const matchingBooks = [];

    for (let key in books) {
        if (books[key].title === title) {
            matchingBooks.push(books[key]);
        }
    }

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({ message: "No books found with this title." });
    }
});

// Get book review (Task 5)
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "No reviews found for this book." });
    }
});

// ------------------- TASKS 10-13 Placeholders -------------------

// Task 10 - Async/Await version to get all books
public_users.get('/async/books', async (req, res) => {
    try {
        const booksData = await getBooksAsync();
        return res.status(200).json(booksData);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching books", error: err.message });
    }
});

// Task 11 - Async/Await version to get book by ISBN
public_users.get('/async/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const bookData = await getBookByISBNAsync(isbn);
        return res.status(200).json(bookData);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

// Task 12 - Async/Await version to get books by author
public_users.get('/async/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const booksByAuthor = await getBooksByAuthorAsync(author);
        return res.status(200).json(booksByAuthor);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

// Task 13 - Async/Await version to get books by title
public_users.get('/async/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const booksByTitle = await getBooksByTitleAsync(title);
        return res.status(200).json(booksByTitle);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

// ------------------- Helper Functions for Async Tasks -------------------

function getBooksAsync() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

function getBookByISBNAsync(isbn) {
    return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject(new Error("Book not found."));
        }
    });
}

function getBooksByAuthorAsync(author) {
    return new Promise((resolve, reject) => {
        const matchingBooks = [];

        for (let key in books) {
            if (books[key].author === author) {
                matchingBooks.push(books[key]);
            }
        }

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject(new Error("No books found by this author."));
        }
    });
}

function getBooksByTitleAsync(title) {
    return new Promise((resolve, reject) => {
        const matchingBooks = [];

        for (let key in books) {
            if (books[key].title === title) {
                matchingBooks.push(books[key]);
            }
        }

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject(new Error("No books found with this title."));
        }
    });
}

module.exports.general = public_users;
