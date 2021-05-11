// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  // Get year + genre from querystring parameters
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  // If above result is blank, return nope
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Nope!` // a string of data
    }
  }
  // Otherwise, when conditions satisfied, do this...


  // ReturnValue = count + movie array
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }

     // Loop through movies data
    for (let i=0; i < moviesFromCsv.length; i++) {
    // Select each
    let movieresults = moviesFromCsv[i]
    
    
    // Create new post to house info    
        let Post = {
          Title: movieresults.primaryTitle,
          Release_Date: movieresults.startYear,
          Genres: movieresults.genres
    }


// If meets criteria + disregard any //N runtime or genres
if(movieresults.genres.includes(genre) && movieresults.startYear == year && movieresults.runtimeMinutes !== `\\N` && movieresults.genres !== `\\N`){
        // Add to array    
      returnValue.movies.push(Post)
        // Increase counter by 1...can also do other way as shown in class example completed
      returnValue.numResults=returnValue.numResults+1  
    }
  }
    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    body: JSON.stringify(returnValue) // a string of data
    }
  }
}