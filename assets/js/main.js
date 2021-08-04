(function() {
  let chat = new Vue({
    el: '#chat',
    data: {
      ws: null,
      msg: '',
      client: new Date().valueOf(),
      messages: [],
    },
    created: function() {
      console.log('[WS]: Starting');
      this.ws = new WebSocket('ws://127.0.0.1:3001');

      this.ws.onmessage = function( event ) {
        chat.messages.push( JSON.parse( event.data ) );
        console.log( '[WS]: Message received:', event );
      }
      
      this.ws.onopen = function( event ) {
        console.log( '[WS]: Connected' );
      }

      this.ws.onclose = function( event ) {
        console.log( '[WS]: Socket closed' );
      }

      this.ws.onerror = function( event ) {
        console.log( '[WS]: Error ocurred, Socket closed' );
        alert( '[WS]: Error ocurred, Socket closed' );
      }
    },
    methods: {
      sendMessage: function( msg ) {
        if ( msg.length > 0 ) {
          let message = JSON.stringify({
            client: `${ this.client }`,
            message: `${ this.msg }`
          });
          this.ws.send( message );
        }
        this.msg = '';
      },
    }
  });
})();