/*!
 * sphero-nodebotssf
 * Copyright(c) 2013 Daniel D. Shaw, http://dshaw.com
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var serialport = require('serialport')
	, spheron = require('spheron')

/**
 * Configuration
 */

var sphero = spheron.sphero()
	, spheroPort = process.argv[2]
	, COLORS = spheron.toolbelt.COLORS

sphero.stop = function () {
	sphero.roll(0, 0, 0);
}

sphero.repl = function () {
	var context = require('repl').start('Sphero > ').context

	context.dev = spheroPort
	context.spheron = spheron
	context.toolbelt = spheron.toolbelt
	context.commands = spheron.commands
	context.COLORS = spheron.toolbelt.COLORS

	context.o = { resetTimeout: true, requestAcknowledgement: true }
	context.sphero = sphero

  context.forward = function (speed) {
    var speed = speed || 100;
    sphero.roll(speed,0,1);
  }

  context.right = function (speed) {
    var speed = speed || 100;
    sphero.roll(speed,90,1);
  }

  context.back = function (speed) {
    var speed = speed || 100;
    sphero.roll(speed,180,1);
  }

  context.left = function (speed) {
    var speed = speed || 100;
    sphero.roll(speed,270,1);
  }

  context.stop = function () {
    sphero.roll(0,0,1);
  }

	context.sphero.on('error', function(error) {
	  console.log('Sphero error:', error)
	})
}

sphero.square = function (speed) {
	speed || (speed = 180)

	sphero.setRGB(COLORS.BLUE, false)
	sphero.roll(speed, 0, 1)

	setTimeout(function () {
		sphero.setRGB(COLORS.GREEN, false)
  	sphero.roll(speed, 90, 1)

  	setTimeout(function () {
			sphero.setRGB(COLORS.YELLOW, false)
  		sphero.roll(speed, 180, 1)

  		setTimeout(function () {
				sphero.setRGB(COLORS.PINK, false)
				sphero.roll(speed, 270, 1)

				setTimeout(function () {
					sphero.stop()
				}, 1000)
			}, 1000)
		}, 1000)
	}, 1000)
}


sphero.on('open', function onOpen () {
	console.log('Connection to Sphero open')

	sphero.repl()

	sphero.square()
})

function openPort (port) {
	console.log('Attempting to connect to Sphero on', port)
 	sphero.open(port)
}

if (spheroPort) {
	openPort(spheroPort)
} else {
	console.log('Discovering Sphero comName')

	serialport.list(function (err, ports) {
	  var spheroPorts = ports.reduce(function(coms, port) {
	    if (/Sphero/.test(port.comName)) coms.push(port.comName)
	   	return coms
	  }, [])
	  spheroPort = spheroPorts[0]
	  openPort(spheroPort)
	})
}
