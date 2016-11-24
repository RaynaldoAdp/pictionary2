var WORDS = [
    "word", "letter", "number", "person", "pen", "class", "people",
    "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
    "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "brother", "sister", "world", "head", "page", "country", "question",
    "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
    "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
    "space"
];

var randomElement;

var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var user = 0;

io.on('connection', function(socket){
    if(user === 0){
        console.log('Drawer connected!');
        user += 1;
        
        var randomIndex = Math.floor(Math.random() * WORDS.length); 
        randomElement = WORDS[randomIndex];
        socket.emit('drawer', randomElement);
        
        socket.on('draw', function(position){
            socket.broadcast.emit('draw', position);
        });
        
        socket.on('guess', function(data){
            if(data !== randomElement){
                socket.broadcast.emit('guess', data +' try again!');
                socket.emit('wrong', 'Wrong answer, try again!');
            }
            else{
                var randomIndex = Math.floor(Math.random() * WORDS.length); 
                randomElement = WORDS[randomIndex];                
                socket.broadcast.emit('changePlayer', 'A user has the correct answer:' + data + '. He will now be the drawer');
                socket.emit('correct', randomElement);
            }
                
        })        
    }
    
    else{
        console.log('Guesser connected!')
        user += 1;
        
        socket.emit('guesser');
        
        socket.on('guess', function(data){
            if(data !== randomElement){
                socket.broadcast.emit('guess', data +' try again!');
                socket.emit('wrong', 'Wrong answer, try again!');
            }
            else{
                var randomIndex = Math.floor(Math.random() * WORDS.length); 
                randomElement = WORDS[randomIndex];                
                socket.broadcast.emit('changePlayer', 'A user has the correct answer:' + data + '. He will now be the drawer');
                socket.emit('correct', randomElement);
            }
                
        });
        
        socket.on('draw', function(position){
             socket.broadcast.emit('draw', position);
        });
    }
    
    socket.on('disconnect',function(){
       console.log('User disconnected');
       user -= 1;
    });
});




server.listen(process.env.PORT || 8080);