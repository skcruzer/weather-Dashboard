$(document).ready(function () {
  let test = false
  //School key used to get forecast data
  const apiKey = "166a433c57516f51dfab1f7edaed8413"
  let url = 'https://api.openweathermap.org/data/2.5/'
  let requestType = ""
  let query = ""
  //

  // pull current location
  $('#getWeather,#past-cities').on('click', function () {
    if (test) console.log("on click")
    // Asking user for location from input box
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

  // convert the unix epoch to local time
  function convertDate(epoch) {
    if (test) { console.log(`convertData - epoch: ${epoch}`) }
    let readable = []
    let myDate = new Date(epoch * 1000)

    // local time
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

  