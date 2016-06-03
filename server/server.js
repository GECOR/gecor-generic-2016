'use strict';

const Hapi        = require('Hapi');
const server      = new Hapi.Server();
const port        = 3357;
server.connection({ port: port, routes: { cors: true } });

const io          = require('socket.io')(server.listener);
const SocketIoJwt = require('socketio-jwt');
const _           = require('lodash');
const chalk       = require('chalk');
const sql         = require('mssql');
//const moment      = require('moment');

//const _items      = require('./config/constats');
const config      = require('./config/constants');
let connections   = [];

server.route(require('./routes/api'));

io.sockets.on('connection', SocketIoJwt.authorize({
  secret: config.secret,
  timeout: 15000
})).on('authenticated', (socket) => {
  socket.id = socket.decoded_token.id;
  socket.name = socket.decoded_token.name;
  socket.avisoID = socket.decoded_token.avisoID;
  
  //console.log('|=======================> authenticated "socket.decoded_token" <=======================|');
  //console.log(socket.decoded_token);
 
  connections.push(socket);
  //cambiar por room's
  socket.join(socket.avisoID);
  
  console.log(chalk.green('User', socket.name, '(' + socket.id + ') connected.'));

  emitOnlineUsers();

  socket.on('disconnect', () => {
    /*
    console.log(chalk.red('User', socket.name, '(' + socket.id + ') disconnected'));
    connections.splice(connections.indexOf(socket), 1);
    socket.leave(socket.avisoID);
    emitOnlineUsers();
    */
    disconnectUser(socket);
  });
  
  socket.on('leave', () => {
    disconnectUser(socket);  
  });

  socket.on('sendMessage', (msg, cb) => {
    //let index = _.findIndex(connections, (c) => { return c.id === msg.recipient.id });
    //console.log('|=======================> sendMessage "msg" <=======================|');    
    //console.log(msg); 
    
    //console.log('|=======================> sendMessage "cb" <=======================|');    
    //console.dir(cb);    
    
    //connections[index].emit('onMessage', msg);
    
    //io.sockets.in(socket.avisoID).emit('onMessage', msg);
    
    //io.sockets.emit('onMessage', msg);//WORK
    
    //io.sockets.in(socket.avisoID).emit('onMessage', msg);//DON'T WORk
    
    //io.sockets.to(socket.avisoID).emit('onMessage', msg);//DON'T WORk
     
    //socket.broadcast.in(socket.avisoID).emit('onMessage', msg);    
    //io.sockets.to(socket.avisoID).emit('onMessage', msg);    
    
    
    //send to SQL Server
    addMessage(msg);
    
    connections.forEach((socket) => {
    //console.log(socket.avisoID === msg.AvisoID && socket.id != msg.UsuarioID);
      if(socket.avisoID === msg.AvisoID)
        socket.emit('onMessage', msg);
    });             
    
    return cb({status: true});
  });

  function emitOnlineUsers() {
    connections.forEach((socket) => {
      socket.emit('onlineUsers', onlineUsers(socket));
    });
  }

  function onlineUsers(socket) {
    let friends = connections.slice();
    friends = _.remove(friends, (friend) => {
      return friend.id !== socket.id;
    });
    return _.map(friends, (obj) => { return _.pick(obj, 'id', 'name', 'avatar'); });
  }
  
  function addMessage(message) { 
        
    new sql.Connection(config.sql_config_azure).connect().then((conn) => {
        // Query      
        new sql.Request(conn)
          .input('avisoID', sql.Int, message.AvisoID)
          .input('userID', sql.Int, message.UsuarioID)
          .input('dateTime', sql.DateTime, new Date())
          .input('message', sql.VarChar, message.Mensaje)
          .query(config.sql_insert_querry).then((recordset) => {
              //console.dir(recordset);              
              //console.log('|=======================> Try Close connection <=======================|');
              conn.close();
              //console.log('|=======================> Connection Closed! <=======================|');
          }).catch((err) => {// ... error checks
            console.log('Query ERR '+err);
          });
      }).catch((err) => {// ... error checks
        console.log('Conn ERR '+err, err.stack.split("\n"));
      });
  }
  
  function disconnectUser(socket) {
    console.log(chalk.red('User', socket.name, '(' + socket.id + ') disconnected'));
    connections.splice(connections.indexOf(socket), 1);
    socket.leave(socket.avisoID);
    emitOnlineUsers();
  }
  
});

server.start(() => {
  console.log(chalk.green('Server running at port', port));   
});
