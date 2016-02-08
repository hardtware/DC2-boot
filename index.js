/*
* DC2 discovery server
* Copyright (C) 2016 HARDTWARE / Dick Hardt
*/

var express = require('express')
  , app = express()
  , os = require('os')
  , getmac = require('getmac')
  , request = require('request')

// configuration

var hardtwareURL = 'http://dc2.hardtware.com/version/latest.json'
  , PORT = 8765
  , statusDC2 =
    { version: 1.0              // this is the version of this software
    , latestVersion: 'unknown'  // latest version available
    }

// web server code
function showStatus ( req, res ) {
  // send JSON so it displays nice in browser
  res.setHeader('Content-Type', 'application/json')
  res.send( JSON.stringify( statusDC2, null, 4 ) )
}

app.get('/', showStatus )

app.listen( PORT, function () {
  console.log('Listening on port', PORT)
})





// get the IP address
function getIP () {

  // we are assuming the interface is just the ethernet interface

  var interfaces = os.networkInterfaces()
    , en0 = interfaces && interfaces.en0

console.log('interfaces:', interfaces )

  if (!en0 || !en0.length )
    return('not found')
  for ( var i = 0; i<en0.length; i++ ) {
    if ( en0[ i ].family === 'IPv4' )
      return ( en0[ i ].address )
  }
  return 'not found'
}

// gets MAC address and puts it into status
function getMAC ( done ) {
  statusDC2.MAC = 'pending'
  getmac.getMac( function ( err, macAddress ) {
    if ( err ) {
      statusDC2.MACerror = err
      console.error( err )
      return done()
    }
    statusDC2.MAC = macAddress
    done()
  })
}

// call home
// check for latest version and register for discovery
function callHome () {
  var options =
    { url:   hardtwareURL
    , qs:    statusDC2
    , json:  true
    }
  request( options, function ( error, response, json ) {
    if ( error ) {
      statusDC2.callHomeError = error
      return console.error( error )
    }
    statusDC2.callHomeResponse = response && response.statusCode
    if ( !response || 200 != response.statusCode ) {
      return console.error( response )
    }
    statusDC2.latestVersion = json && json.version
    console.log('status:', statusDC2 )
  })
}

// fetch local config
statusDC2.hostname = os.hostname()
statusDC2.ip = getIP()
getMAC( callHome )


