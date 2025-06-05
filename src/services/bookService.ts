import { AppDataSource } from '../config/data-source'; // TypeORM Data Source
import { Book } from '../entities/Book'; // Book entity
import { Author } from '../entities/Author'; // Author entity
import { ApplicationError } from '../error/invalid-request-exception'; // Custom application errors
import { UnhandledException } from '../error/unhandled-exception'; // Unhandled exception wrapper
import { UpdateBookBodyDto } from 'src/dtos/book.dto';

// Get the repositories for Book and Author entities once.
const bookRepository = AppDataSource.getRepository(Book);
const authorRepository = AppDataSource.getRepository(Author);

/**
 * Service function to create a new book.
 * @param title Book title.
 * @param genre Book genre (optional).
 * @param publicationYear Book publication year (optional).
 * @param authorId ID of the author.
 * @returns The newly created book object.
 */
export const createBook = async (
  title: string,
  genre: string | undefined,
  publicationYear: number | undefined,
  authorId: number
): Promise<Book> => {
  try {
    const author = await authorRepository.findOne({ where: { id: authorId } });
    if (!author) {
      throw new ApplicationError('Author not found for the provided authorId.', 404, 'BOOK_AUTHOR_NOT_FOUND');
    }

    const newBook = bookRepository.create({
      title,
      genre,
      publicationYear,
      author: author,
    });

    await bookRepository.save(newBook);
    return newBook;
  } catch (error: any) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new UnhandledException(error);
  }
};

/**
 * Service function to fetch all books with author details.
 * @returns Array of all book objects, including author name.
 */
export const getAllBooks = async (): Promise<any[]> => {
  try {

    const allBooks = await bookRepository.find({
      relations: ['author'],
      order: {
        createdAt: 'DESC'
      }
    });

    const booksWithAuthorName = allBooks.map(book => ({
      id: book.id,
      title: book.title,
      genre: book.genre,
      publicationYear: book.publicationYear,
      authorId: book.author.id,
      authorName: book.author.name,
      bio: book.author.bio,
      createdAt: book.createdAt,

    }));

    return booksWithAuthorName;
  } catch (error: any) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new UnhandledException(error);
  }
};

/**
 * Service function to fetch a single book by ID with author details.
 * @param id The ID of the book.
 * @returns The book object if found, otherwise null.
 */
export const getBookById = async (id: number): Promise<any | null> => {
  try {

    const book = await bookRepository.findOne({
      where: { id: id },
      relations: ['author'],
    });

    if (!book) {
      throw new ApplicationError('Book not found for the provided bookId.', 404, 'BOOK_NOT_FOUND');
    }

    const bookWithAuthorName = {
      id: book.id,
      title: book.title,
      genre: book.genre,
      publicationYear: book.publicationYear,
      authorId: book.author.id,
      authorName: book.author.name,
      bio: book.author.bio,
      createdAt: book.createdAt,

    };

    return bookWithAuthorName;
  } catch (error: any) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new UnhandledException(error);
  }
};

/**
 * Service function to update a book by ID.
 * @param id The ID of the book to update.
 * @param title New book title (optional).
 * @param genre New book genre (optional).
 * @param publicationYear New publication year (optional).
 * @param authorId New author ID (optional).
 * @returns The updated book object if found, otherwise null.
 */
export const updateBook = async (
  id: number,
  // title?: string,
  // genre?: string,
  // publicationYear?: number,
  // authorId?: number
  reqBody: UpdateBookBodyDto
): Promise<Book | null> => {
  try {
    const bookToUpdate = await bookRepository.findOne({ where: { id: id } });

    if (!bookToUpdate) {
      throw new ApplicationError('Book not found for the provided bookId.', 404, 'BOOK_NOT_FOUND');
    }

    if (reqBody.title !== undefined) {
      bookToUpdate.title = reqBody.title;
    }
    if (reqBody.genre !== undefined) {
      bookToUpdate.genre = reqBody.genre;
    }
    if (reqBody.publicationYear !== undefined) {
      bookToUpdate.publicationYear = reqBody.publicationYear;
    }
    if (reqBody.authorId !== undefined) {
      const author = await authorRepository.findOne({ where: { id: reqBody.authorId } });
      if (!author) {
        throw new ApplicationError('Author not found for the provided authorId.', 404, 'BOOK_AUTHOR_NOT_FOUND');
      }
      bookToUpdate.author = author;
    }

    await bookRepository.save(bookToUpdate);
    return bookToUpdate;
  } catch (error: any) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new UnhandledException(error);
  }
};

/**
 * Service function to delete a book by ID.
 * @param id The ID of the book to delete.
 * @returns True if the book was deleted, false if not found.
 */
export const deleteBook = async (id: number): Promise<boolean> => {
  try {
    const bookToDelete = await bookRepository.findOne({ where: { id: id } });

    if (!bookToDelete) {
      throw new ApplicationError('Book not found for the provided bookId.', 404, 'BOOK_NOT_FOUND');
    }
    const deleteResult = await bookRepository.delete(id);
    return deleteResult.affected === 1;
  } catch (error: any) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new UnhandledException(error);
  }
};
