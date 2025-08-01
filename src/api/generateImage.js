import { PredictionServiceClient } from '@google-cloud/aiplatform';

const PROJECT_ID = process.env.GCP_PROJECT_ID;
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

    // Debug log
    console.log('Full response:', JSON.stringify(response, null, 2));

    const prediction = response.predictions?.[0];
    const imageBase64 = prediction?.structValue?.fields?.bytesBase64Encoded?.stringValue;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(500).json({ error: 'Invalid image data from Vertex AI.' });
    }

    return res.status(200).json({ imageBase64 });
  } catch (error) {
    console.error('Error calling Vertex AI:', error);
    return res.status(500).json({ error: 'Error generating image.' });
  }
}
