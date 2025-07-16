const Band = require('./band');

class Bands {
    constructor() {
        this.bands = [];
    }

    // Agregar una nueva banda
    addBand(name) {
        const band = new Band(name);
        if (band.isValid()) {
            this.bands.push(band);
            return band;
        }
        throw new Error('Nombre de banda inválido');
    }

    // Obtener todas las bandas
    getBands() {
        return this.bands.map(band => band.toJSON());
    }

    // Buscar banda por ID
    getBandById(id) {
        return this.bands.find(band => band.id === id);
    }

    // Eliminar banda por ID
    deleteBand(id) {
        const index = this.bands.findIndex(band => band.id === id);
        if (index !== -1) {
            const deletedBand = this.bands.splice(index, 1)[0];
            return deletedBand.toJSON();
        }
        throw new Error('Banda no encontrada');
    }

    // Votar por una banda
    voteBand(id) {
        const band = this.getBandById(id);
        if (band) {
            band.incrementVotes();
            return band.toJSON();
        }
        throw new Error('Banda no encontrada');
    }

    // Obtener cantidad total de bandas
    getCount() {
        return this.bands.length;
    }

    // Obtener bandas ordenadas por votos (descendente)
    getBandsByVotes() {
        return this.bands
            .sort((a, b) => b.votes - a.votes)
            .map(band => band.toJSON());
    }

    // Limpiar todas las bandas
    clearBands() {
        this.bands = [];
    }

    // Inicializar con bandas predeterminadas
    initializeWithDefaultBands() {
        this.clearBands();
        const defaultBands = [
            { name: 'Queen', votes: 5 },
            { name: 'The Beatles', votes: 3 },
            { name: 'Pink Floyd', votes: 2 }
        ];

        defaultBands.forEach(bandData => {
            const band = new Band(bandData.name, bandData.votes);
            this.bands.push(band);
        });
    }
}

module.exports = Bands; 