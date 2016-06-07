const port        = 3357;
var io = require('socket.io')(port);

io.on('connection', (client) => {
  console.log('Cliente conectado');
    //client.join('laneros');

    client.on('create', (room) => {
      console.log('Cliente conectado: ', room);
      client.join(room);
    });

    client.on('leave', (room) => {
      console.log('Cliente desconectado: ', room);
      client.leave(room);
    });

    client.on('sendMessage', (msg) => {
      console.log('Chat recibido: ', msg);
        client.broadcast.in(room).emit('onMessage', msg);
        //client.in('laneros').emit('LALOS', data);
    });

    client.on('disconnect', () => {
        console.log('El servidor fue desconectado');
    });
});
console.log('Sockets server running');
