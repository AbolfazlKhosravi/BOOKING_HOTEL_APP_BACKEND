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
  static getBookmarks = async (queryStr:{}): Promise<BookmarkType[]> => {
    let query:string = "SELECT * FROM bookmarks"
    if(queryStr){
        query += ""
    }
    const [result] = await pool.query(query);
    return result as BookmarkType[];
  };
}

export default BookmarkModules;
