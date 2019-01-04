class Splash {

    constructor() {
        /*
        // initialize variables before preload occurs
        this.loadingBar = game.make.sprite(game.world.centerX - (382 / 2), 400, 'loading');
        this.logo = game.make.sprite(game.world.centerX, 200, 'brand');
        this.status = game.make.text(game.world.centerX, 380, 'Loading...', { fill: 'white' });
        */

        // call utils method to centralize sprites
        //utils.centerGameObjects([this.logo, this.status]);
    }

    loadScripts() {
        const states = [
            'Game'
        ];

        states.forEach(state => this.load.script(`${state}`, `./states/${state}.js`));
    }

    loadBgm() {
        [
            '8bit-orchestra'
        ].forEach(audio => this.load.audio(`${audio}`, [`./assets/audio/${audio}.mp3`, `./assets/audio/${audio}.ogg`]));
        
    }

    loadImages() {
        [
            'bullet',
            'player',
            'enemyParticle',
            'space'
        ].forEach(image => this.load.image(`${image}`, `./assets/images/${image}.png`));
        
    }

    loadSpriteSheets() {
        [
            'green_enemy',
            'red_enemy',
            'yellow_enemy'
        ].forEach(icon => this.load.spritesheet(`${icon}`, `./assets/images/${icon}.png`, 50, 46, 3, 1, 1));
          
    }

    loadGameObjects() {
        [
            'PlayerBullet',
            'EnemyBullet',
            'Enemy',
        ].forEach(object => this.load.script(`${object}`, `./prefabs/${object}.js`));
    }

    loadMaps() {
        //////////////////////////////////////////////////////////////
        // Loading JSON files
        // load data coordinates from json
        // it's good to separate level content data from the actual 
        // code of the game engine
        this.load.text('level1', 'assets/data/level1.json');
        this.load.text('level2', 'assets/data/level2.json');
        this.load.text('level3', 'assets/data/level3.json');
        ////////////////////////////////////////////////////////////

        //game.load.tilemap('tilemap', './assets/maps/tableGround-map.txt', null, Phaser.Tilemap.TILED_JSON);
    }

    preload() {
        // load sprites to the stage
        //game.add.existing(this.logo) //.scale.setTo(0.5) deprecated
        //game.add.existing(this.loadingBar);
        //game.add.existing(this.status);
        //this.load.setPreloadSprite(this.loadingBar, 0);

        // call previous functions
        this.loadMaps(); 
        this.loadScripts();
        this.loadImages();
        this.loadSpriteSheets();
        this.loadBgm();
        this.loadGameObjects();
    }

    // enqueue states to the game
    addGameStates() {
        this.state.add('Game', Game);

        /*
        game.state.add('TheGame', TheGame);
        game.state.add('GameOver', GameOver);
        game.state.add('Credits', Credits);
        game.state.add('Options', Options);
        */
    }

    addGameMusic() {
        
        // add background music and make it play in loop
        this.soundTrack = this.add.audio('8bit-orchestra');
        this.soundTrack.loop = true;
        this.soundTrack.play();
        
    }

    create() {
        //changes 'Loading...' to the following text 
        //this.status.setText('Ready!');

        this.addGameStates();
        this.addGameMusic();

        setTimeout(() => {
            this.state.start('Game');
        }, 2000); //2000ms = 2s before loading next screen


    }

}