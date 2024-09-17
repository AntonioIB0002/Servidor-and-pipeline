import { pipeline } from '@xenova/transformers';

async function analyzeSentiment(text: string) {
  // Cargar el pipeline de análisis de sentimientos
  const sentimentAnalysis = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
  
  // Analizar el sentimiento
  const result = await sentimentAnalysis(text);
  
  // Imprimir el resultado
  console.log(result);
}

// Texto de ejemplo
const text = 'I love this product! It works great.';

// Llamar a la función
analyzeSentiment(text).catch(console.error);
