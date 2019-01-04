const lib = {
    sayHello(){
        console.log('Hello from lib.js!');
    },

    centralize(...spriteArray){
        spriteArray.forEach(e => e.anchor.setTo(0.5));
    },

    /**
     * - Enable physics in sprites.
     * @param {*} spriteArray 
     */
    enablePhysics(...spriteArray){
        spriteArray.forEach(e => game.physics.arcade.enable(e));
    }
}