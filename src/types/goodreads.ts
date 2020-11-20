/**
 * Represents the minimal amount of information about a book to query it.
 *
 * This will ultimately come from the user's shelf.
 */
export type Book = {
  goodreads_id: string;
  isbn: string | null;
  title: string;
  author: string;
};
