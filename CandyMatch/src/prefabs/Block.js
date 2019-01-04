class Block extends Phaser.Sprite {
    constructor(state, x, y, data){
        super(game, x, y, data.asset);

        this.row = data.row;
        this.col = data.col;

        // necessary?
        // this.game = state.game;
        this.state = state;

        this.anchor.setTo(0.5);

        // listen for input
        this.inputEnabled = true;
        this.events.onInputDown.add(state.pickBlock, this.state);
    }

    resetBlock(x, y, data){
        this.loadTexture(data.asset); // load the texture

        this.row = data.row;
        this.col = data.col;
        this.reset(this, x, y); // calls Phaser default reset method
    }

    killBlock(){
        this.loadTexture('deadBlock');
        this.col = null;
        this.row = null;

        game.time.events.add(this.state.ANIMATION_TIME/2, ()=>{
            this.kill();
        }, this);
    }
}