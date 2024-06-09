import mongoose from "mongoose";

export type hotelType = {
  _id: string;
  name: string;
  city: string;
  country: string;
  description: string;
  pricePerNight: number;
  starRating: number;
};

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String, required: false },
  pricePerNight: { type: Number, required: true },
  starRating: { type: Number, required: false },
});

const Hotel = mongoose.model<hotelType>("Hotel", hotelSchema);

export default Hotel;
