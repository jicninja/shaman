var CFG = {
    width: 1280,
    height: 720,
    fps: 60,

    gravity: {
        max: 40,
        acceleration: 1
    },


    players : {
        size: 0.4,
        //vidas
        lives: 5,

        //posición inicial
        default_position: {
            top: 100,
            left: 100
        },

        //velocidades de correr
        velocity: {
            max: 15,
            min: 3
        },

        //transparencias por tipos de jugador
        alpha: {
            PLAYABLE: 1,
            ENEMY: 0.5
        },

        //fuerza de salto
        jump: 17,

        //aceleracion de pique
        acceleration: {
            increase: 0.1,
            inertia: 0.5
        },

        //tipo de jugadores
        type: {
            PLAYABLE: 'CFG.playable',
            ENEMY:    'CFG.enemy'
        },

        //id
        default_id : 'self'
    }


};