import express, { Request, Response } from "express";
import { body, check, validationResult } from "express-validator";
import Hotel, { hotelType } from "../models/hotel";
import multer from "multer";
import cloudinary from "cloudinary";
import verifyToken from "../middleware/auth";

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
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imagefiles = req.files as Express.Multer.File[];
      const newHotel: hotelType = req.body;

      const uploadPromises = imagefiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });

      const imageUrls = await Promise.all(uploadPromises);
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      const hotel = new Hotel(newHotel);
      await hotel.save();
      res.status(201).send(hotel);
    } catch (e) {
      console.log("Error in creating an hotel:", e);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

// router.post(
//   "/add-hotel",
//   [
//     check("name", "Name is required").isString(),
//     check("city", "City is required").isString(),
//     check("country", "Country is required").isString(),
//     check("pricePerNight", "Price per night is required").isNumeric(),
//   ],
//   async (req: Request, res: Response) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ message: errors.array() });
//     }
//     try {
//       let hotel = await Hotel.findOne({ name: req.body.name });

//       if (hotel) {
//         return res.status(400).json({ message: "Hotel already exists" });
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(500).send({ message: "Something went wrong" });
//     }
//   }
// );

export default router;
