/**
 * Player object
 * @param name
 * @param texture
 * @param data
 * @param stage
 * @param lives
 */

function player (name, texture, data, stage, lives, realtime, bulletTextures, animations) {
    // se crea el sprite
    var self = this;
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor = new PIXI.Point(0.5,0.5);

    if (animations) {
        this.anim = {
            down: new PIXI.extras.MovieClip(animations.down),
            up: new PIXI.extras.MovieClip(animations.up),
            left: new PIXI.extras.MovieClip(animations.left)
        };

        this.anim.down.animationSpeed = this.anim.up.animationSpeed = this.anim.left.animationSpeed  = 0.2;
        this.anim.down.anchor = this.anim.up.anchor = this.anim.left.anchor = new PIXI.Point(0.5,0.5);

        this.anim.up.visible = false;
        this.anim.left.visible = false;



    }


    this.bulletTextures = bulletTextures;
    this.realtime = realtime;
    this.position = {};
    this.direction = 'right';
    this.player = true;
    this.konami = 'qwer';
    
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
        //this.sprite.alpha = data.type === CFG.players.type.ENEMY ? CFG.players.alpha.ENEMY : CFG.players.alpha.PLAYABLE;
    }

    if(data.type === CFG.players.type.ENEMY){
        this.player = false;
    }



    //se atachea a una escena
    if (stage) {
        this.attach(stage);
    }

    if (lives) {
        this.lives = lives;
    }

    /*
    this.position.x = CFG.players.default_position.left;
    this.position.y = CFG.players.default_position.top;
    */

    this.position.x = Math.floor(Math.random() * 800) + 1;
    this.position.y = Math.floor(Math.random() * 600) + 1;

    this.setPosition(this.position , false);


}

// constantes

player.prototype.lives = CFG.players.lives;



//se inicializa la posicion

player.prototype.setPosition = function (position, update) {
    if(!position) {return false;}

    for (var i in enemy) {
      if(enemy[i].id != this.id){
        if(position.x > enemy[i].position.x){
            var x = position.x - enemy[i].position.x;
          }
          else {
            var x = enemy[i].position.x - position.x;
          }
          if(position.y > enemy[i].position.y){
            var y = position.y - enemy[i].position.y;
          }
          else {
            var y = enemy[i].position.y - position.y;
          }

          if(x <= 70 && y <= 70){
            return false;
          } 
      }       
    }

    if(position.x != this.position.x){

        this.anim.left.gotoAndStop(this.anim.left.currentFrame + 1 );

        if(position.x > this.position.x){
            this.direction = 'right';
            this.anim.up.visible = false;
            this.anim.down.visible = false;
            this.anim.left.visible = true;
            this.anim.left.scale = {x:-1, y:1};

        }
        else {
            this.direction = 'left';
            this.anim.up.visible = false;
            this.anim.down.visible = false;
            this.anim.left.visible = true;
            this.anim.left.scale = {x:1, y:1};

        }
        this.position.x = position.x;
    }
    
    if(position.y != this.position.y){
        this.anim.up.gotoAndStop(this.anim.up.currentFrame + 1 );
        this.anim.down.gotoAndStop(this.anim.down.currentFrame + 1 );

        if(position.y < this.position.y){
            this.direction = 'up';
            this.anim.up.visible = true;
            this.anim.down.visible = false;
            this.anim.left.visible = false;
        }
        else {
            this.direction = 'down';
            this.anim.up.visible = false;
            this.anim.down.visible = true;
            this.anim.left.visible = false;

        }
        this.position.y = position.y;    
    }

    this.anim.down.position.x = this.anim.up.position.x =  this.anim.left.position.x = this.position.x;
    this.anim.down.position.y = this.anim.up.position.y = this.anim.left.position.y =  this.position.y;
    this.text.x = this.position.x - (this.anim.up.width / 4);


    if(update === false){
        return false;
    }
    this.realtime.emit('change position', this.position);
};

//Se realiza un disparo
player.prototype.fire = function (type) {
    if(!type) {return false;}
    
    if(this.konami.length <= 3){
        this.konami += type;
    }
    else {
        this.konami = this.konami.substr(1, 3) + type;
    }

    var html = '';
    for (var i = 0; i < 4; i++) {
        html += '<div class="game-action-btn">' + this.konami.substr(i, 1).toUpperCase() + '</div>';
    }
    document.getElementById("game-actions").innerHTML = html;

    if(this.konami.length >= 4){
        if(this.konami == 'qwwq'){
            var b = new bullet(this, this.bulletTextures, '1', this.stage, true, this.realtime, enemy);            
        }
    }
    return true;
};


//se updatea la posicion desde el server

player.prototype.updateServer = function (playerData) {

    if(!playerData ) {return false; }

    this.setPosition(playerData, false);
};


// ataccheame esta
player.prototype.attach = function (stage) {
    stage.addChild(this.anim.down);
    stage.addChild(this.anim.up);
    stage.addChild(this.anim.left);

    if(this.text) {
        stage.addChild(this.text);
    }
};

// borra todo
player.prototype.destroy = function (stage) {
  if(!stage) {return false};
    stage.removeChild(this.anim.down);
    if(this.text){
        stage.removeChild(this.text);
    }
};