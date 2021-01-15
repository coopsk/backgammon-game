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
    console.log('user disconnected: ' + socket.id + ", current White: " + this.whitePlayer + ", current Black: " + this.blackPlayer);
    let name = undefined;
    if(this.whitePlayer === socket.id) {
      name = this.whitePlayerName;
      this.whitePlayer = undefined;
      this.whitePlayerName = undefined;
      
    } else if(this.blackPlayer === socket.id) {
      name = this.blackPlayerName;
      this.blackPlayer = undefined;
      this.blackPlayerName = undefined;
    }
    console.log("user disconnected: current White: " + this.whitePlayer + ", current Black: " + this.blackPlayer);
    socket.broadcast.emit('disconnected', name);
  });

  socket.on('pieceselected', (index) => {
    console.log("pieceselected on server received: " + index);
    socket.broadcast.emit('pieceselected', index);
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
      if(this.whitePlayer !== undefined) {
        socket.emit('playerJoinGame', this.whitePlayerName);
      }
    } else {
      console.log("Two players are already playing. Wait your turn");
      return;
    }

    socket.broadcast.emit('playerJoinGame', name); 
  });
  
  socket.on('updateBoard', (msg) => {
    console.log("message on server received: " + msg);
    socket.broadcast.emit('updateBoard', msg);
  });
  
  // EVENT: player
  // This event lets clients know that the player changed
  socket.on('player', (player) => {
    console.log("message on server received: player: " + player);
    socket.broadcast.emit('player', player);
  });

  socket.on('gameOver', (playerNbr, playerName) => {
    console.log("Server: gameOver on server received: " + playerNbr + ", " + playerName + " won the game");
    socket.broadcast.emit('gameOver', playerNbr, playerName);
  });
});

