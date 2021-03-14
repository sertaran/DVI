/*
Práctica 1
Sergio Tarancón Martínez
*/

var MemoryGame = MemoryGame || {};

MemoryGame = function(gs) {
	
    this.gs = gs;
	//array dónde se colocan las cartas
    this.tablero = [];
	//mensaje de la parte superior
    this.mensaje = "Juego Memoria Spectrum";
	//número de cartas encontradas
    this.nEncontradas = 0;
	//carta elegida para voltear
    this.elegida = null;
    this.timeout = 0;
    
    this.initGame = function(){
		//cartas que componen el juego
		var cartas = ['perico','mortadelo','fernandomartin','sabotaje','phantomas','poogaboo','sevilla','abadia'];
		var i, j, tab;
		//recorrido del tablero rellenando con cada una de las cartas (2 veces)
        for(i = 0; i < cartas.length; i++){
             this.tablero[i] = new MemoryGameCard(cartas[i]);
             this.tablero[cartas.length+i] = new MemoryGameCard(cartas[i]);
        }
        this.loop();
		//reordeno las posiciones de las cartas en un nuevo tablero
		for (i = this.tablero.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            tab =  this.tablero[i];
            this.tablero[i] = this.tablero[j];
            this.tablero[j] = tab;
        }
    };

    this.draw = function(){
		//comprobamos que las cartas encontradas no sean tantas como componen el tablero
        if(this.nEncontradas < this.tablero.length) 
            gs.drawMessage(this.mensaje);
		//si lo son la partida ha acabado con victoria
        else 
            gs.drawMessage("¡Has Ganado!");
		//recorremos el tablero y pintamos el dorso de las cartas si el estado es 0, si no pintamos la cara de la carta correspondiente
        for(i = 0; i < 16; i++){
            if(this.tablero[i].estado === 0)
                this.gs.draw("back", i);
            else
                this.gs.draw(this.tablero[i].id, i);
        }
    };
    
    this.loop = function(){        
        var that = this;		
		setInterval(function(){that.draw()}, 16);        
    };

    this.onClick = function (carta){    
        var that = this;
        //comprobamos si hay posibilidad de voltear cartas
		if(carta >= 0 && carta <= 15 && carta !== null && !this.timeout){
            //comprobamos si podemos voltear una carta
			if(this.elegida === null && this.tablero[carta].estado === 0){
				this.tablero[carta].flip();
				this.elegida = this.tablero[carta];
			}else if(this.tablero[carta].estado === 0){
				this.tablero[carta].flip();
				// si ambas cartas son iguales, se ha encontrado la pareja
				if(this.tablero[carta].compareTo(this.elegida)){
					this.tablero[carta].found();
					this.elegida.found();
					that.elegida = null;
					this.nEncontradas += 2;
					this.mensaje = "¡Pareja encontrada!";
				//si no, ambas cartas se vuelven a voltear al estado 0
				}else{
					this.timeout = 1;
					setTimeout(function(){
						that.elegida.flip();
						that.tablero[carta].flip();
						that.elegida = null;
						that.timeout = 0;
					}, 1000);
					this.mensaje = "Inténtalo de nuevo";
				}
			}
		};
    }
};



MemoryGameCard = function(id) {	
	//estado de la carta: 0 sin voltear, 1 volteada, 2 encontrada
    this.estado = 0;
    this.id = id;   
	//cambiamos el estado al voltear la carta
    this.flip = function(){
        if(this.estado === 0)
            this.estado = 1;
        else
            this.estado = 0;       
    };	
	//cambiamos el estado al encontrar la carta (pareja)
    this.found = function(){
        this.estado = 2;
    };   
	//comparamos las cartas
    this.compareTo = function (otherCard){
        return this.id === otherCard.id;
    };
};