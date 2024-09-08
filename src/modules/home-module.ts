import pool from "../utilities/mysql_dstabase";
import { HotelType } from "./hotels-module";

export type HomeDataType = {
  hotels: HotelType[];
};

class HomeModules {
  static getHomeData = async (): Promise<HomeDataType> => {
    const [hotels] = await pool.query("SELECT * FROM hotels");
    const hotelsChangeType = hotels as HotelType[];
    const homeData = {
      hotels: hotelsChangeType,
    };
    return homeData;
  };
}

export default HomeModules;
