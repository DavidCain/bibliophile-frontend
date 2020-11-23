import axios from "axios";

import { Book as GoodreadsBook } from "./types/goodreads";
import { Book, BookDescription } from "./types/bibliocommons";

export enum QueryState {
  NOT_STARTED,
  IN_PROGRESS,
  FAILED,
  COMPLETED
}

type ReadShelfParams = {
  userId: string;
  shelf: string;
};

// TODO: This is lazy, and axios has much better TS integration
// Use `AxiosResponse`, `axios.create()`, & similar
type ReadShelfResponse = {
  data: {
    books: GoodreadsBook[];
  };
};

export async function readShelf(
  params: ReadShelfParams
): Promise<GoodreadsBook[]> {
  const resp: ReadShelfResponse = await axios.post(
    "https://api.dcain.me/bibliophile/read_shelf",
    params
  );
  return resp.data.books;
}

type SearchCatalogParams = {
  biblio_subdomain: string;
  branch: string | null;
  books: BookDescription[];
};

// TODO: This is lazy, and axios has much better TS integration
// Use `AxiosResponse`, `axios.create()`, & similar
type SearchCatalogResponse = {
  data: {
    books: Book[];
  };
};

export async function searchCatalog(
  params: SearchCatalogParams
): Promise<Book[]> {
  const resp: SearchCatalogResponse = await axios.post(
    "https://api.dcain.me/bibliophile/search_catalog",
    params
  );
  return resp.data.books;
}
