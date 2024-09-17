import BookmarkModules, { BookmarkType } from "../modules/bookmarks-module";
import tryCatchHandler from "../utilities/tryCatch_handler";
import { Request, Response } from "express-serve-static-core";
const getBookmarks = tryCatchHandler<
  Request<string, {}, {}, {}>,
  Response<BookmarkType[]>
>(async (req: Request<string, {}, {}, {}>, res: Response<BookmarkType[]>) => {
  const bookmarks: BookmarkType[] = await BookmarkModules.getBookmarks(
    req.query
  );
  res.status(200).json(bookmarks);
});

export { getBookmarks };
