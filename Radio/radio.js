var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = 3000;
 
app.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html');
});
app.get('/radio2', function(req, res){
	res.sendfile(__dirname + "/radio2.html");
});
 
io.on('connection',function(socket){
	console.log("usuario id : %s",socket.id);
 
	var radio = 'Sala-a';
 
	socket.broadcast.emit('message','El usuario '+socket.id+' se ha conectado!','Servidor');
 
	socket.join(radio);
 
	socket.on('message',function(msj){
		io.sockets.in(radio).emit('message',msj,socket.id); 
	});
 
	socket.on('disconnect',function(){
		console.log("Desconectado : %s",socket.id);
	});
 
	socket.on('change radio',function(newradio){
		socket.leave(radio);
		socket.join(newradio);
		radio = newradio;
		socket.emit('change radio',newradio);
	});
 
});
 
http.listen(PORT,function(){
	console.log('el servidor esta escuchando el puerto %s',PORT);
});