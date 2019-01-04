class Main {

    init(){
        /////////////////////////////////////////////////////
        // Responsive scale mode: Very important
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT//EXACT_FIT//SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        ////////////////////////////////////////////////////
    }

    preload() {

        
        this.load.script('lib', './libs/lib.js');

        //game.load.image('loading', './assets/images/progress-bar.png');
        //game.load.image('brand', './assets/images/logo.png');
        this.load.script('Splash', './states/Splash.js');

    }

    create() {
        this.state.add('Splash', Splash);
        this.state.start('Splash');
    }
}

///////////////////////////////////////////////////////////////////////
// Object Game, to keep things clean and not polute the global scope
const SpaceHipster = {};

// Initialize Phaser application
SpaceHipster.game = new Phaser.Game('100%', '100%', Phaser.AUTO); //832, 608

SpaceHipster.game.state.add('Main', Main);
SpaceHipster.game.state.start('Main');