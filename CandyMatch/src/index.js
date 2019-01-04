class Main {

    init(){
        // loading screen will have a white backgrond
        game.stage.backgroundColor = '#fff';

        // scaling options
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // have the game centered horizontally
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

    }

    preload() {

        game.load.script('lib', './libs/lib.js');

        game.load.image('bar', './assets/images/preloader-bar.png');
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
const game = new Phaser.Game(360, 640, Phaser.AUTO, ''); //832, 608

game.state.add('Main', Main);
game.state.start('Main');