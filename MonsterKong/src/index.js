class Main {

    // Initiate some game-level settings
    init(){
        /////////////////////////////////////////////////////
        // Responsive scale mode: Very important
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT//EXACT_FIT//SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        ////////////////////////////////////////////////////

        ////////////////////////////////////////////////////
        // Physics and Gravity
        // start arcade physics system, Arcade runs by default if none specified.
        //game.physics.startSystem(Phaser.Physics.ARCADE); 
        // enable vertical gravity
        game.physics.arcade.gravity.y = 1000;
        ////////////////////////////////////////////////////

    }

    preload() {

        
        game.load.script('lib', './libs/lib.js');

        //game.load.image('loading', './assets/images/progress-bar.png');
        //game.load.image('brand', './assets/images/logo.png');
        game.load.script('Splash', './states/Splash.js');

    }

    create() {
        game.state.add('Splash', Splash);
        game.state.start('Splash');
    }
}

///////////////////////////////////////////////////////////////////////
// Initialize Phaser application
const game = new Phaser.Game(360, 592, Phaser.AUTO, ''); //832, 608


/*
const gameOptions = {
    playSound: true,
    playMusic: true
}

let musicPlayer;
*/

game.state.add('Main', Main);
game.state.start('Main');