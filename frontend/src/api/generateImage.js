import { PredictionServiceClient } from '@google-cloud/aiplatform';

const PROJECT_ID = '54545017'; // Ensure this is a string
const REGION = 'us-central1';

const clientOptions = {
  apiEndpoint: `${REGION}-aiplatform.googleapis.com`,
};

const predictionServiceClient = new PredictionServiceClient(clientOptions);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required and must be a string.' });
  }

  const endpoint = `projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/imagen@2.0.0`;

  const request = {
    endpoint,
    instances: [{ prompt }],
    parameters: { sampleCount: 1 },
  };

  try {
    const [response] = await predictionServiceClient.predict(request);

    console.log('Full response from Vertex AI:', JSON.stringify(response, null, 2));

    const prediction = response.predictions?.[0];
    const imageBase64 = prediction?.structValue?.fields?.bytesBase64Encoded?.stringValue;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(500).json({ error: 'Invalid image data received from Vertex AI.' });
    }

    // Send base64 string back to frontend
    return res.status(200).json({ imageBase64 });
  } catch (error) {
    console.error('Error during image generation:', error);
    return res.status(500).json({ error: 'Image generation failed.' });
  }
}
