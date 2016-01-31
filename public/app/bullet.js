function bullet(PLayerLauncher, Textures, Type, Stage, Send, realtime, Enemy){
	var self = this;
	this.player = PLayerLauncher;
	this.bulletstextures = Textures;
	this.stage = Stage;
	this.realtime = realtime;
	this.sprite = new PIXI.Sprite(this.bulletstextures.bullet1);
    this.sprite.anchor = new PIXI.Point(0.5,0.5);
    this.type = Type;
    this.enemy = Enemy;
    
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

    var intervalcount = 1;
    var interval = setInterval(function(){
    	
    	self.enemy.push(yeti);
    	
        for (var i in self.enemy) {

          if(self.sprite.position.x > self.enemy[i].position.x){
            var x = self.sprite.position.x - self.enemy[i].position.x;
          }
          else {
            var x = self.enemy[i].position.x - self.sprite.position.x;
          }
          if(self.sprite.position.y > self.enemy[i].position.y){
            var y = self.sprite.position.y - self.enemy[i].position.y;
          }
          else {
            var y = self.enemy[i].position.y - self.sprite.position.y;
          }
          if(x <= 70 && y <= 70){
          	var tintsprite = self.enemy[i].sprite;
          	tintsprite.tint = 0xFF0000;
          	setTimeout(function(){
          		tintsprite.tint = 0xFFFFFF;
          	}, 250);

          	 self.stage.removeChild(self.sprite);
          }  
        }
        intervalcount++;
        if(intervalcount >= 5){
            clearInterval(interval);
        }
    }, 100);
	
    
    this.stage.addChild(this.sprite);
}

bullet.prototype.bulletCollector = function(){
    this.stage.removeChild(this.sprite);
}