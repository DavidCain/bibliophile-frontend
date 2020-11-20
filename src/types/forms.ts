import { Library } from "./bibliocommons";

export type FormData = {
  userId: string;
  shelf: string;
  library: Library;
  branch: string | null;
};
