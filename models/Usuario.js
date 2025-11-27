import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  direccion: { type: String },
  rol: {
    type: String,
    enum: ['Residente', 'Porteria', 'Administracion'],
    default: 'Residente'
  },
  conjunto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conjunto'
  },
  activo: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Usuario', usuarioSchema);

