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

getCitiesInCountry = async (countrycode) => { 
    try {  
        const cityResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/cities', {"country": countrycode})
        return cityResponse.data.data
      } catch (e) {
         return new Error('Could not get cities')
      }
}

exports.addCity = async (newCity) => { 
    let results = await db.query('INSERT INTO city SET ?', newCity) 
    return results.insertId; 
}


exports.getCities = async () => { 
    return await getCitiesInCountry('United Kingdom'); 
}