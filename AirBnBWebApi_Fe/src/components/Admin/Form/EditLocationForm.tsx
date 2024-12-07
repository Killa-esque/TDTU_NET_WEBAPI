import React, { memo, useState } from 'react';
import { DatePicker, Drawer, Image, Modal, Space, Upload, message } from 'antd';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Location as LocationType, LocationUpdatePayload } from '@/types';
import { useLocation, useUser } from '@/hooks';
import { UploadOutlined } from '@ant-design/icons';
import { CONFIG } from '@/config/appConfig';

type EditLocationFormProps = {
  visible: boolean;
  onClose: () => void;
  locationId: string | null;
};

const EditLocationForm: React.FC<EditLocationFormProps> = memo(({ visible, onClose, locationId }) => {
  if (visible && !locationId) {
    return;
  }
  const { getLocationById, updateLocation } = useLocation();
  const { data: location, isLoading, isError } = getLocationById(locationId || "");
  const { mutate: updateLocationInfo } = updateLocation();


  if (isLoading) return <p>Loading...</p>;
  if (isError || !location) return <p>Error loading location data</p>;


  // Gửi dữ liệu cập nhật
  const handleSubmit = (values: LocationUpdatePayload) => {
    console.log(values)
    updateLocationInfo(
      values,
      {
        onSuccess: () => {
          message.success(`Updated location successfully!`);
          onClose();
        },
        onError: () => {
          message.error("Failed to update. Please try again.");
        },
      }
    );
  };



  return (
    <>
      <Drawer
        title={`Edit Location`}
        open={visible}
        onClose={onClose}
        footer={null}
      >
        <Formik
          initialValues={{ city: location.city, country: location.country, id: location.id }}
          validationSchema={Yup.object({
            id: Yup.string().required("This field is required"),
            city: Yup.string().required("This field is required"),
            country: Yup.string().required("This field is required"),
          })}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="city">City</label>
                <Field
                  name="city"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Enter City"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue("city", e.target.value);
                    // Bạn có thể thêm logic xử lý gì đó ở đây, ví dụ như gọi API
                  }}
                  value={values.city}
                />
                <ErrorMessage name="city" component="div" className="text-red-500" />
              </div>

              <div>
                <label htmlFor="country">Country</label>
                <Field
                  name="country"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Enter Country"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue("country", e.target.value);
                    // Thêm logic xử lý ở đây nếu cần
                  }}
                  value={values.country}
                />
                <ErrorMessage name="country" component="div" className="text-red-500" />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>

      </Drawer>
    </>
  );
});

export default EditLocationForm;
