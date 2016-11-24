var pictionary = function() {
    var socket = io();
    var drawing;
    var drawer;
    var canvas, context;
    
    var draw = function(position) {
            context.beginPath();
            context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
            context.fill();
    };
    
    socket.on('guesser', function(){
        $('#guess').removeClass('hidden');
        drawer = false;
    });
    
    socket.on('drawer', function(randomElement){
        drawer = true;
        $('#word p').append('draw ' + randomElement +'!');
    });

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    
    canvas.on('mousedown', function(event){
        drawing = true; 
    });
    
    canvas.on('mouseup', function(event){
        drawing = false; 
    });
    
    canvas.on('mousemove', function(event) {
        var offset = canvas.offset();
        var position = {x: event.pageX - offset.left,
                        y: event.pageY - offset.top};
        if(drawing && drawer){
            draw(position);
            socket.emit('draw', position);
        }
    });
    
    var guessBox;

    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }
    
        console.log(guessBox.val());
        socket.emit('guess', guessBox.val());
        guessBox.val('');
    };
    
    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);
    
    var guessed = function(data){
        $('#results p').append(data + '<br>');
    }
    
    var wrongAnswer = function(data){
        alert(data);
    }
    
    var correctAnswer = function(data){
        alert('Your answer is correct, you are the drawer now!');
        context.clearRect(0, 0, 800, 600);
        drawer = true;
        $('#guess').addClass('hidden');
        $('#results p').empty();
        $('#word p').append('draw ' + data +'!');
        console.log(data);
    }
    
    var changePlayer = function(data){
        alert(data);
        context.clearRect(0, 0, 800, 600);
        $('#guess').removeClass('hidden');
        drawer = false;
        $('#word p').empty();
        $('#results p').empty();
    }
    
    socket.on('guess', guessed);
    socket.on('draw', draw);
    socket.on('wrong', wrongAnswer);
    socket.on('correct', correctAnswer);
    socket.on('changePlayer', changePlayer);
};



$(document).ready(function() {
    pictionary();
});