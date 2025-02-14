const { huggingFaceFluxProvider } = require("./huggingFaceProvider");

const generateFluxImage = async ({ params }) => {
  try {
    // ----- HUGGING FACE PROVIDER ------
    const huggingFace = huggingFaceFluxProvider();

    const response = await huggingFace.textToImage({
      inputs: params?.prompt,
      model: params?.model,
    });

    const buffer = response?.arrayBuffer();

    return buffer;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { generateFluxImage };
