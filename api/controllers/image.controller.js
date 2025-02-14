const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const { HTTP_STATUS_CODE } = require("../../constant/constant");
const {
  generateFluxImage,
} = require("../helpers/huggingFace/generateFluxImage");
const User = require("../models/User");
const ImageGeneration = require("../models/ImageGeneration");

const generateImage = async (req, res) => {
  try {
    const userId = req.me.id;
    const { prompt, model } = req.body;
    const params = { prompt, model };

    // COLUDINARY CONFIG
    const cloudinaryConfig = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    };

    cloudinary.config(cloudinaryConfig);

    // Generate image as an array buffer
    const arrayBuffer = await generateFluxImage({ params });

    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(arrayBuffer);

    // Upload image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_FOLDER_NAME,
          public_id: `thinkhub-ai-generated-${1 + Math.random()}`,
          quality: 100,
          resource_type: "image",
          quality_analysis: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const file = {
      asset_id: uploadResult?.asset_id,
      width: uploadResult?.width,
      height: uploadResult?.height,
      url: uploadResult?.url,
      public_id: uploadResult?.public_id,
      secure_url: uploadResult?.secure_url,
      display_name: uploadResult?.display_name,
    };

    const findUser = await User.findById(userId);

    if (!findUser) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: "Unauthorized User",
      });
    }

    const payload = {
      userId,
      prompt,
      image: file,
    };

    const newImage = await ImageGeneration(payload);
    await newImage.save();
    return res.status(HTTP_STATUS_CODE.CREATED).json({
      status: HTTP_STATUS_CODE.CREATED,
      message: "Image Generated Successfully",
      data: "",
      error: "",
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.SERVER_ERROR,
      message: "",
      data: "",
      error: error.message,
    });
  }
};

const getImages = async (req, res) => {
  try {
    const userId = req.me.id;
    const { page = 1, limit = 10 } = req.query;

    const findUser = await User.findById(userId);

    if (!findUser) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: "Unauthorized User",
      });
    }

    const images = await ImageGeneration.find({ userId })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      message: "Images fetched successfully",
      data: images,
      error: "",
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.SERVER_ERROR,
      message: "",
      data: "",
      error: error.message,
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    // COLUDINARY CONFIG
    const cloudinaryConfig = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    };

    cloudinary.config(cloudinaryConfig);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: "Invalid Image ID",
      });
    }

    const findImage = await ImageGeneration.findOne({ _id: id });

    if (!findImage) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: "Image not found",
      });
    }

    // Attempt to delete image from Cloudinary
    try {
      const cloudinaryResponse = await cloudinary.uploader.destroy(
        findImage.image.public_id
      );

      // Check if the deletion was successful
      if (
        cloudinaryResponse.result !== "ok" &&
        cloudinaryResponse.result !== "not found"
      ) {
        return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
          status: HTTP_STATUS_CODE.SERVER_ERROR,
          message: "Failed to delete image from Cloudinary",
          data: cloudinaryResponse,
          error: "",
        });
      }
    } catch (cloudinaryError) {
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: "",
        data: "",
        error: cloudinaryError.message,
      });
    }

    // Proceed with deletion
    await ImageGeneration.deleteOne({ _id: id });

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      message: "Image deleted successfully",
      data: "",
      error: "",
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.SERVER_ERROR,
      message: "",
      data: "",
      error: error.message,
    });
  }
};

module.exports = { generateImage, getImages, deleteImage };
