const mysql = require('mysql'); 
const dbconfig = require('./dbconfig.json'); 
const util = require ('util')
const axios = require('axios');
const db = wrapDB(dbconfig)

function wrapDB (dbconfig) { 
    const pool = mysql.createPool(dbconfig) 
    return { 
        query(sql, args) { 
            console.log("in query in wrapper") 
            return util.promisify( pool.query ) 
            .call(pool, sql, args) 
        }, 
        release () { 
            return util.promisify( pool.releaseConnection ) 
            .call( pool ) 
        } 
    } 
}

exports.getCities = async () => { 
    //return await getCitiesInCountry('GBR');
    // Reached Step 3, haven't started it yet
    let cities = []  
      try {  
        const cityResponse = await axios.get('https://countriesnow.space/api/v0.1/countries/population/cities')
        for (let data of cityResponse.data.data) {
          cities.push(data.city)
        }
      } catch (e) {
         return new Error('Could not get cities')
      }
      return cities;
}

exports.addCity = async (newCity) => { 
    let results = await db.query('INSERT INTO city SET ?', newCity) 
    return results.insertId; 
}

getCitiesInCountry = async ( countrycode ) => { 
    return await db.query( 
        "SELECT id, name, countrycode, district, population" 
        + " FROM city WHERE countrycode = ?", 
                            [countrycode]) 
}