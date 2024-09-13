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
  latitude:string;
  longitude:string;
}

class HotelsModules {
  static getHotels = async (queryStr: QueryType): Promise<HotelType[]> => {
    let query: string = "SELECT h.* FROM hotels as h";
    const value: (string | number)[] = [];

    const orConditionsOn: string[] = [];

    query += buildJoinOptions(queryStr, orConditionsOn, value);
    query += buildJoinReservations(queryStr);
    query += buildWhereClause(queryStr, value);
    query += buildGroupByHaving(queryStr, value);

    const [result] = await pool.query(query, value);
    return result as HotelType[];
  };
}

const buildJoinOptions = (
  queryStr: QueryType,
  orConditionsOn: string[],
  value: (string | number)[]
): string => {
  if (queryStr.options && queryStr.options.length) {
    queryStr.options.forEach((item) => {
      if (item.count && item.title) {
        orConditionsOn.push(`(o.title = ? and o.max_limit >= ?)`);
        value.push(item.title, parseInt(item.count));
      }
    });
    return ` LEFT JOIN options as o  on h.id = o.hotel_id AND (${orConditionsOn.join(
      " OR "
    )})`;
  } else {
    return "";
  }
};
const buildJoinReservations = (queryStr: QueryType): string => {
  if (
    queryStr.date &&
    queryStr.date.endDate &&
    queryStr.date.startDate &&
    queryStr.date.startDate?.split("T")[0] !==
      queryStr.date.endDate?.split("T")[0]
  ) {
    return ` LEFT JOIN reservations as r on h.id = r.hotel_id`;
  } else {
    return "";
  }
};
const buildWhereClause = (
  queryStr: QueryType,
  value: (string | number)[]
): string => {
  const orConditions: string[] = [];
  const andConditions: string[] = [];

  let whereClause: string = "";

  if (queryStr.destination) {
    andConditions.push(
      "(MATCH(smart_location, name, summary,description,street,city,state,country) AGAINST(? IN BOOLEAN MODE))"
    );
    value.push(`+${queryStr.destination}*`);
  }
  if (andConditions.length || orConditions.length) {
    whereClause += ` WHERE`;
    if (orConditions.length) {
      whereClause += ` (${orConditions.join(" OR ")})`;
    }
    if (andConditions.length) {
      if (orConditions.length) {
        whereClause += " AND";
      }
      whereClause += ` (${andConditions.join(" AND ")})`;
    }
  }
  return whereClause;
};
const buildGroupByHaving = (
  queryStr: QueryType,
  value: (string | number)[]
): string => {
  let havingClause: string = "";
  if ((queryStr.options && queryStr.options.length) || queryStr.date) {
    havingClause += ` GROUP BY h.id HAVING `;
    if (queryStr.options && queryStr.options.length) {
      havingClause += ` COUNT(DISTINCT o.title)=${queryStr.options?.length} `;
    }
    if (
      queryStr.date &&
      queryStr.date.endDate &&
      queryStr.date.startDate &&
      queryStr.date.startDate?.split("T")[0] !==
        queryStr.date.endDate?.split("T")[0]
    ) {
      if (queryStr.options && queryStr.options.length) {
        havingClause += ` And `;
      }
      havingClause += ` SUM(CASE WHEN (STR_TO_DATE(?,'%Y-%m-%d') < r.check_out And STR_TO_DATE(?,'%Y-%m-%d') > r.check_in ) THEN 1 ELSE 0 END)=0`;
      value.push(
        queryStr.date.startDate?.split("T")[0],
        queryStr.date.endDate?.split("T")[0]
      );
    }
  }
  return havingClause;
};

export default HotelsModules;
