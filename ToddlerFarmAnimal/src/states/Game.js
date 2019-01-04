class Game {

    create() {
        /////////////////////////////////////////////////////
        // Responsive scale mode: Very important
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        ////////////////////////////////////////////////////

        this.background = game.add.sprite(0, 0, 'background');

        //this.chicken = game.add.sprite(game.world.centerX, game.world.centerY, 'chicken')

        ///////////////////////////////////////////////////////
        // flips horizontally and vertically
        // this.chicken.scale.setTo(-1, -1);

        //this.horse = game.add.sprite(100, 100, 'horse');

        ////////////////////////////////////////////////////////
        // rotate a sprite, based on the anchor point, 
        // positive: clockwise,
        // negative: counter clockwise
        //this.horse.angle = 45;

        ///////////////////////////////////////////////////////////////////////////
        // Groups
        const animalData = [
            { key: 'chicken_spritesheet', text: 'CHICKEN', audio: 'chicken' }, // replaced to be spritesheet
            { key: 'horse_spritesheet', text: 'HORSE', audio: 'horse' },
            { key: 'pig_spritesheet', text: 'PIG', audio: 'pig' },
            { key: 'sheep_spritesheet', text: 'SHEEP', audio: 'sheep' }
        ];

        this.animals = game.add.group();

        let animal;

        animalData.forEach(e => {
            animal = this.animals.create(game.world.centerX - 1000, game.world.centerY, e.key, 0);//,starting frame would be next parameter

            // Make sure to save everything that's not Phaser-related in an object
            animal.customParams = {
                text: e.text,
                sound: game.add.audio(e.audio)
            };

            ///////////////////////////////////////////////////////////////////////////
            // Adding sound

            //////////////////////////////////////////////////////////////////////////

            /////////////////////////////////////////////////////////////////////
            // Spritesheet Animations
            animal.animations.add('animate', [0, 1, 2, 1, 0, 1], 3, false);
            ////////////////////////////////////////////////////////////////////

            animal.inputEnabled = true;
            animal.input.pixelPerfectClick = true;
            animal.events.onInputDown.add(this.animateAnimal, this);
            lib.centralize([animal]);
        });

        this.currentAnimal = this.animals.next(); // or previous();
        this.currentAnimal.position.set(game.world.centerX, game.world.centerY);
        ///////////////////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////////////
        // Adding Text
        this.showText(this.currentAnimal);
        ////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////
        // User Input
        // right arrow
        this.rightArrow = game.add.sprite(game.world.centerX + 250, game.world.centerY, 'arrow');
        this.rightArrow.customParams = { direction: 1 }; // custom parameters, duh
        this.rightArrow.inputEnabled = true;
        this.rightArrow.input.pixelPerfectClick = true;
        this.rightArrow.events.onInputDown.add(this.switchAnimal, this);

        // left arrow
        this.leftArrow = game.add.sprite(game.world.centerX - 250, game.world.centerY, 'arrow');
        this.leftArrow.customParams = { direction: -1 }; // custom parameters, duh
        this.leftArrow.scale.setTo(-1, 1);
        this.leftArrow.inputEnabled = true;
        this.leftArrow.input.pixelPerfectClick = true; // expensive for hardware, only use if really necessary
        this.leftArrow.events.onInputDown.add(this.switchAnimal, this);

        //this.chicken.inputEnabled = true;
        //this.chicken.events.onInputDown.add(this.animateAnimal, this);
        //this.chicken.input.pixelPerfectClick = true;
        //////////////////////////////////////////////////////////////////

        lib.centralize(
            [
                this.currentAnimal,
                this.rightArrow,
                this.leftArrow
            ]); //, this.horse
    }

    switchAnimal(sprite, event) {
        //1. get the direction of the arrow
        //2. get next animal
        //3. get final destination of current animal
        //4. move current animal to final destination
        //5. set the next animal as the new current animal

        // only move another object when the transition is over.
        if (this.isMoving) {
            return false;
        }

        this.isMoving = true;

        // hide text
        this.animalText.visible = false;

        let newAnimal, endX;

        if (sprite.customParams.direction > 0) {
            newAnimal = this.animals.next();
            newAnimal.x = -newAnimal.width / 2;

            endX = 640 + this.currentAnimal.width / 2;
        } else {
            newAnimal = this.animals.previous();
            newAnimal.x = 640 + newAnimal.width / 2;
            endX = -this.currentAnimal.width / 2;
        }

        /////////////////////////////////////////////////////////////////////////////
        // Tween Animations
        // making a Tween of newAnimal. (transitions)
        const newAnimalMovement = game.add.tween(newAnimal);
        // the animal final destination to the center of screen, smoothly occurs in 1sec.
        newAnimalMovement.to({ x: game.world.centerX }, 1000);
        // on completion, use callback to enable clicking
        newAnimalMovement.onComplete.add(() => {
            this.isMoving = false
            /////////////////////////////////////////////////////////////////////
            // Adding Text
            this.showText(newAnimal);
            ////////////////////////////////////////////////////////////////////
        });
        newAnimalMovement.start(); //start/enable it; 

        const currentAnimalMovement = game.add.tween(this.currentAnimal);
        currentAnimalMovement.to({ x: endX }, 1000);
        currentAnimalMovement.start(); //start/enable it; 

        this.currentAnimal = newAnimal;
        ///////////////////////////////////////////////////////////////////////////
        /*
        this.currentAnimal.x = endX;
        newAnimal.x = game.world.centerX;
        this.currentAnimal = newAnimal;
        */

        console.log('move animale');
    }

    animateAnimal(sprite, event) {
        sprite.play('animate');
        sprite.customParams.sound.play();
    }

    showText(animal) {
        if(!this.animalText){
            const style = {
                font: 'bold 30pt Arial',
                fill: '#D0171B',
                align: 'center'
            }

            this.animalText = game.add.text(game.width/2, game.height * 0.85, '', style);
            this.animalText.anchor.setTo(0.5);
        }

        this.animalText.setText(animal.customParams.text);
        this.animalText.visible = true;
    }

    update() {
        ///////////////////////////////////////
        //this.horse.angle += 0.5;
    }
}