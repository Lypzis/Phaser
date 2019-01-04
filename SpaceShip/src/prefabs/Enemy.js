class Enemy extends Phaser.Sprite {

    constructor(game = SpaceHipster.game, x = 0, y = 0, key = 'green_enemy', health = 1, enemyBullets = []) {
        super(game, x, y, key);

        this.game.physics.arcade.enable(this);

        this.anchor.setTo(0.5);
        this.animations.add('getHit', [0, 1, 2, 1, 0], 30, false);
        // health is in Phaser Default !!!!
        this.health = health;

        this.body.velocity.x = 100; // set this outside, somehow
        this.body.velocity.y = 50;

        this.enemyBullets = enemyBullets;

        // shoots every 2s
        this.shootingTimer = this.game.time.events.loop(2000, this.createEnemyBullet, this);
    
        // alternative, used in course
        // this.enemyTimer = this.game.time.create(false);
        // this.enemyTimer.start();

        // this.scheduleShooting();
    }

    update() {
        
        this.bounce();
        this.killOnMaxHeight();
        
    }

    ////////////////////////////////////////////////////////////////////////
    // Enemy Bullets
    /*
    scheduleShooting() {
        this.shoot(); 

        this.enemyTimer = this.game.time.events.loop(2000, this.scheduleShooting, this); 
    }

    shoot(){
        if(this.alive) {
            // remember: recycle bullets
            let bullet = this.enemyBullets.getFirstExists(false);

            // or if there is no bullets, create
            if (!bullet) {
            /////////////////////////////////////////////////
            // Prefabs
                bullet = new EnemyBullet(this.game, this.x, this.bottom);
                this.enemyBullets.add(bullet);
            } else {
                //reset bullet to top y enemy position
                bullet.reset(this.x, this.bottom);
            }

            // set velocity
            bullet.body.velocity.y = 200;
            /////////////////////////////////////////////////
        }
    } */
    ///////////////////////////////////////////////////////////////////////////////

    receiveDamage(amount){
        // damage is in Phaser Default !!!!
        this.damage(amount);
        
        this.play('getHit');

        /////////////////////////////////////////////////
        // Particle effects 
        if(this.health <= 0){
            // creating particles of the explosion
            const emitter = this.game.add.emitter(this.x, this.y, 100); // this position
            emitter.makeParticles('enemyParticle'); // assign sprite key
            // particle velocities (each one receives a random value between max and min)
            emitter.minParticleSpeed.setTo(-200, -200); 
            emitter.maxParticleSpeed.setTo(200, 200);
            emitter.gravity = 0; 
            emitter.start(true, 1000, null, 100); // start emitter animation

            //this.resetEnemy(100, 100, 10);

            // this.enemyTimer.pause();
        }
        ////////////////////////////////////////////////
    }

    resetEnemy(x, y, health, speedX, speedY, scale) {
        this.reset(x, y, health);
        this.body.velocity.x = speedX; // is repeating too much
        this.body.velocity.y = speedY;
        this.scale.setTo(scale, scale);

        // this.enemyTimer.resume();
    }

    bounce(){
        // makes the sprite change direction of movement
        // once near the horizontal border (5% or 95%)
        if(this.x < 0.05 * this.game.world.width) {
            this.x = 0.05 * this.game.world.width + 2;
            this.body.velocity.x *= -1; // back to positive
        } else if (this.x > 0.95 * this.game.world.width){ // this triggers first
            this.x =  0.95 * this.game.world.width - 2;
            this.body.velocity.x *= -1; // switch to negative
        }
    }

    killOnMaxHeight(){
        if (this.top > this.game.world.height) {
            this.kill();
        }
    }

    createEnemyBullet() {
        if(this.alive) {
            // remember: recycle bullets
            let bullet = this.enemyBullets.getFirstExists(false);

            // or if there is no bullets, create
            if (!bullet) {
            /////////////////////////////////////////////////
            // Prefabs
                bullet = new EnemyBullet(this.game, this.x, this.bottom);
                this.enemyBullets.add(bullet);
            } else {
                //reset bullet to top y enemy position
                bullet.reset(this.x, this.bottom);
            }

            // set velocity
            bullet.body.velocity.y = 200;
            /////////////////////////////////////////////////
        }
    }

}