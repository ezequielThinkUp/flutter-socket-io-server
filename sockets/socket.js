const { Server } = require('socket.io');

// Configuración de Socket.IO
function initializeSocket(httpServer, bands) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.SOCKET_IO_CORS_ORIGIN || "*",
            methods: ["GET", "POST"]
        }
    });

    // Configuración de Socket.io
    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        // Enviar lista de bandas al cliente recién conectado
        socket.emit('active-bands', bands);

        // Manejar eventos de socket
        socket.on('vote-band', (payload) => {
            const { id } = payload;
            const band = bands.find(band => band.id === id);

            if (band) {
                band.votes += 1;
                io.emit('active-bands', bands);
            }
        });

        socket.on('add-band', (payload) => {
            const { name } = payload;

            if (name && name.trim() !== '') {
                const newBand = {
                    id: Date.now().toString(),
                    name: name.trim(),
                    votes: 0
                };

                bands.push(newBand);
                io.emit('active-bands', bands);
            }
        });

        socket.on('delete-band', (payload) => {
            const { id } = payload;

            const bandIndex = bands.findIndex(band => band.id === id);
            if (bandIndex !== -1) {
                bands.splice(bandIndex, 1);
                io.emit('active-bands', bands);
            }
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });

    return io;
}

module.exports = { initializeSocket }; 