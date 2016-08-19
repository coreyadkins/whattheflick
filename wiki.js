//Module for getting 'clues' from wikipedia, EG flags or language


/**
* Uses the object from the flickr request to get information from wikipedia to
* generate a request for the wikipedia information. Returns a promise.
*/
function getCountryClues() {
  var PARAMS = {
    action: 'query', titles: 'Germany', format: 'json',
    prop: 'pageimages'
  };
  var url = 'https://en.wikipedia.org/w/api.php'
  return Promise.resolve($.ajax({
    dataType: 'jsonp',
    url: url,
    data: PARAMS
    }));
}

getCountryClues().then(function(fromJSON) {
  console.log(fromJSON)
});


// url from sandbox
// https://en.wikipedia.org/w/api.php?action=query&titles=Germany&prop=revisions&rvprop=content&format=json
// pulls image names, close but no cigar
// https://en.wikipedia.org/w/api.php?action=query&titles=Germany&format=json&prop=images


// test stuff
var country = 'Germany'
