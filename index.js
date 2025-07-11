require('dotenv').config();

const express = require('express');
const path = require('path');
const { createServer } = require('http');
const { initializeSocket } = require('./sockets/socket');

const app = express();
const httpServer = createServer(app);

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Lista de bandas inicial
let bands = [
  { id: '1', name: 'Queen', votes: 5 },
  { id: '2', name: 'The Beatles', votes: 3 },
  { id: '3', name: 'Led Zeppelin', votes: 8 },
  { id: '4', name: 'Pink Floyd', votes: 2 }
];

// Inicializar Socket.IO
const io = initializeSocket(httpServer, bands);

// Rutas HTTP
app.get('/api/bands', (req, res) => {
  res.json(bands);
});

app.post('/api/bands', (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'El nombre de la banda es requerido' });
  }

  const newBand = {
    id: Date.now().toString(),
    name: name.trim(),
    votes: 0
  };

  bands.push(newBand);

  // Emitir a todos los clientes conectados
  io.emit('active-bands', bands);

  res.json(newBand);
});

app.delete('/api/bands/:id', (req, res) => {
  const { id } = req.params;

  const bandIndex = bands.findIndex(band => band.id === id);

  if (bandIndex === -1) {
    return res.status(404).json({ error: 'Banda no encontrada' });
  }

  const deletedBand = bands.splice(bandIndex, 1)[0];

  // Emitir a todos los clientes conectados
  io.emit('active-bands', bands);

  res.json(deletedBand);
});

app.put('/api/bands/:id/vote', (req, res) => {
  const { id } = req.params;

  const band = bands.find(band => band.id === id);

  if (!band) {
    return res.status(404).json({ error: 'Banda no encontrada' });
  }

  band.votes += 1;

  // Emitir a todos los clientes conectados
  io.emit('active-bands', bands);

  res.json(band);
});



// Iniciar servidor
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 Socket.io habilitado`);
  console.log(`🎸 Servidor de bandas listo`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 App: ${process.env.APP_NAME || 'band_names_server'} v${process.env.APP_VERSION || '1.0.0'}`);
  if (process.env.DEBUG === 'true') {
    console.log(`🔍 Modo debug activado`);
  }
}); 