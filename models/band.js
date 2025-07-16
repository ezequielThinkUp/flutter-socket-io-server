const { v4: uuidv4 } = require('uuid');

class Band {
    constructor(name, votes = 0) {
        this.id = uuidv4();
        this.name = name;
        this.votes = votes;
    }

    // Método para incrementar votos
    incrementVotes() {
        this.votes += 1;
        return this;
    }

    // Método para validar la banda
    isValid() {
        return this.name && this.name.trim() !== '';
    }

    // Método para convertir a objeto plano
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            votes: this.votes
        };
    }

    // Método estático para crear una banda desde datos existentes
    static fromData(data) {
        const band = new Band(data.name, data.votes);
        band.id = data.id; // Usar ID existente si se proporciona
        return band;
    }

    // Método estático para obtener todas las bandas predeterminadas
    static getDefaultBands() {
        return [
            { id: '1', name: 'Metallica', votes: 5 },
            { id: '2', name: 'Queen', votes: 1 },
            { id: '3', name: 'Héroes del Silencio', votes: 2 },
            { id: '4', name: 'Bon Jovi', votes: 5 }
        ];
    }

    // Método estático para crear múltiples bandas desde datos
    static createBandsFromData(bandsData) {
        return bandsData.map(data => {
            const band = new Band(data.name, data.votes);
            if (data.id) {
                band.id = data.id;
            }
            return band;
        });
    }

    // Método estático para inicializar el estado con bandas predeterminadas
    static initState() {
        const defaultBands = Band.getDefaultBands();
        return Band.createBandsFromData(defaultBands);
    }
}

module.exports = Band; 