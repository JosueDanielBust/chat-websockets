let express = require('express');
let cookieParser = require('cookie-parser');
let cors = require('cors');
let helmet = require('helmet');
let WebSocket = require('ws');

if ( process.env.NODE_ENV != 'production' ) {
  require('dotenv').config();
}
let config = require('./config');
let app = express();

app.set( 'view engine', 'pug' );

app.use( helmet() );
app.use( cors() );
app.use( cookieParser() );
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

//#region UI Router
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(req, res) {
  res.render( 'home' );
});
//#endregion

//#region 404 Error
app.use(function(req, res, next) {
  res.status(404).send( { error: true, message: '404 - Not found' } );
});
//#endregion

//#region Starting Web Server
app.listen( `${ config.port }`, function() {
  console.log( `GUI is running on port ${ config.port }` );
});
//#endregion

//#region Starting WebSocket Server
const wss = new WebSocket.Server({
  port: `${ config.wss }`
});

wss.on('connection', function connection( ws ) {
  ws.on('message', function incoming( data, isBinary ) {
    wss.clients.forEach( function each(client) {
      if ( client.readyState === WebSocket.OPEN ) {
        client.send(data, { binary: isBinary });
      }
    });
    console.log( '[WS]: %s', data );
  });

  ws.send(JSON.stringify({ client: 'Server', message: 'Welcome! Enjoy the conversation!' }));
});
//#endregion

module.exports = app;