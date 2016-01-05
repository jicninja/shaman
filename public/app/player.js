/**
 * Player object
 * @param name
 * @param texture
 * @param data
 * @param stage
 * @param lives
 */

function player (name, texture, data, stage, lives) {
    // se crea el sprite
    this.sprite = new PIXI.Sprite(texture);

    //se crea el nombre
    if (name) {
        this.text = new PIXI.Text(name);
        var style = {font:'bold 10px Arial', fill:'green', align:'center'};
        this.text.style = style;
    }


    //se asigna configuraciones
    this.data = data;

    if (data) {
        this.id = data.id ? data.id : CGJ.players.default_id;
        this.sprite.alpha = data.type === CGJ.players.type.ENEMY ? CGJ.players.alpha.ENEMY : CGJ.players.alpha.PLAYABLE;
    }

    this.initPosition({x:CGJ.players.type.PLAYABLE ? CGJ.players.default_position.left : -100, y: CGJ.players.default_position.floor});


    //se atachea a una escena
    if (stage) {
        this.attach(stage);
    }

    if (lives) {
        this.lives = lives;
    }

}

// constantes

player.prototype.lives = CGJ.players.lives;

player.prototype.velocity = {
    running: false,
    fast: false,
    actual: 0,
    max: CGJ.players.velocity.max,
    min: CGJ.players.velocity.min
};

player.prototype.acceleration = {
    increase: CGJ.players.acceleration.increase,
    inertia: CGJ.players.acceleration.inertia
};

player.prototype.gravity = {
    actual: 0,
    max: CGJ.gravity.max,
    acceleration: CGJ.gravity.acceleration
};


player.prototype.jump = {
    jumping: false,
    force: CGJ.players.jump
};

player.prototype.run = function (run, fast) {
    this.velocity.running = run ? true : false;
    this.velocity.fast = fast ? true : false;
};

//se inicializa la posicion

player.prototype.initPosition = function (position) {
    if(!position) {return false;}
    this.sprite.position.x = position.x;
    this.sprite.position.y = position.y;
    this.text.x = position.x;
    this.floor = position.y;
    this.text.y = position.y + this.sprite.height;
}

// salta yeti salta
player.prototype.DoJump = function () {
    if (this.jump.jumping){
        return false;
    }
    this.jump.jumping = true;
};

// agunataaaa
player.prototype.stop = function() {
    this.velocity.running = false;
    this.velocity.actual = 0;
};

// se actualiza a si mismo con los controles locos
player.prototype._updateSelf = function (realtime) {

    //si el loco salta creo gravedad, cosmico
    if (this.jump.jumping) {
        this.gravity.actual = this.gravity.actual <= this.gravity.max ? this.gravity.actual + this.gravity.acceleration : this.gravity.max;
        this.sprite.position.y = this.sprite.position.y - (this.jump.force - this.gravity.actual);
        if (this.sprite.position.y > this.floor) {
            this.sprite.position.y = this.floor;
            this.jump.jumping = false;
            this.gravity.actual = this.gravity.acceleration;
        }
    }

    //si el loco corre
    if (this.velocity.running) {

        //si el loco corre rapido
        if (this.velocity.fast) {
            this.velocity.actual = this.velocity.actual <= this.velocity.max ? this.velocity.actual + this.acceleration.increase : this.velocity.max;
        } else {
        //si el loco deja de correr rapido
            this.velocity.actual = this.velocity.actual >= this.velocity.min ? this.velocity.actual - this.acceleration.inertia : this.velocity.min;
        }

        //updateame esta posicion
        this.sprite.position.x = this.sprite.position.x + this.velocity.actual;
        this.text.x = this.sprite.position.x;

        //se emite coso realtime
        realtime.emit('change position', {x: this.sprite.position.x, y: this.sprite.position.y});
    }
};

//se updatea la posicion desde el server

player.prototype.updateServer = function (playerData) {
    if(!playerData) {return false}
    this.sprite.position.x = playerData.x;
    this.sprite.position.y = playerData.y;
    this.text.x = this.sprite.position.x;
};


// no se lo que quice hacer aca
player.prototype.update = function (realtime) {
   if (this.data) {
       if (this.data.type === CGJ.players.type.PLAYABLE) {
        this._updateSelf(realtime)
       }
   }
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