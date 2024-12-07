import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation, useRoom } from '@/hooks';
import { Upload, message, Image, Modal } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { UploadFile, UploadProps } from 'antd';
import { CONFIG } from '@/config/appConfig';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { PropertyTypeEnum, Room } from '@/types';
import useAmenities from '@/hooks/useAmenity';

type Props = {};

const EditRoom = ({ }: Props) => {
  const { slug } = useParams<{ slug: string }>();
  const { getRoomBySlug, addRoomImages, deleteRoomImage, updateRoom, getRoomAmenitiesBySlug, updateRoomAmenities, publishRoom } = useRoom();
  const { getLocations } = useLocation();
  const { getAmenities } = useAmenities();

  const { data: roomData } = getRoomBySlug(slug || "");
  const { data: locations } = getLocations();
  const { data: roomAmenities } = getRoomAmenitiesBySlug(slug || "");
  const { data: amenities } = getAmenities();
  const { mutate: updateRoomInfor } = updateRoom();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fieldToUpdate, setFieldToUpdate] = useState<keyof Room | null>(null);
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [initialValue, setInitialValue] = useState<string | null>("");

  // Amenities
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle opening and closing of the modal
  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (roomData?.propertyImageUrls?.length) {
      setFileList(roomData.propertyImageUrls.map((url, index) => ({
        uid: `${index}`,
        name: `image-${index}`,
        status: 'done',
        url: `${CONFIG.SERVER_URL}${url}`,
      })));
    }
  }, [roomData]);


  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Handle removing an image (e.g., delete it from the server)
  const onRemove: UploadProps['onRemove'] = async (file) => {
    try {
      const imageUrl = file.url || '';
      if (imageUrl) {
        // Remove the CONFIG.SERVER_URL from the URL
        const imageUrlWithoutServer = imageUrl.replace(CONFIG.SERVER_URL, '');

        // Call API to delete the image
        const response = await deleteRoomImage.mutateAsync({
          roomId: roomData?.id || '',
          imageUrl: imageUrlWithoutServer,
        });


        if (response.status && response.statusCode === 200) {
          message.success('Image deleted successfully!');
          setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
        }
      }
    } catch (error) {
      message.error('Failed to delete image.');
    }
  };

  // Preview image in modal
  const handlePreview = (file: UploadFile) => {
    setPreviewImage(file.url || '');
    setPreviewOpen(true);
  };

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append('images', file);

    try {
      const response = await addRoomImages.mutateAsync({
        id: roomData?.id!,
        images: formData
      });

      // Kiểm tra trạng thái và statusCode trong response
      if (response.status && response.statusCode === 200) {
        onSuccess && onSuccess(file); // Thành công, gọi onSuccess
        message.success('Ảnh đã được upload thành công!');
      } else {
        onError && onError(new Error('Failed to upload image')); // Lỗi, gọi onError
        message.error('Có lỗi xảy ra khi upload ảnh');
      }
    } catch (error) {
      onError && onError(error); // Xử lý lỗi nếu có
      message.error('Có lỗi xảy ra khi upload ảnh');
    }
  };


  const getFieldValidation = () => {
    switch (fieldToUpdate) {
      case 'propertyName':
        return Yup.string().required('Property name is required');
      case 'propertyPricePerNight':
        return Yup.number().required('Price is required').positive('Price must be positive');
      case 'propertyDescription':
        return Yup.string().required('Description is required');
      // case 'propertyStatus':
      //   return Yup.string().oneOf(['Available', 'Booked', 'Unavailable']).required('Property status is required');
      case 'propertyType':
        return Yup.number().oneOf(Object.values(PropertyTypeEnum).filter(value => typeof value === 'number'), 'Invalid property type');
      case 'guests':
        return Yup.number().required('Guests is required').positive('Guests must be positive');
      case 'bedrooms':
        return Yup.number().required('Bedrooms is required').positive('Bedrooms must be positive');
      case 'beds':
        return Yup.number().required('Beds is required').positive('Beds must be positive');
      case 'bathrooms':
        return Yup.number().required('Bathrooms is required').positive('Bathrooms must be positive');
      case 'locationId':
        return Yup.string().required('Location is required');
      default:
        return Yup.string().required('This field is required');
    }
  };

  const handleCancel = () => {
    setFieldToUpdate(null);
    setModalTitle(null);
    setIsModalVisible(false);
    setInitialValue(null);

  };

  const handleEdit = (field: string, value: string | null) => {
    setFieldToUpdate(field as keyof Room);
    setModalTitle(`Edit ${field}`);
    setIsModalVisible(true);
    setInitialValue(value);
  };

  const handleUpdate = async (values: any) => {
    console.log(values);
    if (fieldToUpdate) {
      let data;
      if (fieldToUpdate === 'propertyType' || fieldToUpdate === 'propertyStatus') {
        data = {
          [fieldToUpdate]: Number(values[fieldToUpdate])
        };
      }
      else {
        data = { [fieldToUpdate]: values[fieldToUpdate] };
      }
      updateRoomInfor(
        { slug: slug || '', updateData: data },
        {
          onSuccess: () => {
            message.success(`${fieldToUpdate.toUpperCase()} updated successfully!`);
            setIsModalVisible(false);
          },
          onError: () => {
            message.error("Failed to update. Please try again.");
          },
        }
      );
    }
  };

  const renderFieldForm = () => {
    return (
      <Formik
        initialValues={{
          [fieldToUpdate as keyof Room]: roomData?.[fieldToUpdate as keyof Room] || "",
        }}
        validationSchema={Yup.object({
          [fieldToUpdate as string]: getFieldValidation(),
        })}
        onSubmit={handleUpdate}
        key={fieldToUpdate}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-6">
            {/* Property Description */}
            {fieldToUpdate === 'propertyDescription' ? (
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Property Description</label>
                <Field name={fieldToUpdate} className="w-full border border-gray-300 rounded-lg p-2">
                  {({ field, form }: any) => (
                    <CKEditor
                      editor={ClassicEditor}
                      data={roomData?.propertyDescription || ""}
                      onChange={(event: any, editor: any) => {
                        form.setFieldValue(field.name, editor.getData());
                      }}
                      config={{
                        toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
                      }}
                    />
                  )}
                </Field>
              </div>
            ) : fieldToUpdate === 'locationId' ? (
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <Field as="select" name={fieldToUpdate} className="mt-1 border border-gray-300 rounded-lg p-2" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFieldValue(fieldToUpdate, e.target.value)}>
                  <option value="">Select a location</option>
                  {locations?.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.city}, {location.country}
                    </option>
                  ))}
                </Field>
              </div>
            ) : fieldToUpdate === 'guests' ? (
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Guests</label>
                <Field
                  name={fieldToUpdate}
                  type="number"
                  min="1"
                  className="mt-1 border border-gray-300 rounded-lg p-2"
                />
              </div>
            ) : fieldToUpdate === 'propertyType' ? (
              <div className="flex flex-col">
                <label htmlFor="propertyType" className="text-sm font-medium text-gray-700">Property Type</label>
                <Field as="select" name={fieldToUpdate} className="w-full border border-gray-300 rounded-lg p-2" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFieldValue(fieldToUpdate, e.target.value)}>
                  <option value="">Select a Property Type</option>
                  {Object.entries(PropertyTypeEnum).map(([key, value]) => {
                    // Ensure you're rendering only the numeric values from the enum (excluding string keys)
                    if (typeof value === 'number') {
                      return (
                        <option key={value} value={value}>
                          {key}
                        </option>
                      );
                    }
                    return null;
                  })}
                </Field>
              </div>
            ) : (
              <div className="flex flex-col">
                <Field
                  name={fieldToUpdate}
                  type={fieldToUpdate === 'propertyPricePerNight' ? 'number' : 'text'}
                  id={fieldToUpdate}
                  className="w-full border border-gray-300 rounded-lg p-2" />
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  };






  const content = (
    <div className="space-y-6 container">
      {/* Room Information Title */}
      <h1 className='text-2xl font-semibold text-center'>Room Information</h1>

      {/* Property Name */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4">
        <div className="w-full md:w-3/5">
          <h2 className="text-sm text-gray-500">Room name</h2>
          <p className="text-lg font-medium">{roomData?.propertyName}</p>
        </div>
        <div className="mt-2 md:mt-0">
          <button
            onClick={() => handleEdit("propertyName", roomData?.propertyName || "")}
            className="text-pinkCustom hover:underline">
            {roomData?.propertyName ? "Edit" : "Add"}
          </button>
        </div>
      </div>

      {/* Price per Night */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4">
        <div className="w-full md:w-3/5">
          <h2 className="text-sm text-gray-500">Price per night</h2>
          <p className="text-lg font-medium">${roomData?.propertyPricePerNight}</p>
        </div>
        <div className="mt-2 md:mt-0">
          <button
            onClick={() => handleEdit("propertyPricePerNight", roomData?.propertyPricePerNight?.toString() || "")}
            className="text-pinkCustom hover:underline">
            {roomData?.propertyPricePerNight ? "Edit" : "Add"}
          </button>
        </div>
      </div>

      {/* Guests, Bedrooms, Beds, Bathrooms */}

      {/* Description */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4">
        <div className="w-full md:w-3/5">
          <h2 className="text-sm text-gray-500">Description</h2>
          {/* Render nội dung description dưới dạng HTML */}
          <p className="text-lg font-medium" dangerouslySetInnerHTML={{ __html: roomData?.propertyDescription || "" }} />
        </div>
        <div className="mt-2 md:mt-0">
          <button
            onClick={() => handleEdit("propertyDescription", roomData?.propertyDescription || "")}
            className="text-pinkCustom hover:underline">
            {roomData?.propertyDescription ? "Edit" : "Add"}
          </button>
        </div>
      </div>


      {/* Address */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4">
        <div className="w-full md:w-3/5">
          <h2 className="text-sm text-gray-500">Address</h2>
          <p className="text-lg font-medium">{roomData?.address}</p>
        </div>
        <div className="mt-2 md:mt-0">
          <button
            onClick={() => handleEdit("address", roomData?.address || "")}
            className="text-pinkCustom hover:underline">
            {roomData?.address ? "Edit" : "Add"}
          </button>
        </div>
      </div>

      {/* Property Type (Dropdown for select) */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4">
        <div className="w-full md:w-3/5">
          <h2 className="text-sm text-gray-500">Property Type</h2>
          <p className="text-lg font-medium">
            {PropertyTypeEnum[roomData?.propertyType as unknown as keyof typeof PropertyTypeEnum]}
          </p>
        </div>
        <div className="mt-2 md:mt-0">
          <button
            onClick={() => handleEdit("propertyType", roomData?.propertyType?.toString() || "")}
            className="text-pinkCustom hover:underline">
            {roomData?.propertyType ? "Edit" : "Add"}
          </button>
        </div>
      </div>

      {/* Location (Dropdown for selecting location) */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4">
        <div className="w-full md:w-3/5">
          <h2 className="text-sm text-gray-500">Location</h2>
          <p className="text-lg font-medium">{roomData?.locationId ? locations?.find(loc => loc.id === roomData?.locationId)?.city : 'No location selected'}</p>
        </div>
        <div className="mt-2 md:mt-0">
          <button
            onClick={() => handleEdit("locationId", roomData?.locationId || "")}
            className="text-pinkCustom hover:underline">
            {roomData?.locationId ? "Edit" : "Add"}
          </button>
        </div>
      </div>

      {/* Guests, Bedrooms, Beds, Bathrooms */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div className="text-pink-600 text-3xl mb-2">
            <i className="fas fa-users"></i> {/* Use an icon for guests */}
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Guests</h3>
          <p className="text-xl text-gray-600">{roomData?.guests}</p>
          <button
            onClick={() => handleEdit("guests", roomData?.guests?.toString() || "")}
            className="bg-pink-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-pink-700 transition-colors"
          >
            Edit
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div className="text-pink-600 text-3xl mb-2">
            <i className="fas fa-bed"></i> {/* Icon for bedrooms */}
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Bedrooms</h3>
          <p className="text-xl text-gray-600">{roomData?.bedrooms}</p>
          <button
            onClick={() => handleEdit("bedrooms", roomData?.bedrooms?.toString() || "")}
            className="bg-pink-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-pink-700 transition-colors"
          >
            Edit
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div className="text-pink-600 text-3xl mb-2">
            <i className="fas fa-couch"></i> {/* Icon for beds */}
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Beds</h3>
          <p className="text-xl text-gray-600">{roomData?.beds}</p>
          <button
            onClick={() => handleEdit("beds", roomData?.beds?.toString() || "")}
            className="bg-pink-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-pink-700 transition-colors"
          >
            Edit
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div className="text-pink-600 text-3xl mb-2">
            <i className="fas fa-bath"></i> {/* Icon for bathrooms */}
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Bathrooms</h3>
          <p className="text-xl text-gray-600">{roomData?.bathrooms}</p>
          <button
            onClick={() => handleEdit("bathrooms", roomData?.bathrooms?.toString() || "")}
            className="bg-pink-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-pink-700 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );

  const handleAmenitiesSubmit = async (values: { amenities: string[] | [] }) => {
    // Lấy ra mảng id của các tiện ích được chọn, loại bỏ các id undefined
    const selectedAmenitiesIds = values.amenities.filter((id): id is string => id !== undefined);

    console.log(selectedAmenitiesIds);

    if (!roomData?.id || selectedAmenitiesIds.length === 0) {
      message.error('Invalid room or amenities data');
      return;
    }


    // Gọi API cập nhật tiện ích cho phòng
    try {
      const response = await updateRoomAmenities.mutateAsync({
        slug: slug || '',
        amenityIds: selectedAmenitiesIds,
      });

      if (response.status && response.statusCode === 200) {
        message.success('Amenities updated successfully');
        hideModal();
      }
    } catch (error) {
      message.error('Failed to update amenities');
    }
  };

  const handlePublishRoom = async () => {
    try {
      const response = await publishRoom.mutateAsync(slug || "");
      if (response.status && response.statusCode === 200) {
        message.success("Room published successfully!");
      }
    } catch (error) {
      message.error("Failed to publish room");
    }
  };



  return (
    <>
      <div className='room-image'>
        <div className='flex justify-items-center flex-col items-center'>
          <h1 className='text-2xl font-semibold text-center mb-5'>Room Images</h1>
          <ImgCrop rotationSlider>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onRemove={onRemove}
              onPreview={handlePreview} // Gọi hàm preview khi click vào ảnh
              showUploadList={{
                showRemoveIcon: true,
                showPreviewIcon: true,
              }}
              multiple={false} // Giới hạn chỉ một ảnh được chọn mỗi lần
              customRequest={customRequest}
            >
              {fileList.length < 10 && '+ Upload'}
            </Upload>
          </ImgCrop>

          {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(''),
              }}
              src={previewImage}
            />
          )}
        </div>
      </div>

      <div className='room-information space-y-6 mt-10'>
        {content}
        <Modal
          title={modalTitle}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          centered

        >
          {renderFieldForm()}
        </Modal>
      </div>

      <div className="room-amenities space-y-6 mt-10">
        <div className="flex justify-center items-center gap-5">
          <h1 className="text-2xl font-semibold">Room Amenities</h1>
          <button onClick={showModal} className="text-pink-500 hover:text-pink-700 transition duration-200">
            <i className="fa fa-edit text-xl"></i> {/* Icon edit */}
          </button>
        </div>

        <div className="amenities-list flex justify-center">
          <div className="flex flex-wrap gap-6 mt-4">
            {roomAmenities && roomAmenities.length > 0 ? (
              roomAmenities.map((amenity) => (
                <div
                  key={amenity.id}
                  className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg shadow-md hover:bg-pink-100 transition duration-300 ease-in-out"
                >
                  <i className={`fa ${amenity.icon} text-xl text-pink-500`} />
                  <span className="text-md font-medium text-gray-700">{amenity.name}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No amenities selected yet</p>
            )}
          </div>
        </div>

        <Modal
          title="Select Amenities"
          open={isModalOpen}
          onCancel={hideModal}
          footer={null}
          width={600}
        >
          <Formik
            initialValues={{
              amenities: (roomAmenities || []).map((amenity) => amenity.id).filter((id): id is string => id !== undefined),
            }}
            onSubmit={handleAmenitiesSubmit}
          >
            {({ values, handleBlur, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Render amenities list with checkboxes */}
                <div className="space-y-4">
                  {amenities?.map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-4">
                      <Field
                        type="checkbox"
                        name="amenities"
                        value={amenity.id}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const { checked } = e.target;
                          const selectedAmenitiesIds = values.amenities;

                          if (checked) {
                            // Thêm tiện ích vào mảng selected amenities nếu được chọn
                            setFieldValue("amenities", [...selectedAmenitiesIds, amenity.id]);
                          } else {
                            // Loại bỏ tiện ích khỏi mảng nếu không được chọn
                            setFieldValue("amenities", selectedAmenitiesIds.filter((id: string | undefined) => id !== amenity.id));
                          }
                        }}
                        onBlur={handleBlur}
                        checked={values.amenities.includes(amenity.id as string)}
                        className="h-4 w-4 text-pink-500 focus:ring-pink-500"
                      />
                      <i className={`fa ${amenity.icon} text-xl text-pink-500`} />
                      <span className="text-md font-medium text-gray-700">{amenity.name}</span>
                    </div>
                  ))}
                </div>

                {/* Error message */}
                <ErrorMessage name="amenities" component="div" className="text-red-500 mt-2" />

                {/* Submit button */}
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Save Amenities
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>

      </div>

      {
        // if isPublised === false
        roomData?.isPublished === false && (
          <div className="flex justify-end mt-4">
            <button
              onClick={handlePublishRoom}
              className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 focus:outline-none"
            >
              Publish Room
            </button>
          </div>
        )

      }

      <div className='h-10'></div>
    </>

  );
};

export default EditRoom;
