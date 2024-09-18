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

const getBookmark = tryCatchHandler<
  Request<{ id: string }>,
  Response<BookmarkType>
>(async (req: Request<{ id: string }>, res: Response<BookmarkType>) => {
  const Bookmarks: BookmarkType[] = await BookmarkModules.getSingleBookmark(
    Number(req.params.id)
  );
  const bookmark: BookmarkType = Bookmarks[0];
  res.status(200).json(bookmark);
});

export { getBookmarks, getBookmark };
