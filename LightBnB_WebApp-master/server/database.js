const properties = require('./json/properties.json');
const users = require('./json/users.json');


// PSQL
const { Pool } = require('pg');

const pool = new Pool({
  user: 'juliman',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool.query(`
  SELECT * FROM users
  WHERE email = $1`, [email])
    .then(res => res.rows[0])
  //   let user;
  //   for (const userId in users) {
  //     user = users[userId];
  //     if (user.email.toLowerCase() === email.toLowerCase()) {
  //       break;
  //     } else {
  //       user = null;
  //     }
  //   }
  //   return Promise.resolve(user);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool.query(`
  SELECT * FROM users
  WHERE id = $1 `, [id])
    .then(res => res.rows[0])
  // return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)`, [user.name, user.email, user.password])
    .then(res => res.rows[0])
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool.query(`
  SELECT properties.* FROM reservations
  JOIN users ON reservations.guest_id = users.id
  JOIN properties ON reservations.property_id = properties.id
  WHERE reservations.guest_id = $1
  LIMIT $2  
  `, [guest_id, limit])
    .then(res => res.rows)
  // return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  const queryParams = [];
  // console.log('options', options)
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length}`;
  }


  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    if (options.city) {
      queryString += ` AND properties.owner_id = $${queryParams.length}`;
    } else {
      queryString += `WHERE properties.owner_id = $${queryParams.length}`;
    }
  }


  if (options.maximum_price_per_night) {
    // console.log("maxprice", options.maximum_price_per_night)
    queryParams.push(`${options.maximum_price_per_night}` * 100);
    // console.log('params:', queryParams)
    if (queryParams.length > 1) {
      queryString += ` AND properties.cost_per_night <= $${queryParams.length}`;
    } else {
      queryString += `WHERE properties.cost_per_night <= $${queryParams.length}`;
    }
  }


  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}` * 100);
    if (queryParams.length > 1) {
      queryString += ` AND properties.cost_per_night >= $${queryParams.length}`;
    } else {
      queryString += `WHERE properties.cost_per_night >= $${queryParams.length}`;
    }
  }


  queryParams.push(limit);
  queryString +=
    `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // console.log('querys', queryString, 'params:', queryParams);

  return pool.query(queryString, queryParams)
    .then(res => {
      // console.log('res', res.rows)
      return res.rows
    });

  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  return pool.query(`
  INSERT INTO properties (
    title, 
    description, 
    owner_id, 
    cover_photo_url, 
    thumbnail_photo_url, 
    cost_per_night, 
    parking_spaces, 
    number_of_bathrooms, 
    number_of_bedrooms, 
    active, 
    province, 
    city, 
    country, 
    street, 
    post_code

    ) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
    [
      property.title,
      property.description,
      property.owner_id,
      property.cover_photo_url,
      property.thumbnail_photo_url,
      property.cost_per_night,
      property.parking_spaces,
      property.number_of_bathrooms,
      property.number_of_bedrooms,
      true,
      property.province,
      property.city,
      property.country,
      property.street,
      property.post_code
    ]
  )
    .then(res => res.rows[0])



  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
}
exports.addProperty = addProperty;
