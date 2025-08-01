const { PredictionServiceClient } = require('@google-cloud/aiplatform');

// Your Google Cloud Project ID and Region
const PROJECT_ID = '381867178157'; 
const REGION = 'us-central1';

const clientOptions = {
  apiEndpoint: 'us-central1-aiplatform.googleapis.com',
};
const predictionServiceClient = new PredictionServiceClient(clientOptions);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const endpoint = `projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/imagen@2.0.0`;
  const request = {
    endpoint,
    instances: [{ prompt }],
    parameters: { sampleCount: 1 },
  };

  try {
    const [response] = await predictionServiceClient.predict(request);
    const imageBase64 = response.predictions[0].structValue.fields.bytesBase64Encoded.stringValue;
    return res.status(200).json({ imageBase64 });
  } catch (error) {
    console.error('Error calling Vertex AI:', error);
    return res.status(500).json({ error: 'Error generating image.' });
  }
}