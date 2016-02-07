/*
* DC2 discovery server
* Copyright (C) 2016 HARDTWARE / Dick Hardt
*/

var express = require('express')
  , app = express()
  , os = require('os')
  , getmac = require('getmac')
  , util = require('util')

// configuration

var hardtwareURL = 'localhost:8765/register'
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
  console.log('status:', statusDC2 )
}

// fetch local config
statusDC2.hostname = os.hostname()
statusDC2.ip = getIP()
getMAC( callHome )


