const path = require("path");
const express = require("express");
const app = express(); // create express app

const http = require('http').createServer(app);
const io = require('socket.io')(http);

// add middlewares
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

// start express server on port 5000
http.listen(5000, () => {
  console.log("server started on port 5000 for the backgammon game");
});


io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log("server: user disconnected: " + socket.id);
    //console.log('user disconnected: ' + socket.id + ", current White: " + this.whitePlayer + ", current Black: " + this.blackPlayer);
    // if(this.whitePlayer === socket.id)
    //     this.whitePlayer = undefined;
    //   else if(this.blackPlayer === socket.id)
    //     this.blackPlayer = undefined;
  });

  // if(this.whitePlayer === undefined) {
  //   console.log('First user user connected to play backgammon: ' + socket.id);
  //   this.whitePlayer = socket.id;
  //   let idObj = {
  //     socketId: socket.id,
  //     playerIdent: 1
  //   }
  //   socket.emit('your id', idObj);
  // } else if(this.blackPlayer === undefined) {
  //   console.log('Second user connected to play backgammon: ' + socket.id);
  //   this.blackPlayer = socket.id;
  //   let idObj = {
  //     socketId: socket.id,
  //     playerIdent: 2
  //   }
  //   socket.emit('your id', idObj);
  // } else {
  //   console.log("Two players are already playing. Wait your turn");
  //   return;
  // }

  socket.on('pieceselected', (index) => {
    console.log("pieceselected on server received: " + index);
    socket.broadcast.emit('pieceselected', index);
  });

  socket.on('piecemoved', (destinationIndex, handler) => {
    console.log("piecemoved on server received: " + destinationIndex + ", " + handler);
    socket.broadcast.emit('piecemoved', destinationIndex, handler); // io.emit would work too, but it goes to all clients
    
  });
  
  socket.on('joinGame', (name) => {
    console.log("Server: joinGame on the server received");
    if(this.whitePlayer === undefined) {
      console.log('--- First user user connected to play backgammon: ' + socket.id);
      this.whitePlayer = socket.id;
      this.whitePlayerName = name;
      
      let idObj = {
        socketId: socket.id,
        playerIdent: 1,
        name: name
      }
      socket.emit('your id', idObj);
    } else if(this.blackPlayer === undefined) {
      console.log('Second user connected to play backgammon: ' + socket.id);
      this.blackPlayer = socket.id;
      this.blackPlayerName = name;

      let idObj = {
        socketId: socket.id,
        playerIdent: 2,
        name: name
      }
      socket.emit('your id', idObj);
    } else {
      console.log("Two players are already playing. Wait your turn");
      return;
    }

    socket.broadcast.emit('playerJoinGame', name); 
  });
  socket.on('newgame', () => {
    console.log("Newgame started message on server received");
    socket.broadcast.emit('newgame'); 
  });
  socket.on('message', (msg) => {
    console.log("message on server received: " + msg);
    socket.broadcast.emit('message', msg); // io.emit would work too, but it goes to all clients
  });
  socket.on('player', (player) => {
    console.log("message on server received: player: " + player);
    socket.broadcast.emit('player', player); // io.emit would work too, but it goes to all clients
  });
  socket.on('getOpponent', (playerID) => {
    
    if(playerID === this.whitePlayer) {
      console.log("Server: getOpponent on server received: playerID: " + this.whitePlayerName);
      socket.emit('getOpponent', this.blackPlayerName);
    } else if(playerID === this.blackPlayer) {
      console.log("Server: getOpponent on server received: playerID: " + this.blackPlayerName);
      socket.emit('getOpponent', this.whitePlayerName);
    }
  });
});

