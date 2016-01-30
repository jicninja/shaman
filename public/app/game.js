var width = document.body.clientWidth > 1000 ? document.body.clientWidth : 1000;

var renderer = PIXI.autoDetectRenderer( CFG.width , CFG.height,  { transparent: true, view: document.getElementById('game-canvas') });
var stage = new PIXI.Container();
var enemy = [];
var yetiTexture;

var previous = 0,
    frameDuration = 1000 / CFG.fps,
    lag = 0;

var socket = io();


PIXI.loader
    .add('texture', 'assets/p2.png')
    .add('yeti', 'assets/yeti.png')
    .add('texture2', 'assets/background.png')
    .load(onLoadedCallback);


function onLoadedCallback(loader, resources) {
    
    yetiName = parseInt((Math.random() * 10000));
    yetiTexture = resources.yeti.texture;
    yeti = new player(yetiName, yetiTexture, {type: CFG.players.type.PLAYABLE}, stage);
    socket.emit('add user', yetiName);

    animate();
}

socket.on('user joined', function(data) {
    var newEnemy = new player(data.username, yetiTexture, {type: CFG.players.type.ENEMY, id: data.id}, stage);
    enemy.push(newEnemy);
});

socket.on('init users', function(data){

    var users = data.users;
    if(users) {
        var l = users.length;
        if(users.length) {
            for (var i = 0; i < l ; i++) {
                var newEnemy = new player(users[i].username, yetiTexture, {type: CFG.players.type.ENEMY, id: users[i].id}, stage);
                var playerData = users[i].playerData;

                if(playerData){

                    console.log('pos', playerData);


                    newEnemy.initPosition({x: playerData.x, y: playerData.y});
                }

                enemy.push(newEnemy);
            }

        }
    }
});

socket.on('user left', function(data){

    var toRemove = _.findIndex(enemy, {id: data.id});

    if(toRemove >= 0){
        enemy[toRemove].destroy(stage);
        enemy.splice(toRemove, 1);
    }
});

socket.on('change position', function(data) {
    var toUpdate = _.find(enemy, {id: data.id});
    if(toUpdate) { toUpdate.updateServer(data.data)}
});

function animate(timestamp) {
    requestAnimationFrame(animate);


    if (!timestamp) timestamp = 0;
    var elapsed = timestamp - previous;
    if (elapsed > 1000) elapsed = frameDuration;
    lag += elapsed;

    while (lag >= frameDuration) {

        if(yeti.velocity.running) {
            if(yeti.sprite.position.x > width * 0.3) {
                stage.position.x -= yeti.velocity.actual;
            }
        }
        yeti.update(socket);
        lag -= frameDuration;
    }

    renderer.render(stage);
    previous = timestamp;

}

document.onkeydown = checkKey;
document.onkeyup = checkKeyUp;


function checkKeyUp (e) {
    e = e || window.event;
    if (e.keyCode == '39') {
        // right arrow
        yeti.run(true, false);
    }
}


var myElement = document.getElementById('header-canvas');
var mc = Hammer(myElement);

mc.on('press', function(e) {
    yeti.run(true, !yeti.velocity.fast);
});

mc.on('pressup', function(e) {
    yeti.run(true, false);
    yeti.DoJump();
});

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        yeti.run(true, yeti.velocity.fast);
        yeti.DoJump();
    }
    else if (e.keyCode == '40') {
        yeti.destroy();
        // down arrow
    }
    else if (e.keyCode == '37') {
        // left arrow
        yeti.stop();
    }
    else if (e.keyCode == '39') {
        // right arrow
        yeti.run(true, true);
    }

}





