const { Server } = require('socket.io');

// Configuración de Socket.IO
function initializeSocket(httpServer, bandsManager) {
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
        socket.emit('active-bands', bandsManager.getBands());

        // Manejar eventos de socket
        socket.on('vote-band', (payload) => {
            const { id } = payload;

            try {
                const band = bandsManager.voteBand(id);
                io.emit('active-bands', bandsManager.getBands());
            } catch (error) {
                console.error('Error al votar:', error.message);
            }
        });

        socket.on('add-band', (payload) => {
            const { name } = payload;

            if (name && name.trim() !== '') {
                try {
                    const newBand = bandsManager.addBand(name.trim());
                    io.emit('active-bands', bandsManager.getBands());
                } catch (error) {
                    console.error('Error al agregar banda:', error.message);
                }
            }
        });

        socket.on('delete-band', (payload) => {
            const { id } = payload;

            try {
                const deletedBand = bandsManager.deleteBand(id);
                io.emit('active-bands', bandsManager.getBands());
                console.log('Banda eliminada:', deletedBand);
            } catch (error) {
                console.error('Error al eliminar banda:', error.message);
            }
        });

        socket.on('nuevo-mensaje', (data) => {
            console.log('Mensaje recibido:', data);
            // Emitir el mensaje a todos los clientes conectados
            io.emit('nuevo-mensaje', data);
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });

    return io;
}

module.exports = { initializeSocket }; 