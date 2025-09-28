require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();

// Configuración de CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'API funcionando 🚀',
    env: process.env.NODE_ENV || 'dev'
  });
});

// Puerto dinámico que Railway asigna
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ API corriendo en puerto ${PORT}`);
});
