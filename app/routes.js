const express = require('express')
const citydata = require('./citydata.js')
const router = express.Router()

// Run this code when a form is submitted to 'juggling-balls-answer'
router.post('/juggling-balls-answer', function (req, res) {

  // Make a variable and give it the value from 'how-many-balls'
  var howManyBalls = req.session.data['how-many-balls']

  // Check whether the variable matches a condition
  if (howManyBalls == "3 or more") {
    // Send user to next page
    res.redirect('/juggling-trick')
  } else {
    // Send user to ineligible page
    res.redirect('/ineligible')
  }
})

router.get('/list-cities', async (req, res) => { 
  res.render('list-cities', { cities: await citydata.getCities() } ) 
});

router.get('/list-cities-containing/:substr', (req, res) => {
  res.render('list-cities', {
    namefilter: req.params.substr.toLowerCase(),
    cities: citydata.getCities()
  });
});

router.get('/addcity', function (req, res) {
  res.render('newcityform');
});

router.post('/addcity', async (req, res) => {
  var city = req.body
  var countrycode = req.body.countrycode;
  if(!countrycode.search(/^(GBR|IRL)$/)){ 
    let insertedKey = await citydata.addCity(req.body) 
    res.render('list-cities', { cities: await citydata.getCities()} ) 
} else { 
    res.locals.errormessage = "Country code must be GBR or IRL" 
    res.render('newcityform', req.body ) 
  }})

module.exports = router
