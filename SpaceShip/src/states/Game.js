class Game {

    init(currentLevel) {
        this.PLAYER_SPEED = 200;
        this.BULLET_SPEED = -1000;

        ///////////////////////////////////////////////////////
        // Multiple Levels
        this.numLevels = 3;
        this.currentLevel = currentLevel ? currentLevel : 1;
        console.log('current level: ' + this.currentLevel);
        //////////////////////////////////////////////////////
    }

    create() {
        // repeating tilesprite background, will fill all the area available
        this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');

        // makes the background scrolls vertically (y:30 30 frames per second)
        this.background.autoScroll(0, 95);

        // player
        this.player = this.add.sprite(this.game.world.centerX, this.game.world.height - 50, 'player');
        this.player.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;

        this.initBullets();
        // shoots every 0.2s
        this.shootingTimer = this.game.time.events.loop(Phaser.Timer.SECOND / 5, this.createPlayerBullet, this);

        this.initEnemies();

        //////////////////////////////////////////////////////////////////
        // Load Level
        this.loadLevel();
        //////////////////////////////////////////////////////////////////
    }

    update() {
        this.game.physics.arcade.overlap(this.playerBullets, this.enemies, this.damageEnemy, null, this);

        this.game.physics.arcade.overlap(this.enemyBullets, this.player, this.killPlayer, null, this);

        // resets movement to zero if not pressing mouse
        this.player.body.velocity.x = 0;

        // capturing pointer/mouse position when pressing
        if (this.game.input.activePointer.isDown) {
            // position x
            const targetX = this.game.input.activePointer.position.x;

            // right or left
            const direction = targetX >= this.game.world.centerX ? 1 : -1;

            // move to the direction
            this.player.body.velocity.x = direction * this.PLAYER_SPEED;
        }
    }
    //////////////////////////////////////////////////////////////////
    // Load Level
    loadLevel(){
        this.currentEnemyIndex = 0;

        this.levelData = JSON.parse(this.game.cache.getText('level' + this.currentLevel));
        
        ///////////////////////////////////////////////////////
        // Multiple Levels
        // end of level timer
        this.endOfLevelTimer = this.game.time.events.add(this.levelData.duration * 1000, () => {
            console.log('level ended!');

            // this.orchestra.stop();

            if(this.currentLevel < this.numLevels){
                ++this.currentLevel; // next level
            }else {
                this.currentLevel = 1; // back to the beginning :D
            }

            // start current level
            this.game.state.start('Game', true, false, this.currentLevel);
        });
        ////////////////////////////////////////////////////////
       

        this.scheduleNextEnemy();
    }

    scheduleNextEnemy(){
        // load data with enemies aspects
        const nextEnemy = this.levelData.enemies[this.currentEnemyIndex];

        // if there is a next enemy
        if(nextEnemy){
            // times 1000ms = 1s
            const nextTime = 1000 * ( 
                nextEnemy.time - (this.currentEnemyIndex === 0 ? 0 : this.levelData.enemies[this.currentEnemyIndex - 1].time)
            );

            // grabs the nextTime value and do a time event callback each second
            this.nextEnemyTimer = this.game.time.events.add(nextTime, () => {
                this.createEnemy(
                    nextEnemy.x * this.game.world.width,
                    100,
                    nextEnemy.health,
                    nextEnemy.key,
                    nextEnemy.scale,
                    nextEnemy.speedX,
                    nextEnemy.speedY
                );

                ++this.currentEnemyIndex;
                this.scheduleNextEnemy();
            })
        } /*else {
            this.message = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'You Win!!!!', {font:'32px Arial', fill:'#fff'});
            lib.centralize(this.message);
        } */
    }
    //////////////////////////////////////////////////////////////////

    initBullets() {
        this.playerBullets = this.add.group();
        this.playerBullets.enableBody = true;
    }

    createPlayerBullet() {
        // remember: recycle bullets
        let bullet = this.playerBullets.getFirstExists(false);

        // or if there is no bullets, create
        if (!bullet) {
            /////////////////////////////////////////////////
            // Prefabs
            bullet = new PlayerBullet(this.game, this.player.x, this.player.top);
            this.playerBullets.add(bullet);
        } else {
            //reset bullet to top y player position
            bullet.reset(this.player.x, this.player.top);
        }

        // set velocity
        bullet.body.velocity.y = this.BULLET_SPEED;
        /////////////////////////////////////////////////
    }

    initEnemies() {
        // a group of enemies
        this.enemies = this.add.group();

        // enemy bullets group
        this.enemyBullets = this.add.group();
        this.enemyBullets.enableBody = true;

        // should create random one every 5s and 10s
        //this.createEnemy();
    }

    damageEnemy(bullet, enemy) {
        enemy.receiveDamage(1); // damages helth in 1

        bullet.kill();
    }

    killPlayer() {
        this.player.kill();

        // this.orchestra.stop();

        // might use some life system
        this.game.state.start('Game', true, false, this.currentLevel);
    
        // else this.game.state.restart();
    }

    ///////////////////////////////////////////////////////////////////
    // Enemy Pool
    createEnemy(x = 100, y = 100, health = 10, key = 'green_enemy', scale = 1, speedX = 100, speedY = 50) {
        // creating random enemy purposes
        /*const enemyProps = {
            x: 100, // between 100 and width - 100
            y: 100,
            health: 5, // between 5 and 10
            key: 'green_enemy', // the 3 enemy keys
            scale: 1, // between 1 and 2
            speedX: 100,
            speedY: 50
        } */

        let enemy = this.enemies.getFirstExists(false);

        if (!enemy) {
            enemy = new Enemy(this.game, x, y, key, health, this.enemyBullets);
            this.enemies.add(enemy);
        }

        enemy.resetEnemy(x, y, health, speedX, speedY, scale);
    }
    /////////////////////////////////////////////////////////////////
}