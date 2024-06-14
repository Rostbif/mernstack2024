import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";
import React from "react";

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<HotelFormData>();

  const existingImagesUrls = watch("imageUrls");

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrl: string
  ) => {
    e.preventDefault();

    setValue(
      "imageUrls",
      existingImagesUrls.filter((url) => url !== imageUrl)
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        {existingImagesUrls && (
          <div className="grid grid-cols-6 gap-4">
            {existingImagesUrls.map((url) => (
              <div className="relative group" key={url}>
                <img src={url} className="min-h-full object-cover" />
                <button
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
                  onClick={(event) => handleDelete(event, url)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          multiple
          accept="image/*"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const totalLength =
                imageFiles.length + (existingImagesUrls?.length || 0);

              if (totalLength === 0) {
                return "At least one image is required";
              }

              if (totalLength > 6) {
                return "Maximum 6 images are allowed";
              }

              return true;
            },
          })}
        />
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-bold">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};

export default ImagesSection;
