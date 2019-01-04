class Game {
    
    //GameState

    create() {
        this.background = game.add.sprite(0, 0, 'backyard');
        this.background.events.onInputDown.add(this.placeItem, this);

        this.pet = game.add.sprite(100, 400, 'pet');

        //////////////////////////////////////////////////////////
        // Pet Animation
        this.pet.animations.add('funnyFaces', [1, 2, 3, 2, 1], 7, false);
        this.pet.animations.add('roll', [3]);
        this.pet.animations.add('default', [0]);
        //////////////////////////////////////////////////////

        this.pet.customParams = {
            health: 100,
            fun: 100
        }

        // distance x of 72px
        this.apple = game.add.sprite(72, 590, 'apple');
        this.apple.customParams = { health: 20 };

        this.candy = game.add.sprite(144, 590, 'candy');
        this.candy.customParams = { health: -10, fun: 10 };

        this.toy = game.add.sprite(216, 590, 'rubber_duck');
        this.toy.customParams = { fun: 20 };

        this.rotate = game.add.sprite(288, 590, 'rotate');

        //console.log(this.pet.customParams.health);
        //console.log(typeof(this.pet.customParams.health));

        lib.centralize(this.pet, this.apple, this.candy, this.toy, this.rotate);

        ///////////////////////////////////////////////////////////////////////////
        // Draggable Pet
        lib.enable(this.pet, this.apple, this.candy, this.toy, this.rotate, this.background);

        this.pet.input.enableDrag();

        this.apple.events.onInputDown.add(this.pickItem, this);
        this.candy.events.onInputDown.add(this.pickItem, this);
        this.toy.events.onInputDown.add(this.pickItem, this);
        this.rotate.events.onInputDown.add(this.rotatePet, this);

        this.buttons = [this.apple, this.candy, this.toy, this.rotate];

        ///////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////
        // Item Selection
        //nothing is selected
        this.selectedItem = null;
        this.uiBlocked = false;
        /////////////////////////////////////////////////////////////////////////

        ///////////////////////////////////////////////////////////////////////
        // Game Stats
        const style = { font: '20px Arial', fill: '#fff' };
        game.add.text(10, 20, 'Health: ', style);
        game.add.text(140, 20, 'Fun: ', style);

        this.healthText = game.add.text(80, 20, '', style);
        this.funText = game.add.text(185, 20, '', style);

        this.refreshStats();
        //////////////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////////////////
        // Decreasing pet Stats
        // decrease health(executes reduceProperties function) every 5 seconds
        this.statDecreaser = game.time.events.loop(Phaser.Timer.SECOND * 5, this.reduceProperties, this);
        /////////////////////////////////////////////////////////////////////////

    }

    // execute multiple times per second
    update() {
        this.refreshStats();
        this.checkPetAlive();
    }

    checkPetAlive(){
        if(this.pet.customParams.health <= 0 || this.pet.customParams.fun <= 0){
            // Interesting, You don't need to make an animation with just one frame, just simply set the current frame! ;D
            this.pet.frame = 4;
            this.uiBlocked = true;
            
            // after three seconds, call gameOver()
            game.time.events.add(3000, this.gameOver, this);
        }
    }

    gameOver(){
        // restart this state
        //game.state.restart();

        game.state.start('Home', true, false, 'GAME OVER!');
    }

    reduceProperties() {
        this.pet.customParams.health -= 10;
        this.pet.customParams.fun -= 15;
    }

    refreshStats() {
        this.healthText.text = this.pet.customParams.health;
        this.funText.text = this.pet.customParams.fun;
    }

    pickItem(sprite, event) {
        //console.log(sprite);
        //console.log(event);


        if (!this.uiBlocked) {
            console.log('item picked!');

            this.clearSelection();

            //adds transparency(changes opacity) to the sprite selected
            sprite.alpha = 0.4;

            this.selectedItem = sprite;
        }
    }

    rotatePet(sprite, event) {
        if (!this.uiBlocked) {
            console.log('pet rotating!');

            // while rotating, block other interactions
            this.uiBlocked = true;

            this.clearSelection();

            sprite.alpha = 0.4;

            this.pet.animations.play('roll');

            ///////////////////////////////////////////////////
            // Rotation of the Pet
            const petRotation = game.add.tween(this.pet);

            petRotation.to({ angle: '+720' }, 1000);

            petRotation.onComplete.add(() => {
                this.uiBlocked = false;

                sprite.alpha = 1;

                this.pet.customParams.fun += 10;
                console.log(this.pet.customParams.fun);
                this.pet.animations.play('default');

                //this.refreshStats();
            });

            petRotation.start();
            ///////////////////////////////////////////////////
        }
    }

    clearSelection() {
        // makes all sprites back to normal opacity
        this.buttons.forEach((e, index) => e.alpha = 1);
        this.selectedItem = null;
    }

    placeItem(sprite, event) {
        if (this.selectedItem && !this.uiBlocked) {
            const x = event.position.x;
            const y = event.position.y;

            const newItem = game.add.sprite(x, y, this.selectedItem.key);
            newItem.anchor.setTo(0.5);
            newItem.customParams = this.selectedItem.customParams;

            /////////////////////////////////////////////////////////////
            // Moving the Pet to the Item
            //making the sprite move to the item location and consuming it

            this.uiBlocked = true;

            // Powerfull TWEENS!!!!
            const petMovement = game.add.tween(this.pet);
            petMovement.to({ x: x, y: y }, 700);

            petMovement.onComplete.add(() => {
                this.uiBlocked = false;

                this.pet.animations.play('funnyFaces');

                for (let stat in newItem.customParams) {
                    //IMPORTANT TO USE; only pass if object has one of the customParams;
                    if (newItem.customParams.hasOwnProperty(stat)) {
                        // then add the stat to the pet;
                        this.pet.customParams[stat] += newItem.customParams[stat];
                        console.log(stat);
                    }
                }

                //this.refreshStats();

                newItem.destroy();
            });

            petMovement.start();
            /////////////////////////////////////////////////////////////////

            this.clearSelection();
        }

    }
}