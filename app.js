'use strict';

var gm = require('gm')
var express = require('express')
var compress = require('compression')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var helmet = require('helmet')

var port = process.env.PORT || 5000
var app = module.exports = express()

app.use(compress())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet.xssFilter())
app.use(helmet.nosniff())
app.use(methodOverride())

var isNumeric = function (value) {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

var rand255 = function () {
  return Math.floor(Math.random() * 255)
}

app.get('/', function (req, res) {
  res.status(200).send('ok')
})

app.get('/:width/:height/:id', function (req, res) {
  var w = req.params.width
  var h = req.params.height

  if (!isNumeric(w) || !isNumeric(h)) {
    res.status(500).send('Bad Param!')
  }

  gm('logo.png')
    .extent(w, h)
    .colorize(rand255(), rand255(), rand255())
    .autoOrient()
    .flatten()
    .stream(function (err, stdout, stderr) {
      if (err) {
        console.log(err, stderr)
      } else {
        console.log('Gen')
        stdout.pipe(res)
      }
    })
})

app.listen(port, function() {
  console.log('server start:' + port)
})
