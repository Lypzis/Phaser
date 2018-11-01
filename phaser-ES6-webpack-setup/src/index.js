import 'phaser';

import { SimpleScene } from './scenes/simple-scene';

const gameConfig = {
    width: 640,
    height: 400,
    scene: SimpleScene
};

new Phaser.Game(gameConfig);
