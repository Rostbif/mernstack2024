import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

export type AddHotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  pricePerNight: string;
  starRating: string;
};

const AddHotel = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddHotelFormData>();

  const mutation = useMutation(apiClient.addHotel, {
    onSuccess: async () => {
      console.log("Hotel added successfully");
      showToast({ message: "Hotel added successfully", type: "SUCCESS" });
      navigate("/");
    },
    onError: (error: Error) => {
      console.log(error.message);
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold"> Add Hotel</h2>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Name
        <input
          type="text"
          className="border rounded w-full py-1 px-2 font-normal "
          {...register("name", { required: "This field is required" })}
        ></input>
        {errors.name && (
          <span className="text-red-500"> {errors.name.message}</span>
        )}
      </label>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          City
          <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal "
            {...register("city", { required: "This field is required" })}
          ></input>
          {errors.city && (
            <span className="text-red-500"> {errors.city.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Country
          <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal "
            {...register("country", { required: "This field is required" })}
          ></input>
          {errors.country && (
            <span className="text-red-500"> {errors.country.message}</span>
          )}
        </label>
      </div>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Description
        <textarea className="border rounded w-full py-1 px-2 font-normal "></textarea>
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Price Per Night
        <input
          type="text"
          className="border rounded w-full py-1 px-2 font-normal "
          {...register("pricePerNight", { required: "This field is required" })}
        ></input>
        {errors.pricePerNight && (
          <span className="text-red-500"> {errors.pricePerNight.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Star Rating
        <datalist
          id="ratings"
          className="border rounded w-full py-1 px-2 font-normal"
        >
          <option value="1"></option>
          <option value="2"></option>
          <option value="3"></option>
          <option value="4"></option>
          <option value="5"></option>
        </datalist>
      </label>
      <span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-x1"
        >
          Add Hotel
        </button>
      </span>
    </form>
  );
};

export default AddHotel;
