import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema({
  codigo: { type: String, required: true }, // R-100, R-200, etc.

  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  conjunto: { type: mongoose.Schema.Types.ObjectId, ref: 'Conjunto', required: true },

  parqueadero: { type: String, required: true }, // Ej: "P-23", "Visitante 4"

  fecha: { type: String, required: true },
  horaInicio: { type: String, required: true },
  horaFin: { type: String, required: true },

  placa: { type: String, required: true },

  estado: {
    type: String,
    enum: [
      "pendiente",
      "activa",
      "confirmada",
      "cancelada",
      "cerrada"
    ],
    default: "pendiente"
  }
}, {
  timestamps: true
});

export default mongoose.model('Reserva', reservaSchema);


