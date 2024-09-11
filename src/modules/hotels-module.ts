import { QueryType } from "../controllers/hotels-controller";
import pool from "../utilities/mysql_dstabase";

export interface HotelType {
  id: number;
  pictuer_url: string;
  smart_location: string;
  name: string;
  price: number;
  summary: string;
  description: string;
  street: string;
  city: string;
  state: string;
  country: string;
}

class HotelsModules {
  static getHotels = async (queryStr: QueryType): Promise<HotelType[]> => {
    let query: string = "SELECT h.* FROM hotels as h";
    const value: (string | number)[] = [];
    const orConditions: string[] = [];
    const andConditions: string[] = [];

    if (queryStr.options && queryStr.options.length) {
      query += ` JOIN options as o  on h.id = o.hotel_id `;

      queryStr.options.forEach((item) => {
        if (item.count && item.title) {
          orConditions.push(`(o.title = ? and o.max_limit >= ?)`);
          value.push(item.title, parseInt(item.count));
        }
      });
    }

    if (queryStr.destination) {
      andConditions.push(
        "(MATCH(smart_location, name, summary,description,street,city,state,country) AGAINST(? IN BOOLEAN MODE))"
      );
      value.push(`+${queryStr.destination}*`);
    }
    if (andConditions.length || orConditions.length) {
      query += ` WHERE`;
      if (orConditions.length) {
        query += ` (${orConditions.join(" OR ")})`;
      }
      if (andConditions.length) {
        if (orConditions.length) {
          query += " AND";
        }
        query += ` (${andConditions.join(" AND ")})`;
      }
    }

    if (queryStr.options && queryStr.options.length) {
      query += ` GROUP BY h.id HAVING COUNT(DISTINCT o.title)=${queryStr.options?.length} `;
    }

    console.log(query, value);

    const [result] = await pool.query(query, value);

    return result as HotelType[];
  };
}

export default HotelsModules;
