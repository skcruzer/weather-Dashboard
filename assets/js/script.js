$(document).ready(function () {
  let test = false
  //School key used to get forecast data
  const apiKey = "166a433c57516f51dfab1f7edaed8413"
  let url = 'https://api.openweathermap.org/data/2.5/'
  let requestType = ""
  let query = ""
  //

  //Pull current location
  $('#getWeather,#past-cities').on('click', function () {
    if (test) console.log("on click")
    //Asking user for location from input box
    let e = $(event.target)[0]
    let location = ""

    if (e.id === "getWeather" || e.id === "getWeatherId") {
      if (test) console.log("getWeather")
      location = $('#city-search').val().trim().toUpperCase()
    } else if (e.className === ("cityList")) {
      if (test) console.log("cityList")
      location = e.innerText
    }

    if (test) { console.log('location:' + location) }
    if (location == "") return

    updateCityStore(location)
    getCurWeather(location)
    getForecastWeather(location)
  })

  //Convert the unix epoch to local time
  function convertDate(epoch) {
    if (test) { console.log(`convertData - epoch: ${epoch}`) }
    let readable = []
    let myDate = new Date(epoch * 1000)

    //Local time
    readable[0] = (myDate.toLocaleString())
    readable[1] = ((myDate.toLocaleString().split(", "))[0])
    readable[2] = ((myDate.toLocaleString().split(", "))[1])

    if (test) { console.log(` readable[0]: ${readable[0]}`) }
    return readable
  }

  function getCurLocation() {
    if (test) { console.log("getCurLocation") }

    let location = {}

    function success(position) {
      if (test) { console.log(" success") }
      if (test) { console.log("  location", position) }

      location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        success: true
      }
      if (test) { console.log(" success location", location) }
      getCurWeather(location)
      getForecastWeather(location)
    }

    function error() {
      location = { success: false }
      console.log('Could not get location')
      return location
    }

    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser')
    } else {
      navigator.geolocation.getCurrentPosition(success, error)
    }
  }

  //Current weather conditions
  function getCurWeather(loc) {
    if (test) { console.log("getCurWeather - loc:", loc) }
    if (test) { console.log("getCurWeather - toloc:", typeof loc) }

    drawHistory()
    //Clear search field
    $('#city-search').val("")

    if (typeof loc === "object") {
      city = `lat=${loc.latitude}&lon=${loc.longitude}`
    } else {
      city = `q=${loc}`
    }

    //Set queryURL based on type of query
    requestType = 'weather'
    query = `?${city}&units=imperial&appid=${apiKey}`
    queryURL = `${url}${requestType}${query}`

    //Using AJAX call to grab data in console
    if (test) console.log(`cur queryURL: ${queryURL}`)
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function (response) {
      if (test) console.log(response)

      weatherObj = {
        city: `${response.name}`,
        wind: response.wind.speed,
        humidity: response.main.humidity,
        temp: response.main.temp,
        date: (convertDate(response.dt))[1],
        icon: `http://openweathermap.org/img/w/${response.weather[0].icon}.png`,
        desc: response.weather[0].description
      }

      // Calling to draw search results to page
      drawCurWeather(weatherObj)
      getUvIndex(response)
    })
  }

  