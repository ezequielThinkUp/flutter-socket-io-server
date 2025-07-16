require('dotenv').config();

const express = require('express');
const path = require('path');
const { createServer } = require('http');
const { initializeSocket } = require('./sockets/socket');
const Bands = require('./models/bands');
const Band = require('./models/band');

const app = express();
const httpServer = createServer(app);

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Inicializar lista de bandas con el modelo
const bandsManager = new Bands();
// Inicializar con bandas predeterminadas
Band.initState().forEach(band => {
  bandsManager.bands.push(band);
});

// Inicializar Socket.IO
const io = initializeSocket(httpServer, bandsManager);

// Rutas HTTP
app.get('/api/bands', (req, res) => {
  res.json(bandsManager.getBands());
});

app.post('/api/bands', (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'El nombre de la banda es requerido' });
  }

  try {
    const newBand = bandsManager.addBand(name.trim());

    // Emitir a todos los clientes conectados
    io.emit('active-bands', bandsManager.getBands());

    res.json(newBand.toJSON());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/bands/:id', (req, res) => {
  const { id } = req.params;

  try {
    const deletedBand = bandsManager.deleteBand(id);

    // Emitir a todos los clientes conectados
    io.emit('active-bands', bandsManager.getBands());

    res.json(deletedBand);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.put('/api/bands/:id/vote', (req, res) => {
  const { id } = req.params;

  try {
    const band = bandsManager.voteBand(id);

    // Emitir a todos los clientes conectados
    io.emit('active-bands', bandsManager.getBands());

    res.json(band);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
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