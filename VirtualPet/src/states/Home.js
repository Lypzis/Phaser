class Home {

    // can receive optional messages from other states when initializes
    init(message){ 
        this.message = message;
    }

    create(){
        const background = game.add.sprite(0, 0, 'backyard');

        background.inputEnabled = true;

        background.events.onInputDown.add(() => game.state.start('Game'));

        const style = {font: '30px Arial'};

        const text = game.add.text(game.world.centerX, game.world.centerY, '-- Press to Start --', style);

        if(this.message){
            lib.centralize(game.add.text(game.world.centerX, game.world.centerY - 200, this.message, style));
        }

        lib.centralize(text);
    }

}