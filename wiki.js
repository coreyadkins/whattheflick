//Module for getting 'clues' from wikipedia, EG flags or language

// test stuff
var country = {country: 'Germany'};



/**
* Uses the object from the flickr request to get information from wikipedia to
* generate a request for the wikipedia information. Returns a promise.
*/
function getCountryClues(flickrCountry) {
  var PARAMS = {
    'action': 'query', 'titles': flickrCountry['country'], format: 'json',
    prop: 'pageimages'
  };
  var url = 'https://en.wikipedia.org/w/api.php'
  return Promise.resolve($.ajax({
    dataType: 'jsonp',
    url: url,
    data: PARAMS
    }));
}

/**
* sends the request out for things
*/
var urlOutput = getCountryClues(country).then(function(fromJSON) {
  console.log(fromJSON)
  return stripUrlFromJson(fromJSON)
});


/**
* takes in the JSON obj returned from wikipedia and strips it down to the
* url for the thumbnail
*/
function stripUrlFromJson(jsonObj) {
  var siteIDArray = Object.keys(jsonObj.query.pages);
  console.log(siteIDArray);
  var siteID = siteIDArray[0];
  console.log(siteID)
  var output = jsonObj.query.pages[siteID].thumbnail.source;
  console.log(output);
  return output
}

// url from sandbox
// https://en.wikipedia.org/w/api.php?action=query&titles=Germany&prop=revisions&rvprop=content&format=json
// pulls image names, close but no cigar
// https://en.wikipedia.org/w/api.php?action=query&titles=Germany&format=json&prop=images
