var width = document.body.clientWidth > 1000 ? document.body.clientWidth : 1000;

var renderer = PIXI.autoDetectRenderer( CFG.width , CFG.height,  { transparent: true, view: document.getElementById('game-canvas') });
var stage = new PIXI.Container();
var enemy = [];
var yetiTexture;
var bulletsTextures;
var yeti;

var previous = 0,
    frameDuration = 1000 / CFG.fps,
    lag = 0;

var socket = io();
var imsocket = {};


PIXI.loader
    .add('texture', 'assets/p2.png')
    .add('yeti', 'assets/yeti.png')
    .add('texture2', 'assets/background.png')
    .add('bullet1', 'assets/bullet-one.png')
    .load(onLoadedCallback);


function onLoadedCallback(loader, resources) {
    
    yetiName = parseInt((Math.random() * 10000));
    yetiTexture = resources.yeti.texture;

    bulletsTextures = {
        bullet1: resources.bullet1.texture
    }

    yeti = new player(yetiName, yetiTexture, {type: CFG.players.type.PLAYABLE}, stage, undefined, socket, bulletsTextures);
    socket.emit('add user', yetiName);

    animate();
}

socket.on('user joined', function(data) {
    var newEnemy = new player(data.username, yetiTexture, {type: CFG.players.type.ENEMY, id: data.id}, stage, undefined, socket);
    enemy.push(newEnemy);
});

socket.on('render fire', function(data) {
    var b = new bullet(data, bulletsTextures, '1', stage,  false, socket);
});



socket.on('init users', function(data){

    imsocket = {id: data.id, username: data.username};
    socket.emit('change position', {x: yeti.sprite.position.x, y: yeti.sprite.position.y});

    var users = data.users;

    if(users) {
        var l = users.length;
        if(users.length) {
            for (var i = 0; i < l ; i++) {
                var newEnemy = new player(users[i].username, yetiTexture, {type: CFG.players.type.ENEMY, id: users[i].id}, stage, undefined, socket);
                var playerData = users[i].playerData;
                newEnemy.setPosition(playerData, false);

                enemy.push(newEnemy);
            }

        }
    }
});

socket.on('die', function(data){
    var toRemove = _.findIndex(enemy, {id: data});
    if(toRemove >= 0){
        enemy[toRemove].destroy(stage);
        enemy.splice(toRemove, 1);
    }
    else {
        if(imsocket.id == data){
            console.log('DIE!!!!');
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
        //yeti.update(socket);
        lag -= frameDuration;
    }

    renderer.render(stage);
    previous = timestamp;

}

document.onkeydown = checkKey;




function checkKey(e) {

    e = e || window.event;
    e.stopPropagation();
    if (e.keyCode == '38') {
        // up arrow
        var y =  yeti.position.y;
        y = y - 10 ;
        yeti.setPosition({y: y });
    }
    else if (e.keyCode == '40') {
        // down arrow
        var y =  yeti.position.y;
        y = y + 10 ;
        yeti.setPosition({y: y });
    }
    else if (e.keyCode == '37') {
        // left arrow
        var x =  yeti.position.x;
        x = x - 10 ;
        yeti.setPosition({x: x });
    }
    else if (e.keyCode == '39') {
        // right arrow
        var x =  yeti.position.x;
        x = x + 10 ;
        yeti.setPosition({x: x });
    }
    else if (e.keyCode == '81') {
        // Q
        yeti.fire('q');
    }

}





