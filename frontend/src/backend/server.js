import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/generateImage', async (req, res) => {
  const { prompt } = req.body;
  console.log("Generating image with prompt:", prompt);

  // You should replace the below with actual AI image generation logic
  const dummyImageBase64 = "iVBORw0KGgoAAAANSUhEUgAA..."; // base64 of a real image

  res.json({ imageBase64: dummyImageBase64 });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));