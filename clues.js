'use strict';
// A module the uses the rest countries api to provide a list of clues
// returns a promise

/**
* gets a block of JSON with various useful facts to use as clues
*/
function getCountryInfo(country) {
  var url = 'https://restcountries.eu/rest/v1/name/' + country;
  return Promise.resolve($.ajax({
    url: url, 'async': true, 'crossDomain': true
  }));
}

// getCountryInfo(countryName).then(thingToDoWhenCluesArrive);
