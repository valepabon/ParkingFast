import mongoose from 'mongoose';

const comunidadSchema = new mongoose.Schema({
  tipoParqueadero: { type: String, enum: ['cubierto', 'descubierto'], required: true },
  tipoVehiculo: { type: String, enum: ['carro', 'moto'], required: true },
  precio: { type: Number, required: true },
  fechaDisponible: { type: Date, required: true },
  propietario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  telefono: { type: String, required: true },
  conjunto: { type: String, required: true },
  descripcion: { type: String, required: true },
  creadoEn: { type: Date, default: Date.now }
},
{ timestamps: true });

export default mongoose.model('Comunidad', comunidadSchema);
