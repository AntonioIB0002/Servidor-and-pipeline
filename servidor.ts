import express from 'express';
import cors from 'cors';
import { pipeline } from '@xenova/transformers';

const app = express();
const port = 3000;

// Habilitar CORS para permitir que el frontend acceda al backend
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Función para analizar el sentimiento del texto
async function analyzeSentiment(text: string) {
  // Cargar el pipeline de análisis de sentimientos
  const sentimentAnalysis = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
  
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

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
