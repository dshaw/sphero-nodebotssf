var spheron = require('spheron')

var sphero = spheron.sphero()
	, spheroPort = process.argv[2] || '/dev/cu.Sphero-BYR-RN-SPP' //Change this to match your device
	, COLORS = spheron.toolbelt.COLORS

var roll = sphero.roll;
sphero.roll = function(heading, speed, state, options) {
  sphero.heading = heading;
  roll.apply(this, arguments);
  return this;
};

sphero.stop = function () {
	sphero.roll(0, sphero.heading || 0, 0);
}

sphero.repl = function () {
	var context = require('repl').start('Sphero > ').context

	context.dev = spheroPort
	context.spheron = spheron
	context.toolbelt = spheron.toolbelt
	context.commands = spheron.commands
	context.COLORS = spheron.COLORS

	context.o = { resetTimeout: true, requestAcknowledgement: true }
	context.sphero = sphero

	context.sphero.on('error', function(error) {
	  console.log('Sphero error:', error)
	})
}

sphero.on('open', function onOpen () {
	console.log('Connection to Sphero open')

	sphero.repl()

  sphero.setRGB(COLORS.BLUE, false)
  sphero.heading = 90
  sphero.roll(128, 90, 1)
	sphero.setRGB(COLORS.PINK, false)
	sphero.roll(128, 90, 1)
	
	sphero.stop()
})

console.log('Attempting to connect to Sphero on', spheroPort)
sphero.open(spheroPort)
