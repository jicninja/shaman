function bullet(PLayerLauncher, Textures, Type, Stage, Send, realtime){
	this.player = PLayerLauncher;
	this.bulletstextures = Textures;
	this.stage = Stage;
	this.realtime = realtime;
	this.sprite = new PIXI.Sprite(this.bulletstextures.bullet1);
    this.sprite.anchor = new PIXI.Point(0.5,0.5);
    this.type = Type;
    
    this.direction = this.player.direction;
    this.margin = 20;

    /* Calculate Origin */    
    this.sprite.position.x = this.player.position.x;
    if(this.direction == 'right'){
        this.sprite.position.x += 35 + this.margin;
        this.sprite.rotation = 0*Math.PI/180;
    }
    if(this.direction == 'left'){
        this.sprite.position.x -= 35 + this.margin;
        this.sprite.rotation = 180*Math.PI/180;
    }
    
    this.sprite.position.y = this.player.position.y;
    if(this.direction == 'up'){
        this.sprite.position.y -= 50 + this.margin;
        this.sprite.rotation = 270*Math.PI/180;
    }
    if(this.direction == 'down'){
        this.sprite.position.y += 50 + this.margin;
        this.sprite.rotation = 90*Math.PI/180;
    }
    
    if(Send){
    	this.realtime.emit('fire', {
	        position: this.sprite.position,
	        direction: this.direction,
	        type: this.type,
	    });	
    }

    if(this.direction == 'right'){
        this.animation = {x: this.sprite.position.x + 300};
    }
    if(this.direction == 'left'){
        this.animation = {x: this.sprite.position.x - 300};
    }
    if(this.direction == 'up'){
        this.animation = {y: this.sprite.position.y - 300};
    }
    if(this.direction == 'down'){
        this.animation = {y: this.sprite.position.y + 300};
    }

    createjs.Tween.get(this.sprite.position).to(this.animation, 500).call(this.bulletCollector, [], this);
    
    this.stage.addChild(this.sprite);
}

bullet.prototype.bulletCollector = function(){
    this.stage.removeChild(this.sprite);
}