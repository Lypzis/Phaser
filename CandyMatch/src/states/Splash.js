class Splash {

    constructor() {
        
        // initialize variables before preload occurs
        this.preloadBar = game.make.sprite(game.world.centerX, game.world.centerY, 'bar');
        this.preloadBar.anchor.setTo(0.5);
        this.preloadBar.scale.setTo(100, 1);
        

        // call utils method to centralize sprites
        //utils.centerGameObjects([this.logo, this.status]);
    }

    loadScripts() {
        const states = [
            'Game'
        ];

        states.forEach(state => game.load.script(`${state}`, `./states/${state}.js`));
    }

    loadBgm() {
        /*
        const audios = [
            'dangerous',
            'fear_and_wonder'
        ];

        audios.forEach(audio => game.load.audio(`${audio}`, `./assets/bgm/${audio}.mp3`));
        */
    }

    loadImages() {
        [
            'bean_blue',
            'bean_green',
            'bean_orange',
            'bean_pink',
            'bean_purple',
            'bean_yellow',
            'bean_red',
            'bean_white',
        ].forEach((image, i) => game.load.image(`block${i+1}`, `./assets/images/${image}.png`));
        
        game.load.image('deadBlock', './assets/images/bean_dead.png');
        game.load.image('background', './assets/images/backyard2.png');
       
    }

    loadSpriteSheets() {
        /*
        const icons = [
            'warrior-icon',
            'hero-icon',
            'enemy-hero-icon',
            'enemy-warrior-icon'
        ];

        // portraits
        game.load.spritesheet('unities-portrait', './assets/images/unities-portrait.png', 60, 60);

        icons.forEach(icon => game.load.spritesheet(`${icon}`, `./assets/images/${icon}.png`, 30, 30));
        */
    }

    loadButtons() {
        /*
        const buttons = [
            'execute-btn'
        ];

        buttons.forEach(button => game.load.spritesheet(`${button}`, `./assets/images/${button}.png`, 165, 34));
        */
    }

    // loads a custom font
    loadFonts() {
        /*
        WebFont.load({
            custom: {
                families: [
                    'Kaisg',
                    'OldLondon-Alternate',
                    'OldLondon'
                ],
                urls: [
                    './assets/style/fonts.css', 
                ]
            }
        })
        */
    }

    loadMaps() {
        //game.load.tilemap('tilemap', './assets/maps/tableGround-map.txt', null, Phaser.Tilemap.TILED_JSON);
    }

    loadGameObjects() {
        
        [
            'Board',
            'Block'
        ].forEach(object => game.load.script(`${object}`, `./prefabs/${object}.js`));
        
    }

    preload() {
        // load sprites to the stage
        //game.add.existing(this.logo) //.scale.setTo(0.5) deprecated
        game.add.existing(this.preloadBar);
        //game.add.existing(this.status);
        game.load.setPreloadSprite(this.preloadBar, 0);

        // call previous functions
        this.loadScripts();
        this.loadImages();
        this.loadFonts();
        this.loadBgm();
        this.loadMaps();
        this.loadButtons();
        this.loadGameObjects();
        this.loadSpriteSheets();
    }

    // enqueue states to the game
    addGameStates() {
        game.state.add('Game', Game);

        /*
        game.state.add('TheGame', TheGame);
        game.state.add('GameOver', GameOver);
        game.state.add('Credits', Credits);
        game.state.add('Options', Options);
        */
    }

    addGameMusic() {
        /*
        // add background music and make it play in loop
        musicPlayer = game.add.audio('fear_and_wonder');
        musicPlayer.loop = true;
        //musicPlayer.play();
        */
    }

    create() {
        //changes 'Loading...' to the following text 
        //this.status.setText('Ready!');

        this.addGameStates();
        this.addGameMusic();

        setTimeout(() => {
            game.state.start('Game');
        }, 2000); //2000ms = 2s before loading next screen


    }

}