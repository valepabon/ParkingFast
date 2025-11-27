import mongoose from "mongoose";

const parqueaderoSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  tipo: { type: String, enum: ["residente", "visitante", "arrendado"], required: true },
  estado: { type: String, enum: ["disponible", "ocupado", "reservado"], required: true },
  asignadoA: { type: String, default: "" },
  ubicacion: { type: String, default: "" },
  costo: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Parqueadero", parqueaderoSchema);
