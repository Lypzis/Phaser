/////////////////////////////////////////////////////////////////////
// Boot
class Main {
    

    // Initiate some game-level settings
    init(){
        /////////////////////////////////////////////////////
        // Responsive scale mode: Very important
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT//EXACT_FIT//SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        ////////////////////////////////////////////////////
    }

    // load the game assets/scripts before the game starts
    preload() {
        
        game.load.script('lib', './libs/lib.js');

        game.load.image('logo', './assets/images/logo.png');
        game.load.image('bar', './assets/images/bar.png');
        
        game.load.script('Splash', './states/Splash.js');
    }

    // execute before everything is loaded
    create() {
        // game.stage.backgroundColor = '#fff';
        game.state.add('Splash', Splash);
        game.state.start('Splash');
    }
}
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
// Initialize Phaser application
const game = new Phaser.Game(360, 640, Phaser.AUTO, ''); //832, 608

game.state.add('Main', Main);
game.state.start('Main');

/**
 * order of load
 * GameState
 * HomeState
 * PreloadState
 * BootState
 */