import Joi from "joi";
import BookmarkModules, { BookmarkType, ResultAddBookmarkType } from "../modules/bookmarks-module";
import tryCatchHandler from "../utilities/tryCatch_handler";
import { Request, Response } from "express-serve-static-core";
import AppError from "../utilities/app_errores";
import { QueryResult } from "mysql2";
export interface BookmarkFrontType {
  cityName: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  hostLocation: string;
}
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

const addBookmark = tryCatchHandler<
  Request<{}, {}, BookmarkFrontType>,
  Response<{ message: string; status: ResultAddBookmarkType; bookmark: BookmarkType }>
>(
  async (
    req: Request<{}, {}, BookmarkFrontType>,
    res: Response<{
      message: string;
      status: ResultAddBookmarkType;
      bookmark: BookmarkType;
    }>
  ) => {
    const schema = {
      cityName: Joi.string().max(30).required(),
      country: Joi.string().max(30).required(),
      countryCode: Joi.string().max(10).required(),
      hostLocation: Joi.string().required(),
      lat: Joi.number().strict().required(),
      lon: Joi.number().strict().required(),
    };
    const validateResult = Joi.object(schema).validate(req.body);

    if (validateResult.error) {
      throw new AppError(101, 400, validateResult.error.details[0].message);
    }
    const status:ResultAddBookmarkType = await BookmarkModules.addBookmark(req.body);

    const Bookmarks: BookmarkType[] = await BookmarkModules.getSingleBookmark(
      Number(status.insertId)
    );
    const bookmark: BookmarkType = Bookmarks[0];

    res.status(200).json({
      message: "New bookmark added successfully!",
      status,
      bookmark,
    });
  }
);
const deleteBookmark = tryCatchHandler<
  Request<{ id: string }>,
  Response<{ message: string; status: QueryResult; bookmarks: BookmarkType[] }>
>(
  async (
    req: Request<{ id: string }>,
    res: Response<{
      message: string;
      status: QueryResult;
      bookmarks: BookmarkType[];
    }>
  ) => {
    const status: QueryResult = await BookmarkModules.deleteBookmark(
      Number(req.params.id)
    );
    const bookmarks: BookmarkType[] = await BookmarkModules.getBookmarks(
      req.query
    );
    res
      .status(200)
      .json({ message: "Bookmark deleted successfully", status, bookmarks });
  }
);
export { getBookmarks, getBookmark, addBookmark, deleteBookmark };
