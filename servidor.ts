import express from 'express';
import cors from 'cors';
import { pipeline } from '@xenova/transformers';
import { sigmoid } from '@tensorflow/tfjs';

const app = express();
const port = 3000;

// Habilitar CORS para permitir que el frontend acceda al backend
app.use(cors({
  origin: '*' // Permitir todas las solicitudes (puedes especificar dominios si es necesario)
}));


// Middleware para parsear JSON
app.use(express.json());

// Función para analizar el sentimiento del texto
async function analyzeSentiment(text: string) {
  // Cargar el pipeline de análisis de sentimientos
  const sentimentAnalysis = await pipeline('sentiment-analysis', 'Xenova/bert-base-multilingual-uncased-sentiment');
  
  // Analizar el sentimiento
  const result = await sentimentAnalysis(text);
  
  // Devolver el resultado del análisis
  return result;
}

// Endpoint GET para prueba
app.get('/hello', (req, res) => {
  res.send('Hello World from TypeScript!');
});

// Endpoint POST para analizar el mensaje enviado por el cliente
app.post('/message', async (req, res) => {
  const { message } = req.body;

  try {
    // Analizar el sentimiento del mensaje recibido
    const sentimentResult = await analyzeSentiment(message);

    // Devolver el resultado del análisis de sentimientos al cliente
    res.json({
      message: `Your message: ${message}`,
      sentiment: sentimentResult,
    });
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    res.status(500).json({ error: 'Error analyzing sentiment' });
  }
});

app.post('/analizarExcel', async (req, res) => {
  const { data } = req.body; // data debería ser un array de objetos

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    // Procesar cada fila en el array
    const processedData = await Promise.all(data.map(async (row) => {
      if (row['Review Text']) {
        // Analizar el sentimiento de la columna 'Review Text'
        const sentimentResult = await analyzeSentiment(row['Review Text']);
        return { analysis: sentimentResult }; // Devolver solo el análisis
      }
      return { analysis: null }; // Devolver null si no hay texto para analizar
    }));

    // Devolver el array de análisis de sentimientos
    res.json(processedData);
  } catch (error) {
    console.error('Error analyzing sentiments from Excel:', error);
    res.status(500).json({ error: 'Error analyzing sentiments from Excel' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
