/**
 * Player object
 * @param name
 * @param texture
 * @param data
 * @param stage
 * @param lives
 */

function player (name, texture, data, stage, lives, realtime) {
    // se crea el sprite
    this.sprite = new PIXI.Sprite(texture);
    this.realtime = realtime;
    this.position = {};
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
        this.position.x = position.x;
    }

    if(typeof position.y !== 'undefined') {
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