'use strict';

const gm = require('gm')
const express = require('express')
const morgan = require('morgan')
const compress = require('compression')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const helmet = require('helmet')

const app = module.exports = express()
const port = process.env.PORT || 5000

const rand255 = () => Math.floor(Math.random() * 200)

app
  .use(morgan('combined'))
  .use(compress())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(helmet.xssFilter())
  .use(helmet.nosniff())
  .use(methodOverride())
  .get('/', (req, res) => res.status(200).send('ok'))
  .get('/:width(\\d+)/:height(\\d+)/:id(\\d+)', (req, res) => {
    res.setHeader('Content-Type', 'image/png')

    gm('logo.png')
      .options({ imageMagick: true })
      .extent(req.params.width, req.params.height)
      .colorize(rand255(), rand255(), rand255())
      .autoOrient()
      .stream((err, stdout, stderr) => {
        if (err) console.log(err, stderr)
        else stdout.pipe(res)
      })
  })
  .listen(port, () => console.log('Express server started!! on port: ' + port))
