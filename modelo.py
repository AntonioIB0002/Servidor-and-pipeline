from transformers import pipeline
import pandas as pd
import json

def sentimentAnalyst(excel):
    # Leer el archivo Excel
    df = pd.read_excel(excel)

    # Extraer el texto de la columna 'Review Text'
    review_text_column = df['Review Text']

    # Inicializar el pipeline para análisis de sentimiento
    resena = pipeline('sentiment-analysis', model="nlptown/bert-base-multilingual-uncased-sentiment")

    # Listas para almacenar resultados
    lista_internet = []

    # Iterar sobre cada comentario
    for comentario in review_text_column:
        if pd.isna(comentario):
            resultado_internet = "INDIFERENTE"
        else:
            resultado_internet = resena(str(comentario))
            resultado_internet = resultado_internet[0]['label']

        lista_internet.append(resultado_internet)

    # Agregar la columna de resultados al DataFrame
    df['Percepcion Internet'] = lista_internet

    # Convertir el DataFrame a un JSON
    result_json = df.to_dict(orient='records')

    return json.dumps(result_json, indent=4)

# Llamar a la función y mostrar el JSON resultante
json_result = sentimentAnalyst('resultado.xlsx')
print(json_result)
