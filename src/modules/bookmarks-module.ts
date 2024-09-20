import { BookmarkFrontType } from "../controllers/bookmark-controller";
import pool from "../utilities/mysql_dstabase";
export interface BookmarkType {
  id: number;
  city_name: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  host_location: string;
}

class BookmarkModules {
  static getBookmarks = async (queryStr: {}): Promise<BookmarkType[]> => {
    let query: string = "SELECT * FROM bookmarks";
    if (queryStr) {
      query += "";
    }
    const [result] = await pool.query(query);
    return result as BookmarkType[];
  };
  static getSingleBookmark = async (id: number): Promise<BookmarkType[]> => {
    const [result] = await pool.query("SELECT * FROM bookmarks  WHERE id =?", [
      id,
    ]);
    return result as BookmarkType[];
  };
  static addBookmark = async (data: BookmarkFrontType) => {
    const [retult] = await pool.query(
      "INSERT INTO bookmarks (city_name,country,country_code,latitude,longitude,host_location) VALUE (?,?,?,?,?,?)",
      [
        data.cityName,
        data.country,
        data.countryCode,
        data.lat,
        data.lon,
        data.hostLocation,
      ]
    );

    return retult;
  };
}

export default BookmarkModules;
