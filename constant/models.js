const { createGoogleGenerativeAI } = require("@ai-sdk/google");

const googleProvider = () => {
  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
  });

  return google;
};

module.exports = { googleProvider };
