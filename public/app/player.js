

function player (name, texture, data, stage, life) {
    var self = this;
    this.isRuninng = false;
    this.isJumping = false;
    this.isFast = false;
    this.sprite = new  PIXI.Sprite(texture);

    if(name) {
        this.text = new PIXI.Text(name);
        var style = {font:'bold 10px Arial', fill:'green', align:'center'};
        this.text.style = style;
    }

    this.data = data;

    if (data) {
        this.id = data.id ? data.id : 'self';
        this.sprite.alpha = data.type === 'OTHER' ? 0.5 : 1;
    }

    if (stage) {
        this.attach(stage);
    }

    if (life) {
        this.life = life;
    }
}

player.prototype.setFloor = function (floorY) {
  this.floor = floorY;
    this.sprite.position.y = floorY;
    this.text.y = floorY + this.sprite.height;
};

player.prototype.life = 3;
player.prototype.velocity = 0;
player.prototype.maxvelocity = 15;
player.prototype.minvelocity = 3;

player.prototype.gravity = 40;
player.prototype.velocitygravity = 1;

player.prototype.deltaJump = 30;
player.prototype.velocityJump = 0;


player.prototype.jump = function () {
    if (this.isJumping){
        return false;
    }
    this.isJumping = true;
    this.velocityJump = this.deltaJump;
};

player.prototype.stop = function() {
    this.isRuninng = false;
    this.velocity = 0;
};

player.prototype._updateSelf = function (realtime) {
    if (this.isJumping) {
        this.velocitygravity = this.velocitygravity <= this.gravity ? this.velocitygravity + 2 : this.gravity;
        this.sprite.position.y = this.sprite.position.y - (this.velocityJump - this.velocitygravity);
        if (this.sprite.position.y > this.floor) {
            this.sprite.position.y = this.floor;
            this.isJumping = false;
            this.velocitygravity = 1;
        }
    }

    if (this.isFast) {
        this.velocity = this.velocity <= this.maxvelocity ? this.velocity + 0.05 : this.maxvelocity;
    } else {
        this.velocity = this.velocity >= this.minvelocity ? this.velocity - 0.5 : this.minvelocity;
    }

    if (this.isRuninng) {
        this.sprite.position.x = this.sprite.position.x + this.velocity;
        this.text.x = this.sprite.position.x;
        realtime.emit('change position', {x: this.sprite.position.x, y: this.sprite.position.y});
    }
};

player.prototype.updateServer = function (playerData) {
    if(!playerData) {return false}
    this.sprite.position.x = playerData.x;
    this.sprite.position.y = playerData.y;
    this.text.x = this.sprite.position.x;
};

player.prototype.update = function (realtime) {
   if (this.data) {
       if (this.data.type === 'OWN') {
        this._updateSelf(realtime)
       }
   }
};


player.prototype.attach = function (stage) {
    stage.addChild(this.sprite);
    if(this.text) {
        stage.addChild(this.text);
    }
};