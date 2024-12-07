import AccountLayout from "@/components/User/Layout/AccountLayout/AccountLayout";
import CustomSidebar from "@/components/User/Layout/AccountLayout/CustomSidebar";
import { useUser } from "@/hooks";
import { DatePicker, Image, Input, message, Modal, Space, Tooltip, Upload } from "antd";
import { useState } from "react";
import { FaEnvelope, FaEye, FaKey, FaLock, FaMapMarkerAlt, FaPhone, FaUserShield } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { UploadOutlined } from "@ant-design/icons";
import { CONFIG } from "@/config/appConfig";
import dayjs from "dayjs";
import { EmailVerificationPayload } from "@/types";

const PersonalInfo = () => {

  const { getMe, updateUser, uploadAvatar, sendEmailConfirmation, confirmEmail } = useUser();
  const { data: userProfile, isLoading, isError } = getMe();
  const { mutate: updateUserProfile } = updateUser();
  const { mutate: uploadUserAvatar } = uploadAvatar();
  const { mutate: sendEmailConfirmationMutation } = sendEmailConfirmation();
  const { mutate: confirmEmailMutation } = confirmEmail();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalConfirmEmailVisible, setIsModalConfirmEmailVisible] = useState(false);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [initialValue, setInitialValue] = useState<string | null>("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);



  console.log(userProfile);
  // Hàm mở modal
  const handleEdit = (field: string, value: string | undefined) => {
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

  const handleSendConfirmationEmail = (email: string) => {
    sendEmailConfirmationMutation(email, {
      onSuccess: () => {
        message.success("Verification email sent!");
        setIsModalConfirmEmailVisible(false);
      },
      onError: () => {
        message.error("Failed to send verification email.");
      },
    });
  };

  const handleConfirmEmail = (payload: EmailVerificationPayload) => {

    console.log(payload);
    confirmEmailMutation(payload, {
      onSuccess: () => {
        message.success("Email verified successfully!");
        setIsModalConfirmEmailVisible(false);
      },
      onError: () => {
        message.error("Failed to verify email.");
      },
    });
    message.success("Email verified successfully!");
    setIsModalConfirmEmailVisible(false);
  };

  // Gửi dữ liệu cập nhật
  const handleSubmit = (values: { value: string }) => {
    console.log(values)
    if (currentField) {
      const data = {
        [currentField]: currentField === "gender" ? values.value === "true" : values.value,
      };
      updateUserProfile(
        { userId: userProfile?.id ?? "", data },
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

  const handleAvatarUpload = (file: File) => {
    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatarFile", file);

    uploadUserAvatar(
      formData,
      {
        onSuccess: () => {
          message.success("Avatar uploaded successfully!");
          setIsUploadingAvatar(false);
        },
        onError: () => {
          message.error("Failed to upload avatar. Please try again.");
          setIsUploadingAvatar(false);
        },
      }
    );
  };


  // Nội dung phần content
  const content = (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex justify-between items-center">
        <div>
          <Image
            src={`${CONFIG.SERVER_URL}${userProfile?.avatar}` || "/default-avatar.png"}
            alt="Avatar"
            className="w-16 h-16 rounded-full border"
            preview={true}
            height={100}
            width={100}
          />
        </div>
        <div>
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              handleAvatarUpload(file);
              return false;
            }}
          >
            <button className="text-pinkCustom hover:underline flex items-center gap-2" disabled={isUploadingAvatar}>
              <UploadOutlined /> {isUploadingAvatar ? "Uploading..." : "Change Avatar"}
            </button>
          </Upload>
        </div>
      </div>
      <hr />

      {/* Email Address */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-gray-500">Email Address</h2>
          <p className="text-lg font-medium">{userProfile?.email || ""}</p>
        </div>
        {/* <span className="text-gray-500">Email cannot be changed</span> */}
        {
          userProfile?.isEmailVerified ? (
            <p className="text-pinkCustom">Your email is verified</p>
          ) : (
            <Space>
              <button onClick={() => handleSendConfirmationEmail(userProfile?.email || "")} className="text-pinkCustom hover:underline">
                Verify your email
              </button>
              {/* <span onClick={() => { setIsModalConfirmEmailVisible(true) }}>
              </span> */}
              <Tooltip placement="topLeft" title={"Open to enter code"} className="hover:underline" >
                <button className="text-pinkCustom hover:underline" onClick={() => { setIsModalConfirmEmailVisible(true) }}>
                  <i className="fa-regular fa-code"></i>
                </button>
              </Tooltip>

            </Space>
          )
        }

      </div>
      <hr />

      {/* Legal Name */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-gray-500">Legal Name</h2>
          <p className="text-lg font-medium">{userProfile?.fullName || ""}</p>
        </div>
        <button onClick={() => handleEdit("fullName", userProfile?.fullName)} className="text-pinkCustom hover:underline">
          {userProfile?.fullName ? "Edit" : "Add"}
        </button>
      </div>
      <hr />

      {/* Phone Number */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-gray-500">Phone Number</h2>
          <p className="text-lg font-medium">{userProfile?.phoneNumber || "Not provided"}</p>
        </div>
        <button onClick={() => handleEdit("phoneNumber", userProfile?.phoneNumber)} className="text-pinkCustom hover:underline">
          {userProfile?.phoneNumber ? "Edit" : "Add"}
        </button>
      </div>
      <hr />

      {/* Address */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-gray-500">Address</h2>
          <p className="text-lg font-medium">{userProfile?.address || "Not provided"}</p>
        </div>
        <button onClick={() => handleEdit("address", userProfile?.address || "")} className="text-pinkCustom hover:underline">
          {userProfile?.address ? "Edit" : "Add"}
        </button>
      </div>
      <hr />

      {/* City */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-gray-500">City</h2>
          <p className="text-lg font-medium">{userProfile?.city || "Not provided"}</p>
        </div>
        <button onClick={() => handleEdit("city", userProfile?.city || "")} className="text-pinkCustom hover:underline">
          {userProfile?.city ? "Edit" : "Add"}
        </button>
      </div>
      <hr />

      {/* Nationality */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-gray-500">Nationality</h2>
          <p className="text-lg font-medium">{userProfile?.country || "Not provided"}</p>
        </div>
        <button onClick={() => handleEdit("country", userProfile?.country || "")} className="text-pinkCustom hover:underline">
          {userProfile?.country ? "Edit" : "Add"}
        </button>
      </div>
      <hr />

      {/* Date of Birth */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-gray-500">Date of Birth</h2>
          <p className="text-lg font-medium">
            {userProfile?.dateOfBirth ? dayjs(userProfile?.dateOfBirth).format("MM-DD-YYYY") : "Not provided"}
          </p>
        </div>
        <button onClick={() => handleEdit("dateOfBirth", userProfile?.dateOfBirth)} className="text-pinkCustom hover:underline">
          {userProfile?.dateOfBirth ? "Edit" : "Add"}
        </button>
      </div>
      <hr />

      {/* Gender */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-gray-500">Gender</h2>
          <p className="text-lg font-medium">{userProfile?.gender ? "Male" : "Female"}</p>
        </div>
        <button onClick={() => handleEdit("gender", userProfile?.gender ? "Male" : "Female")} className="text-pinkCustom hover:underline">
          Edit
        </button>
      </div>
    </div >
  );

  // Nội dung phần sidebar
  const sidebarItems = [
    {
      icon: <FaUserShield className="text-pinkCustom w-6 h-6" />,
      title: "Why can't I see my information?",
      description: "We're hiding some account details to protect your identity.",
    },
    {
      icon: <FaLock className="text-pinkCustom w-6 h-6" />,
      title: "What information can I edit?",
      description: "You can edit your contact and personal details.",
    },
    {
      icon: <FaEye className="text-pinkCustom w-6 h-6" />,
      title: "What information is shared with others?",
      description: "Only contact details and booking information are shared with hosts after a booking is confirmed.",
    },
    {
      icon: <FaEnvelope className="text-pinkCustom w-6 h-6" />,
      title: "How do I change my email address?",
      description: "You can update your email address in the 'Login & Security' section of your account settings.",
    },
    {
      icon: <FaPhone className="text-pinkCustom w-6 h-6" />,
      title: "How do I update my phone number?",
      description: "You can add or update your phone number in the 'Personal Information' section.",
    },
    {
      icon: <FaKey className="text-pinkCustom w-6 h-6" />,
      title: "How can I reset my password?",
      description: "If you've forgotten your password, you can reset it in the 'Login & Security' section.",
    },
    {
      icon: <FaMapMarkerAlt className="text-pinkCustom w-6 h-6" />,
      title: "How do I update my address?",
      description: "You can add or update your address details in the 'Personal Information' section.",
    },
  ];

  if (isLoading) return <p>Loading...</p>;
  if (isError || !userProfile) return <p>Error loading user data</p>;

  return (
    <div className="">
      <AccountLayout
        title="Personal Information"
        content={content}
        sidebar={<CustomSidebar items={sidebarItems} />}
      />
      {/* Modal cập nhật */}
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
              <button type="submit" className="bg-pinkCustom text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </Form>
        </Formik>
      </Modal>

      {/* Email Verification */}
      <Modal
        title="Confirm Email"
        open={isModalConfirmEmailVisible}
        onCancel={() => setIsModalConfirmEmailVisible(false)}
        footer={null}

      >
        <p>Please check your email for the confirmation token.</p>
        <Formik
          initialValues={{ verificationCode: "", email: userProfile?.email || "" }}
          validationSchema={Yup.object({
            verificationCode: Yup.string().required("This field is required"),
          })}
          onSubmit={(values) => handleConfirmEmail(values)}
          key={currentField}
        >
          <Form className="space-y-4">
            <Field
              name="verificationCode"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder={`Enter your confirmation code`}
            />
            <ErrorMessage name="verificationCode" component="div" className="text-red-500" />
            <div className="flex justify-end">
              <button type="submit" className="bg-pinkCustom text-white px-4 py-2 rounded hover:bg-rose-700 transition">
                Verify
              </button>
            </div>
          </Form>
        </Formik>
      </Modal>

    </div >
  );
};

export default PersonalInfo;
