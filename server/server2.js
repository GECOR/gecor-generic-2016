const port        = 3357;
var io = require('socket.io')(port);
const sql = require('mssql');
const config = require('./config/constants');

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
      client.broadcast.in(msg.AvisoID).emit('onMessage', msg);
      //client.in('laneros').emit('LALOS', data);

      //send to SQL Server
      addMessage(msg);
    });

    client.on('disconnect', () => {
        console.log('El servidor fue desconectado');
    });

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
});
console.log('Sockets server running');
