const { streamText, smoothStream } = require("ai");
const googleProvider = require("./googleProvider");

const generateTextResponse = ({ params, res }) => {
  try {
    const { prompt, model } = params;

    // ------ GOOGLE PROVIDER ------
    const google = googleProvider();
    const generativeModel = google(model);

    // ------ STREAM TEXT ------
    const result = streamText({
      model: generativeModel,
      prompt,
      experimental_transform: smoothStream(),
    });

    return result.pipeTextStreamToResponse(res);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { generateTextResponse };
