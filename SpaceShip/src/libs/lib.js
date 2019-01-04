const lib = {
    sayHello(){
        console.log('Hello from lib.js!');
    },

    centralize(...array){
        array.forEach( e => e.anchor.setTo(0.5));
    }
}