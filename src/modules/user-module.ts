import pool from "../utilities/mysql_dstabase";
export interface UserType {
  id:string
  name: string;
  email: string;
  password: string;
}
export interface ResultAddUserType {
  insertId: number;
}
class UsersModels {
  static insertUser = async (name:string, email:string, password:string):Promise<ResultAddUserType> => {
    const [result] = await pool.query(
      "insert into users (id,name , email ,password) values (uuid(),?,?,?)",
      [name, email, password]
    );
    return result as ResultAddUserType ;
  };

  static getUsersByEmail = async (email:string):Promise<UserType[]> => {
    const [result] = await pool.query("select * from users where email = ? ",[email]);
    return result as UserType[];
  };
  static getUsersById = async (id:string):Promise<UserType[]> => {
    const [result] = await pool.query("select * from users where id = ? ",[id]);
    return result as UserType[];
  };
}

export default UsersModels;
