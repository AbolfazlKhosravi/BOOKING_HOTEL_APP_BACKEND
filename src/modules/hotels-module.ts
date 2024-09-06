import pool from "../utilities/mysql_dstabase";

export interface HotelType {
  id: number;
  pictuer_url: string;
  smart_location: string;
  name: string;
  price: number;
}

class HotelsModules {
  static getHotels = async (): Promise<HotelType[]> => {
    const [result] = await pool.query("SELECT * FROM hotels;");
    return result as HotelType[];
  };
}

export default HotelsModules;
