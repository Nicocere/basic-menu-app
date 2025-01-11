// Script para generar clave (guardar como generate-key.ts)
import { randomBytes } from 'tweetnacl';
import { encodeBase64 } from 'tweetnacl-util';

const generateSecretKey = () => {
  // Generar 32 bytes aleatorios para la clave
  const key = randomBytes(32);
  // Convertir a base64 para almacenamiento
  return encodeBase64(key);
};
