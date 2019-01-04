const lib = {
    sayHello(){
        console.log('Hello from lib.js!');
    },

    /**
     * Centralizes elements to its 0x,0y axis 
     * @param {Array} spriteArray 
     */
    centralize(...spriteArray){
        spriteArray.forEach(element => {
            element.anchor.setTo(0.5);
        });
    },

    /**
     * - Enables sprites to interactions
     * @param {Array} spriteArray 
     */
    enable(...spriteArray){
        spriteArray.forEach(element => {
            element.inputEnabled = true
        });
    },
}