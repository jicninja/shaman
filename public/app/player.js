/**
 * Player object
 * @param name
 * @param texture
 * @param data
 * @param stage
 * @param lives
 */

function player (name, texture, data, stage, lives, realtime, bullets) {
    // se crea el sprite
    this.self = this;
    this.sprite = new PIXI.Sprite(texture);
    this.realtime = realtime;
    this.position = {};
    this.bullets = [];
    this.bulletstextures = bullets;
    this.direction = 'right';

    this.stage = stage;

    //se crea el nombre
    if (name) {
        this.text = new PIXI.Text(name);
        var style = {font:'bold 10px Arial', fill:'green', align:'center'};
        this.text.style = style;
    }


    //se asigna configuraciones
    this.data = data;

    if (data) {
        this.id = data.id ? data.id : CFG.players.default_id;
        this.sprite.alpha = data.type === CFG.players.type.ENEMY ? CFG.players.alpha.ENEMY : CFG.players.alpha.PLAYABLE;
    }



    //se atachea a una escena
    if (stage) {
        this.attach(stage);
    }

    if (lives) {
        this.lives = lives;
    }

    this.position.x = CFG.players.default_position.left;
    this.position.y = CFG.players.default_position.top;

    this.setPosition(this.position , false);


}

// constantes

player.prototype.lives = CFG.players.lives;



//se inicializa la posicion

player.prototype.setPosition = function (position, update) {
    if(!position) {return false;}

    if(typeof position.x !== 'undefined') {
        if(position.x > this.position.x){
            this.direction = 'right';
        }
        else {
            this.direction = 'left';
        }
        this.position.x = position.x;
    }

    if(typeof position.y !== 'undefined') {
        if(position.y < this.position.y){
            this.direction = 'up';
        }
        else {
            this.direction = 'down';
        }
        this.position.y = position.y;
    }

    this.sprite.position.x = this.position.x;
    this.sprite.position.y = this.position.y;
    this.text.x = this.position.x;
    this.text.y = this.position.y + this.sprite.height;

    if(update === false){
        return false;
    }
    this.realtime.emit('change position', this.position);
};

//Se realiza un disparo
player.prototype.fire = function (type) {
    if(!type) {return false;}

    var newbullet = new PIXI.Sprite(this.bulletstextures.bullet1);
    newbullet.anchor = new PIXI.Point(0.5,0.5);
    newbullet.position.x = this.position.x + 35;
    newbullet.direction = this.direction;
    newbullet.margin = 20;
    if(newbullet.direction == 'right'){
        newbullet.position.x += 35 + newbullet.margin;
        newbullet.rotation = 0*Math.PI/180;
    }
    if(newbullet.direction == 'left'){
        newbullet.position.x -= 35 + newbullet.margin;
        newbullet.rotation = 180*Math.PI/180;
    }
    newbullet.position.y = this.position.y + 50;
    if(newbullet.direction == 'up'){
        newbullet.position.y -= 50 + newbullet.margin;
        newbullet.rotation = 270*Math.PI/180;
    }
    if(newbullet.direction == 'down'){
        newbullet.position.y += 50 + newbullet.margin;
        newbullet.rotation = 90*Math.PI/180;
    }
    newbullet.typebullet = '1';
    newbullet.fired = 0;

    if(newbullet.direction == 'right'){
        createjs.Tween.get(newbullet.position).to({x: newbullet.position.x + 300}, 500).call(this.bulletCollector, [newbullet], this);
    }
    if(newbullet.direction == 'left'){
        createjs.Tween.get(newbullet.position).to({x: newbullet.position.x - 300}, 500).call(this.bulletCollector, [newbullet], this);
    }
    if(newbullet.direction == 'up'){
        createjs.Tween.get(newbullet.position).to({y: newbullet.position.y - 300}, 500).call(this.bulletCollector, [newbullet], this);
    }
    if(newbullet.direction == 'down'){
        createjs.Tween.get(newbullet.position).to({y: newbullet.position.y + 300}, 500).call(this.bulletCollector, [newbullet], this);
    }
    
    this.stage.addChild(newbullet);
    //this.bullets.push(newbullet);

    return true;
    //this.realtime.emit('change position', this.position);
};

player.prototype.bulletCollector = function(bullet){
    this.stage.removeChild(bullet);
}


//se updatea la posicion desde el server

player.prototype.updateServer = function (playerData) {

    if(!playerData ) {return false; }


    if(typeof playerData.x !== 'undefined') {
        this.position.x = playerData.x;
    }

    if(typeof playerData.y !== 'undefined') {
        this.position.y = playerData.y;
    }



    this.setPosition(this.position, false);
};


// ataccheame esta
player.prototype.attach = function (stage) {
    stage.addChild(this.sprite);
    if(this.text) {
        stage.addChild(this.text);
    }
};

// borra todo
player.prototype.destroy = function (stage) {
  if(!stage) {return false};
    stage.removeChild(this.sprite);
    if(this.text){
        stage.removeChild(this.text);
    }
};