class Game {

    init() {
        ////////////////////////////////////////////////////
        // Keyboard Control
        this.cursors = game.input.keyboard.createCursorKeys(); // arrow keys

        this.RUNNING_SPEED = 180;
        this.JUMPING_SPEED = 550;
        ////////////////////////////////////////////////////

        //////////////////////////////////////////////////////
        // Camera
        // setting height of the world bigger so the camera
        // can focus on player no matter height he is in
        // the screen. 
        game.world.setBounds(0, 0, 360, 700);
        /////////////////////////////////////////////////////
    }

    create() {
        /////////////////////////////////////////////////////
        // Platform Group
        // if many things are going to have the same aspects, put
        // them all in group and be happy :D
        
        //////////////////////////////////////////////////////////////
        // Loading JSON files
        // parse the json file data to become javascript, duh
        this.levelData = JSON.parse(game.cache.getText('level'));
        ////////////////////////////////////////////////////////////

        // create a group to handle all platforms at once
        this.platforms = game.add.group();
        
        // enable physics to all sprites within the group;
        this.platforms.enableBody = true; 

        // create platforms to show in screen
        this.levelData.platFormData.forEach(e =>{
            this.platforms.create(e.x, e.y, 'platform');
        });

        // sets all of the platforms to not respond to collision hits
        // not be pulled down by gravity respectively
        this.platforms.setAll('body.immovable', true);
        this.platforms.setAll('body.allowGravity', false);
        /////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////
        // Fire
        this.fires = game.add.group();
        this.fires.enableBody = true;

        let fire;
        this.levelData.fireData.forEach(e => {
            fire = this.fires.create(e.x, e.y, 'fire');   
            fire.animations.add('fire', [0, 1], 4, true);
            fire.play('fire');
        });

        this.fires.setAll('body.allowGravity', false);
        /////////////////////////////////////////////////////////////

        this.ground = game.add.sprite(0, 638, 'ground');

        this.player = game.add.sprite(this.levelData.playerStart.x, this.levelData.playerStart.y, 'player', 3);
        this.player.animations.add('walking', [0, 1, 2, 1], 6, true); //animations
        this.player.customParams = {

        };

        lib.centralize(this.player);

        ///////////////////////////////////////////////////////////////
        // Goal
        this.goal = game.add.sprite(this.levelData.goal.x, this.levelData.goal.y, 'gorilla3');
        //this.goal.enableBody = true;
    ////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////
        // Physics and Gravity
        // activating
        lib.enablePhysics(this.player, this.ground, this.goal); //, this.platform

        this.player.body.collideWorldBounds = true;

        // deactivating, sprites have body property after physics are enabled
        this.ground.body.allowGravity = false;
        //this.platform.body.allowGravity = false;

        // making the platform immovable, so it don't respond to hits
        this.ground.body.immovable = true;
        //this.platform.body.immovable = true;
        ////////////////////////////////////////////////////

         ///////////////////////////////////////////////////////////////
        // Goal
        this.goal.body.allowGravity = false;
        //////////////////////////////////////////////////////////////


        /////////////////////////////////////////////////////
        // On-screen Controls
        this.createOnscreenControls();
        ////////////////////////////////////////////////////
        //this.player.play('walking'); //


         //////////////////////////////////////////////////////
        // Camera
        // making the camera follow the player
        game.camera.follow(this.player);
        /////////////////////////////////////////////////////

        ///////////////////////////////////////////////////////////////////
        // Pool of Objects
        this.barrels = this.add.group();
        this.barrels.enableBody = true;

        // creates a barrel right away 
        this.createBarrel();
        // cretea a barrel every 5 seconds
        this.barrelCreator = game.time.events.loop(Phaser.Timer.SECOND * this.levelData.barrelFrequency, this.createBarrel, this);
        ///////////////////////////////////////////////////////////////////
    }

    update() {
        //////////////////////////////////////////////////////
        // Collision Detection!
        // COLLIDE will constantly check for collisions(physical way) that makes them interfere with each other
        game.physics.arcade.collide(this.player, this.ground, this.landed);
        game.physics.arcade.collide(this.player, this.platforms, this.landed);

        game.physics.arcade.collide(this.barrels, this.ground);
        game.physics.arcade.collide(this.barrels, this.platforms);
        /////////////////////////////////////////////////////////////
        // Fire
        game.physics.arcade.overlap(this.player, this.fires, this.killPlayer);
        game.physics.arcade.overlap(this.player, this.barrels, this.killPlayer);
        game.physics.arcade.overlap(this.player, this.goal, this.win);
        // OVERLAP is called only once when things 'touch' each other, but they don't interfere with each other in physical way
        //////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////
        // Keyboard Control && Player Animations
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown || this.player.customParams.isMovingLeft) {
            this.player.body.velocity.x = -this.RUNNING_SPEED;
            // setting scale back to normal, facing left side 
            this.player.scale.setTo(1 , 1); 
            this.player.play('walking'); // run left
        }
        else if (this.cursors.right.isDown || this.player.customParams.isMovingRight) {
            this.player.body.velocity.x = this.RUNNING_SPEED;
            // set the player to look to the opposite side (mirror)
            this.player.scale.setTo(-1 , 1);
            this.player.play('walking'); // then run right
        }
        else {
            this.player.animations.stop();
            this.player.frame = 3;
        }

        // touching down makes sure that the player is standing on something to be able to jump
        if ((this.cursors.up.isDown || this.player.customParams.mustJump) && this.player.body.touching.down) {
            this.player.body.velocity.y = -this.JUMPING_SPEED;
            this.player.customParams.mustJump = false;
        }
        
        ////////////////////////////////////////////////////
        //killing barrels
        this.barrels.forEach(e => {
            if(e.x < 10 && e.y > 600)
                e.kill();
        });
    }

    ////////////////////////////////////////////////////////////////////////////
    // Pool of Objects
    // always try to recycle objects in the code to avoid memory leaks(game crash)
    createBarrel(){
        //gets the first dead sprite
        let barrel = this.barrels.getFirstExists(false);
    
        // or if there is no barrels, create
        if(!barrel){
            barrel = this.barrels.create(0, 0, 'barrel');
        }

        // BOUCING BARRELS
        // makes the barrel collide with the world borders
        barrel.body.collideWorldBounds = true;
        barrel.body.bounce.set(1, 0); // bounces horizontally

        // reset the barrel to the initial position
        barrel.reset(this.levelData.goal.x, this.levelData.goal.y);
        barrel.body.velocity.x = this.levelData.barrelSpeed;
    }
    ////////////////////////////////////////////////////////////////////

    win(player, goal){
        // remember: alert will only show in the browser!
        alert('Win bb!!!!!!'); 
        game.state.restart();
    }

    /////////////////////////////////////////////////////////////
    // Fire
    killPlayer(player, fire){
        console.log('Auch!!!')
        game.state.restart();
    }
    ///////////////////////////////////////////////////////////

    landed(player, ground) {
        //console.log('landed');
    }

    // usefull for mobile
    createOnscreenControls(){
        this.leftArrow = game.add.button(20, 535, 'arrowButton');
        this.rightArrow = game.add.button(110, 535, 'arrowButton');
        this.actionButton = game.add.button(280, 535, 'actionButton');

        this.leftArrow.alpha = 0.5;
        this.rightArrow.alpha = 0.5;
        this.actionButton.alpha = 0.5;

        //////////////////////////////////////////////////////
        // Camera
        // fixed to not move with camera, if camera allowed
        this.leftArrow.fixedToCamera = true;
        this.rightArrow.fixedToCamera = true;
        this.actionButton.fixedToCamera = true;
        //////////////////////////////////////////////////////

        // onInputUp, when player releases button jump occurs;
        this.actionButton.events.onInputUp.add(() => {
            this.player.customParams.mustJump = true;
        });
        this.actionButton.events.onInputOver.add(() => {
            this.actionButton.alpha = 1;
        });
        this.actionButton.events.onInputOut.add(() => {
            this.actionButton.alpha = 0.5;
        });

        // left 
        this.leftArrow.events.onInputDown.add(() => {
            this.player.customParams.isMovingLeft = true;
        });
        this.leftArrow.events.onInputUp.add(() => {
            this.player.customParams.isMovingLeft = false;
        });
        // when button is on hover
        this.leftArrow.events.onInputOver.add(() => {
            this.leftArrow.alpha = 1;
        });
        // when button is out of hover
        this.leftArrow.events.onInputOut.add(() => {
            this.leftArrow.alpha = 0.5;
        });


        // right
        this.rightArrow.events.onInputDown.add(() => {
            this.player.customParams.isMovingRight = true;
        });
        this.rightArrow.events.onInputUp.add(() => {
            this.player.customParams.isMovingRight = false;
        });
        this.rightArrow.events.onInputOver.add(() => {
            this.rightArrow.alpha = 1;
        });
        this.rightArrow.events.onInputOut.add(() => {
            this.rightArrow.alpha = 0.5;
        });
    }

}