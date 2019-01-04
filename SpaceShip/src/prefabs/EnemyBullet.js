class EnemyBullet extends Phaser.Sprite {

    /////////////////////////////////////////////////
    // Prefabs
    constructor(game = SpaceHipster.game, x = 0, y = 0, key = 'bullet'){
        super(game, x, y, key);

        this.anchor.setTo(0.5);
        this.checkWorldBounds = true; // check if on world bounds
        this.outOfBoundsKill = true; // if out of bounds, kill this
        console.log('an enemy bullet created');
    }
    /////////////////////////////////////////////////
}