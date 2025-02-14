const { HfInference } = require("@huggingface/inference");

const huggingFaceFluxProvider = () => {
  const HfFlux = new HfInference(process.env.HUGGING_FACE_API_KEY || "");

  return HfFlux;
};

module.exports = { huggingFaceFluxProvider };
