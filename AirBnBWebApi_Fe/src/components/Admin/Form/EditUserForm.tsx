import React, { memo, useState } from 'react';
import { DatePicker, Drawer, Image, Modal, Space, Upload, message } from 'antd';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { User as UserType } from '@/types';
import { useUser } from '@/hooks';
import dayjs from 'dayjs';
import { UploadOutlined } from '@ant-design/icons';
import { CONFIG } from '@/config/appConfig';

type EditUserFormProps = {
  visible: boolean;
  onClose: () => void;
  userId: string | null;
};

const EditUserForm: React.FC<EditUserFormProps> = memo(({ visible, onClose, userId }) => {
  if (visible && !userId) {
    return;
  }
  const { getUserById, updateUser } = useUser();
  const { data: userProfile, isLoading, isError } = getUserById(userId || "");
  const { mutate: updateUserProfile } = updateUser();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [initialValue, setInitialValue] = useState<string | null>("");

  if (isLoading) return <p>Loading...</p>;
  if (isError || !userProfile) return <p>Error loading user data</p>;


  // Hàm mở modal
  const handleEdit = (field: string, value: string | null) => {
    setCurrentField(field);
    setInitialValue(value || "");
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentField(null);
    setInitialValue(null);
  };

  // Gửi dữ liệu cập nhật
  const handleSubmit = (values: { value: string }) => {
    console.log(values)
    if (currentField) {
      const data = {
        [currentField]: currentField === "gender" ? values.value === "true" : values.value,
      };
      updateUserProfile(
        { userId: userProfile.id, data },
        {
          onSuccess: () => {
            message.success(`${currentField.toUpperCase()} updated successfully!`);
            setIsModalVisible(false);
          },
          onError: () => {
            message.error("Failed to update. Please try again.");
          },
        }
      );
    }
  };

  const content = (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex justify-center items-center">
        <div>
          <Image
            src={`${CONFIG.SERVER_URL}${userProfile.avatar}` || "/default-avatar.png"}
            alt="Avatar"
            className="w-16 h-16 rounded-full border"
            preview={true}
            height={200}
            width={200}
          />
        </div>
      </div>
      <hr />

      {/* Email Address */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-gray-500">Email Address</h2>
          <p className="text-lg font-medium">{userProfile.email || ""}</p>
        </div>
        <span className="text-gray-500">Email cannot be changed</span>
      </div>
      <hr />

      {/* Legal Name */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-gray-500">Legal Name</h2>
          <p className="text-lg font-medium">{userProfile.fullName || ""}</p>
        </div>
        <button onClick={() => handleEdit("fullName", userProfile.fullName)} className="text-pinkCustom hover:underline">
          {userProfile.fullName ? "Edit" : "Add"}
        </button>
      </div>
      <hr />

      {/* Phone Number */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-gray-500">Phone Number</h2>
          <p className="text-lg font-medium">{userProfile.phoneNumber || "Not provided"}</p>
        </div>
        <button onClick={() => handleEdit("phoneNumber", userProfile.phoneNumber)} className="text-pinkCustom hover:underline">
          {userProfile.phoneNumber ? "Edit" : "Add"}
        </button>
      </div>
      <hr />

      {/* Address */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-gray-500">Address</h2>
          <p className="text-lg font-medium">{userProfile.address || "Not provided"}</p>
        </div>
        <button onClick={() => handleEdit("address", userProfile.address)} className="text-pinkCustom hover:underline">
          {userProfile.address ? "Edit" : "Add"}
        </button>
      </div>
      <hr />

      {/* City */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-gray-500">City</h2>
          <p className="text-lg font-medium">{userProfile.city || "Not provided"}</p>
        </div>
        <button onClick={() => handleEdit("city", userProfile.city)} className="text-pinkCustom hover:underline">
          {userProfile.city ? "Edit" : "Add"}
        </button>
      </div>
      <hr />

      {/* Nationality */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-gray-500">Nationality</h2>
          <p className="text-lg font-medium">{userProfile.country || "Not provided"}</p>
        </div>
        <button onClick={() => handleEdit("country", userProfile.country)} className="text-pinkCustom hover:underline">
          {userProfile.country ? "Edit" : "Add"}
        </button>
      </div>
      <hr />

      {/* Date of Birth */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-gray-500">Date of Birth</h2>
          <p className="text-lg font-medium">
            {userProfile.dateOfBirth ? dayjs(userProfile.dateOfBirth).format("MM-DD-YYYY") : "Not provided"}
          </p>
        </div>
        <button onClick={() => handleEdit("dateOfBirth", userProfile.dateOfBirth)} className="text-pinkCustom hover:underline">
          {userProfile.dateOfBirth ? "Edit" : "Add"}
        </button>
      </div>
      <hr />

      {/* Gender */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-gray-500">Gender</h2>
          <p className="text-lg font-medium">{userProfile.gender ? "Male" : "Female"}</p>
        </div>
        <button onClick={() => handleEdit("gender", userProfile.gender ? "Male" : "Female")} className="text-pinkCustom hover:underline">
          Edit
        </button>
      </div>
    </div >
  );

  return (
    <>
      <Drawer
        title={`Edit User - ${userProfile?.fullName}`}
        open={visible}
        onClose={onClose}
        footer={null}
        size='large'
      >
        {content}

      </Drawer>
      <Modal
        title={`Update ${currentField}`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Formik
          initialValues={{
            value: currentField === "gender" ? (initialValue === "Male" ? "true" : "false")
              : currentField === "dateOfBirth" ? (initialValue ? dayjs(initialValue).format("MM-DD-YYYY") : "")
                : initialValue || ""
          }}
          validationSchema={Yup.object({
            value: currentField === "gender" ? Yup.string().required("Please select a gender")
              : currentField === "dateOfBirth" ? Yup.string().required("Please select a date")
                : Yup.string().required("This field is required"),
          })}
          onSubmit={(values) => handleSubmit(values)}
          key={currentField}
        >
          <Form className="space-y-4">
            {currentField === "gender" ? (
              <Field
                name="value"
                as="select"
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="" label="Select gender" />
                <option value="true" label="Male" />
                <option value="false" label="Female" />
              </Field>
            ) : currentField === "dateOfBirth" ? (
              <Field name="value">
                {({ field, form }: any) => (
                  <DatePicker
                    format="MM-DD-YYYY"
                    onChange={(date, dateString) => form.setFieldValue(field.name, dateString)}
                    className="w-full"
                  />
                )}
              </Field>
            ) : (
              <Field
                name="value"
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder={`Enter ${currentField}`}
              />
            )}
            <ErrorMessage name="value" component="div" className="text-red-500" />
            <div className="flex justify-end">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </Form>
        </Formik>
      </Modal>
    </>
  );
});

export default EditUserForm;
