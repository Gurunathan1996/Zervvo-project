import { AppDataSource } from '../config/data-source';
import { Author } from '../entities/Author';
import { ApplicationError } from '../error/invalid-request-exception';
import { UnhandledException } from '../error/unhandled-exception';


/**
 * Service function to create a new author.
 * @param name The name of the author.
 * @param bio The biography of the author (optional).
 * @returns The newly created author object.
 */
export const createAuthor = async (name: string, bio?: string): Promise<Author> => {
  try {
    const authorRepository = AppDataSource.getRepository(Author);
    const newAuthor = authorRepository.create({ name, bio });
    await authorRepository.save(newAuthor);
    return newAuthor;

  } catch (error: any) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    if (error.code === '23505' && error.detail.includes('Key (name)')) {
      throw new ApplicationError('Author with this name already exists.', 409, 'AUTHOR_NAME_EXISTS');
    }
    throw new UnhandledException(error);
  }
};

/**
 * Service function to fetch all authors.
 * @returns An array of all author objects, ordered by creation date.
 */
export const getAllAuthors = async (): Promise<{allAuthors:Author[],totalCount:number}> => {
  try {
    const authorRepository = AppDataSource.getRepository(Author);
    const  [allAuthors, totalCount] = await authorRepository.findAndCount({
      order: {
        createdAt: 'DESC'
      },
      relations: {
        books: true
      }
    });
    return {totalCount:totalCount,allAuthors:allAuthors};
  } catch (error: any) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new UnhandledException(error);
  }
};

/**
 * Service function to fetch a single author by ID.
 * @param id The ID of the author to fetch.
 * @returns The author object if found, otherwise null.
 */
export const getAuthorById = async (id: number): Promise<Author | null> => {
  try {

    const authorRepository = AppDataSource.getRepository(Author);
    const author = await authorRepository.findOne({ where: { id: id },relations: ['books'], });
    if (!author) {
      throw new ApplicationError('Author not found.', 404, 'AUTHOR_NOT_FOUND');
    }
    return author;

  } catch (error: any) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new UnhandledException(error);
  }
};

/**
 * Service function to update an author by ID.
 * @param id The ID of the author to update.
 * @param name The new name for the author (optional).
 * @param bio The new biography for the author (optional).
 * @returns The updated author object if found and updated, otherwise null.
 */
export const updateAuthor = async (id: number, name?: string, bio?: string): Promise<Author | null> => {
  try {

    const authorRepository = AppDataSource.getRepository(Author);
    const authorToUpdate = await authorRepository.findOne({ where: { id: id } });

    if (!authorToUpdate) {
      throw new ApplicationError('Author not found.', 404, 'AUTHOR_NOT_FOUND');
    }

    if (name !== undefined) {
      authorToUpdate.name = name;
    }
    if (bio !== undefined) {
      authorToUpdate.bio = bio;
    }

    await authorRepository.save(authorToUpdate);
    return authorToUpdate;

  } catch (error: any) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    if (error.code === '23505' && error.detail.includes('Key (name)')) {
      throw new ApplicationError('Author with this name already exists.', 409, 'AUTHOR_NAME_EXISTS');
    }
    throw new UnhandledException(error);
  }
};