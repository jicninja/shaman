function background (texture, width, height, stage, initVel) {
    var self = this;
    this.width = width || texture.width;
    this.height = height || texture.height;
    this.initVelocity = initVel ? initVel : 0;
    this.blur = new PIXI.filters.BlurFilter();
    this.blur.blur = 0;
    this.tilingSprite = new PIXI.extras.TilingSprite(texture, this.width, this.height);
    this.tilingSprite.filters = [this.blur];
    if (stage) {
        this.attach(stage);
    }
}

background.prototype.update = function (vel) {
    this.velocity = this.initVelocity * (vel ? vel : 1)  + (vel ? vel : 0);
    this.blur.blurX = vel ? this.velocity * (this.velocity / 10) : 0;
    this.tilingSprite.tilePosition.x -= this.velocity;
};

background.prototype.attach = function (stage) {
    stage.addChild(this.tilingSprite);
};