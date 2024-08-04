"use strict"

const db = require("../db");
const bycrypt = require("bcrypt");
const { sqlForPartialUpdate } = require(".../helpers/sql");
const {
    NotFoundError,
    BadquestError,
    UnauthorizedError,

} = require("../expressError");

const {BYCRPT_WORK_FACTOR} = require("../config.js");

/** related funcitons for users. */

class User {
    /** authenticfate user with username, password. 
     * returns {username, first_name, last_name, email, is_admin}
     * Throws UnatorizedError is user not found or wrong password. **/

 static async authenticate(username,password) {
    //try to find the user first
    const resutl =await db.query(
        'SELECT username,
        password,
        first_name AS "firstName',
        last_name AS "lastName",
        email,
    FROM users
    WHERE username = $1',
    [username],
);

const user = result.rows[0];

if (user){
    //compare hased passwrod to a new has from passwrod
    const isValid = await bcrypt.compare(password, user.password);
    if(isValid === true){
        delet user.password;
        return user;
    }
}

throw new UnauthorizedError("Invalid username/password");

}

/**register user with data 
 * 
 * returns {username, firstName, lastName, email, is_admin}
 * 
 * Thros BadrequestError on duplicates.
 */

static async register(
    {username, password, firstName, lastName, email, isadmin}
) {
    const duplicateCheck = await db.query(
        'SELECT username
        FROM users
        WHERE username = $1',
        [username],
    );

if (duplicateCheck.rows[0]) {
    throw new BadRequestError('Duplicate username: ${username');
}

const hashedPassword = await bycrypt.hash(password, BYCRYPT_WORK_FACTOR);

const result = await db.query(
    'INSERT INTO users
    (username,
        password,
        first_name,
        last_name,
        email,
        is_admin)
        VALUES ($1, $,2 $3, $4, $5, $6)
        RETURNING username, first_name AS "firstName",
        last_name AS "lastName", email, is_admin AS "isAdmin",
        [
            username,
          hashedPassword,
          firstName,
          lastName,
          email,
          isAdmin,  
        ]
);

const user = result.rows [0];
return user;
}

  /** Find all users.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   **/

  static async findAll(){
    const result = await db.query(
        'SELECT username,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        is_admin AS "isAdmin"
        FROM users
        ORDER BY username',
    );

    return result.rows;
  }

   /** Given a username, return data about user.
   *
   * Returns { username, first_name, last_name, is_admin, jobs }
   *   where jobs is { id, title, company_handle, company_name, state }
   *
   * Throws NotFoundError if user not found.
   **/

   static async get (username) {
    const users = await db.query(
        'SELECT suername,
        first_name As "fistName',
        last_name AS "lastName",
        email,
        is_admin AS "isAdmin",
        FROM users
        WHERE username = $1,
        [username],
    );
   }

 }   


}