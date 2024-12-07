import { useEffect, useState } from "react";
import { Button, Input, InputNumber, Select, message, Spin, UploadFile } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useAuth, useLocation, useRoom } from "@/hooks";
import useAmenities from "@/hooks/useAmenity";
import { Location, PropertyStatusEnum, PropertyTypeEnum, Room } from "@/types";
import { useNavigate } from "react-router-dom";
import ROUTES from "@/constants/routes";
import { InboxOutlined } from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";


const { Option } = Select;

const CreateRoom = () => {
  const { user } = useAuth();
  const { getLocations } = useLocation();
  const { getRoomTypes, createRoom, addRoomImages, addAmenitiesToProperty } = useRoom();
  const { getAmenities } = useAmenities();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState<string | undefined>("5AE52329-65B1-4790-806A-AA4D4D6D3D8A");
  const [fileList, setFileList] = useState<any[]>([]);

  // Fetch data
  const { data: locations } = getLocations();
  const { data: roomTypes } = getRoomTypes();
  const { data: amenities, isLoading: amenitiesLoading } = getAmenities();

  // InitialValues
  const stepOneInitialValues: Room = {
    propertyName: "",
    propertyDescription: "",
    propertyPricePerNight: 0,
    propertyStatus: PropertyStatusEnum.Available,
    propertyType: PropertyTypeEnum.Apartment,
    guests: 0,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    address: "",
    locationId: "",
    hostId: user?.id!,
  };

  const stepThreeInitialValues: { amenities: string[] } = {
    amenities: []
  };

  // Check User
  useEffect(() => {
    if (!user) {
      navigate(ROUTES.HOST_LOGIN);
    }
  }, [user, navigate]);

  // Schema Yup cho validation
  const validationSchemaStep1 = Yup.object({
    propertyName: Yup.string().required("Property name is required"),
    propertyPricePerNight: Yup.number().required("Price per night is required").positive("Price must be positive"),
    propertyType: Yup.number().required("Property type is required"),
    // propertyStatus: Yup.number().required("Property Status is required"),
    locationId: Yup.string().required("Location is required"),
    address: Yup.string().required("Address is required"),
    guests: Yup.number().required("Guests is required").positive("Guests must be positive").integer("Guests must be an integer"),
    bedrooms: Yup.number().required("Bedrooms is required").positive("Bedrooms must be positive").integer("Bedrooms must be an integer"),
    beds: Yup.number().required("Beds is required").positive("Beds must be positive").integer("Beds must be an integer"),
    bathrooms: Yup.number().required("Bathrooms is required").positive("Bathrooms must be positive").integer("Bathrooms must be an integer"),
    propertyDescription: Yup.string().required("Property description is required"),
  });

  const validationSchemaStep3 = Yup.object({
    amenities: Yup.array().min(1, "Select at least one amenity")
  });

  // Handle submit for Step 1 (Create room)
  const handleStep1Submit = async (values: Room) => {
    console.log(values);
    setLoading(true);
    try {
      const response = await createRoom.mutateAsync(values); // createRoom là hàm gọi API tạo phòng
      if (response.status || response.statusCode === 200) {
        setCreatedRoomId(response.payload);
        setStep(2);
        message.success("Room created successfully.");
      }
    } catch (error) {
      message.error("Failed to create room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload for Step 2
  const handleImageUpload = async (fileList: any[]) => {
    setFileList(fileList);
  };

  const handleImageSubmit = async () => {
    if (fileList.length === 0) {
      message.error("Please upload at least one image.");
      return;
    }

    console.log(fileList);

    setLoading(true);
    try {
      if (!createdRoomId) {
        throw new Error("Room ID is missing");
      }

      console.log({ id: createdRoomId, images: fileList })

      const formData = new FormData();
      fileList.forEach((file: UploadFile) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      console.log({ id: createdRoomId, images: formData })

      const response = await addRoomImages.mutateAsync({ id: createdRoomId, images: formData });

      if (response.status || response.statusCode === 200) {
        setStep(3);
        message.success("Images uploaded successfully.");
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to upload images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle amenities selection for Step 3
  const handleAmenitiesSubmit = async (values: { amenities: string[] }) => {
    setLoading(true);
    try {
      if (!createdRoomId) {
        throw new Error("Room ID is missing");
      }

      const response = await addAmenitiesToProperty.mutateAsync({ id: createdRoomId, payload: values.amenities });

      if (response.status || response.statusCode === 201) {
        message.success("Amenities updated successfully.");
        navigate(ROUTES.HOST_LISTINGS);
      }

    } catch (error) {
      message.error("Failed to update amenities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {loading && <Spin className="absolute inset-0 flex justify-center items-center" />}

      {step === 1 && (
        <Formik
          initialValues={stepOneInitialValues}
          validationSchema={validationSchemaStep1}
          onSubmit={handleStep1Submit}
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-8 p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
              {/* Property Name */}
              <div>
                <label className="text-xl font-medium text-gray-800">Property Name</label>
                <Field
                  name="propertyName"
                  as={Input}
                  className="w-full mt-2  border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-colors"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue("propertyName", e.target.value)}
                />
                <ErrorMessage name="propertyName" component="div" className="text-red-600 mt-2 text-sm" />
              </div>

              {/* Address */}
              <div>
                <label className="text-xl font-medium text-gray-800">Address</label>
                <Field
                  name="address"
                  as={Input}
                  className="w-full mt-2  border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-colors"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue("address", e.target.value)}
                />
                <ErrorMessage name="address" component="div" className="text-red-600 mt-2 text-sm" />
              </div>

              <div>
                <label className="text-xl font-medium text-gray-800">Property Description</label>
                <Field name="propertyDescription w-full mt-2">
                  {({ field, form }: any) => (
                    <CKEditor
                      editor={ClassicEditor}
                      data={field.value}
                      onChange={(event: any, editor: any) => {
                        form.setFieldValue("propertyDescription", editor.getData());
                      }}
                      onBlur={() => form.setFieldTouched("propertyDescription", true)}
                    />
                  )}
                </Field>
                <ErrorMessage name="propertyDescription" component="div" className="text-red-600 mt-2 text-sm" />
              </div>

              {/* Price per Night */}
              <div>
                <label className="text-xl font-medium text-gray-800">Price per Night</label>
                <Field
                  name="propertyPricePerNight"
                  as={InputNumber}
                  min={0}
                  className="w-full mt-2  border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-colors"
                  onChange={(value: number) => setFieldValue("propertyPricePerNight", value)}
                />
                <ErrorMessage name="propertyPricePerNight" component="div" className="text-red-600 mt-2 text-sm" />
              </div>

              {/* Property Type */}
              <div>
                <label className="text-xl font-medium text-gray-800">Property Type</label>
                <Field name="propertyType">
                  {({ field }: any) => (
                    <Select
                      {...field}
                      className="w-full mt-2  border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-colors"
                      onChange={(value: PropertyTypeEnum) => setFieldValue("propertyType", value)}
                      placeholder="Select Property Type"
                    >
                      {roomTypes?.map((type) => (
                        <Option key={type.id} value={type.id}>
                          {type.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Field>
                <ErrorMessage name="propertyType" component="div" className="text-red-600 mt-2 text-sm" />
              </div>

              {/* Property Status */}
              {/* <div>
                <label className="text-xl font-medium text-gray-800">Property Status</label>
                <Field name="propertyStatus">
                  {({ field }: any) => (
                    <Select
                      {...field}
                      className="w-full mt-2  border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-colors"
                      onChange={(value: PropertyStatusEnum) => setFieldValue("propertyStatus", value)}
                      placeholder="Select Property Status"
                    >
                      <Option value={PropertyStatusEnum.Available}>Available</Option>
                      <Option value={PropertyStatusEnum.Booked}>Booked</Option>
                      <Option value={PropertyStatusEnum.Unavailable}>Unavailable</Option>
                    </Select>
                  )}
                </Field>
                <ErrorMessage name="propertyStatus" component="div" className="text-red-600 mt-2 text-sm" />
              </div> */}

              {/* Guests */}
              <div>
                <label className="text-xl font-medium text-gray-800">Guests</label>
                <Field
                  name="guests"
                  as={InputNumber}
                  min={1}
                  className="w-full mt-2  border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-colors"
                  onChange={(value: number) => setFieldValue("guests", value)}
                />
                <ErrorMessage name="guests" component="div" className="text-red-600 mt-2 text-sm" />
              </div>

              {/* Bedrooms */}
              <div>
                <label className="text-xl font-medium text-gray-800">Bedrooms</label>
                <Field
                  name="bedrooms"
                  as={InputNumber}
                  min={1}
                  className="w-full mt-2  border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-colors"
                  onChange={(value: number) => setFieldValue("bedrooms", value)}
                />
                <ErrorMessage name="bedrooms" component="div" className="text-red-600 mt-2 text-sm" />
              </div>

              {/* Beds */}
              <div>
                <label className="text-xl font-medium text-gray-800">Beds</label>
                <Field
                  name="beds"
                  as={InputNumber}
                  min={1}
                  className="w-full mt-2  border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-colors"
                  onChange={(value: number) => setFieldValue("beds", value)}
                />
                <ErrorMessage name="beds" component="div" className="text-red-600 mt-2 text-sm" />
              </div>

              {/* Bathrooms */}
              <div>
                <label className="text-xl font-medium text-gray-800">Bathrooms</label>
                <Field
                  name="bathrooms"
                  as={InputNumber}
                  min={1}
                  className="w-full mt-2  border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-colors"
                  onChange={(value: number) => setFieldValue("bathrooms", value)}
                />
                <ErrorMessage name="bathrooms" component="div" className="text-red-600 mt-2 text-sm" />
              </div>

              {/* Location */}
              <div>
                <label className="text-xl font-medium text-gray-800">Select Location</label>
                <Field name="locationId">
                  {({ field }: any) => (
                    <Select
                      {...field}
                      placeholder="Select location"
                      onChange={(value: string[]) => setFieldValue("locationId", value)}
                      value={values.locationId}
                      className="w-full mt-2  border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      {locations?.map((location: Location) => (
                        <Option key={location.id} value={location.id}>
                          {location.city}, {location.country}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Field>
                <ErrorMessage name="locationId" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 font-semibold text-white bg-rose-500 rounded-md hover:bg-pink-600"
              // disabled={isSubmitting} // Disable button when loading
              >
                Tạo phòng
              </button>
            </Form>
          )}
        </Formik>
      )}

      {step === 2 && (
        <div>
          {/* Upload Images */}
          <Dragger
            multiple
            fileList={fileList}
            onChange={({ fileList }) => handleImageUpload(fileList)}
            showUploadList={true}
            customRequest={({ file, onSuccess }) => {
              // Simulate the upload
              setTimeout(() => onSuccess && onSuccess("ok"), 0);
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag images to this area to upload</p>
            <p className="ant-upload-hint">Supports multiple files.</p>
          </Dragger>

          <Button
            onClick={handleImageSubmit}
            type="primary"
            disabled={loading}
            className="mt-4 w-full py-2 font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Upload Images
          </Button>
        </div>
      )}

      {step === 3 && (
        <Formik
          validationSchema={validationSchemaStep3}
          initialValues={stepThreeInitialValues}
          onSubmit={handleAmenitiesSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-6 px-6 py-4 max-w-xl mx-auto bg-white rounded-lg shadow-md">
              {/* Select Amenities */}
              <div>
                <label className="text-lg font-semibold text-gray-700">Select Amenities</label>
                <Field name="amenities">
                  {({ field }: any) => (
                    <Select
                      {...field}
                      mode="multiple" // Chế độ multiple để chọn nhiều tiện ích
                      placeholder="Select amenities"
                      onChange={(value: string[]) => setFieldValue("amenities", value)} // Cập nhật giá trị mảng
                      value={values.amenities} // Đảm bảo giá trị của select được quản lý trong Formik state
                      className="w-full mt-2 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {amenities?.map((amenity) => (
                        <Option key={amenity.id} value={amenity.id}>
                          {amenity.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Field>
                <ErrorMessage name="amenities" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Submit Button */}
              <div className="mt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full py-2 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 ease-in-out"
                >
                  Complete
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default CreateRoom;
