import { connect } from 'mongoose';
import { config } from 'dotenv';

config(); // Carga variables de entorno

export const connectDatabase = async () => {
  console.log('Conectando a la base de datos...');

  const uri = `${process.env.MONGO_URL}`;

  try {
    const connection = await connect(uri);
    console.log('✅ Base de datos conectada:', connection.connection.name);
    return connection;
  } catch (error) {
    throw new Error('❌ Error de conexión a MongoDB: ' + error.message);
  }
};
