function player (name, texture, playable, stage, life) {
    var self = this;
    this.isRuninng = false;
    this.isJumping = false;
    this.isFast = false;

    this.sprite = new  PIXI.Sprite(texture);

    if (playable) {
        this.playable = true;
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

player.prototype.update = function (tick) {

    if (this.isJumping) {
        this.velocitygravity = this.velocitygravity <= this.gravity ? this.velocitygravity + 2 : this.gravity;
        this.sprite.position.y = this.sprite.position.y - (this.velocityJump - this.velocitygravity);
        if (this.sprite.position.y > this.floor) {
            this.sprite.position.y = this.floor;
            this.isJumping = false;
            this.velocitygravity = 1;
        }
    }

    if (this.isRuninng) {
        this.sprite.position.x = this.sprite.position.x + this.velocity;
    }

    if (this.isFast) {
        this.velocity = this.velocity <= this.maxvelocity ? this.velocity + 0.05 : this.maxvelocity;
    } else {
        this.velocity = this.velocity >= this.minvelocity ? this.velocity - 0.5 : this.minvelocity;
    }
}


player.prototype.attach = function (stage) {
    stage.addChild(this.sprite);
};