import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import Hotel from "../models/hotel";
import multer from "multer";
import cloudinary from "cloudinary";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
});

router.post(
  "/",
  upload.array("imagefiles", 6),
  async (req: Request, res: Response) => {
    const imagefiles = req.files as Express.Multer.File[];
    const newHotel = req.body;

    const uploadPromises = imagefiles.map(async (image) => {
      const b64 = Buffer.from(image.buffer).toString("base64");
      let dataURI = "data:" + image.mimetype + ";base64," + b64;
      const res = await cloudinary.v2.uploader.upload(dataURI);
      return res.url;
    });

    const imageUrls = await Promise.all(uploadPromises);
  }
);

router.post(
  "/add-hotel",
  [
    check("name", "Name is required").isString(),
    check("city", "City is required").isString(),
    check("country", "Country is required").isString(),
    check("pricePerNight", "Price per night is required").isNumeric(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      let hotel = await Hotel.findOne({ name: req.body.name });

      if (hotel) {
        return res.status(400).json({ message: "Hotel already exists" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

export default router;
