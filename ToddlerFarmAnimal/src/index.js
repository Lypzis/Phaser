class Main {

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
const game = new Phaser.Game(640, 360, Phaser.AUTO, 'game'); //832, 608

/*
const gameOptions = {
    playSound: true,
    playMusic: true
}

let musicPlayer;
*/

game.state.add('Main', Main);
game.state.start('Main');