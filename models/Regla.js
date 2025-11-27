import mongoose from 'mongoose';

const reglaSchema = new mongoose.Schema({
  conjunto: { type: String, required: true },
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model('Regla', reglaSchema);
