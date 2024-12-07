import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Modal, Button, message } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUser } from "@/hooks";
type Props = {}

const Password = (props: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { updatePassword } = useUser();
  const { mutate: updateUserPassword } = updatePassword();

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(6, "Password must be at least 6 characters")
      .notOneOf(
        [Yup.ref("currentPassword")],
        "New password cannot be the same as the current password"
      ),
    confirmNewPassword: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("newPassword")], "Passwords must match"),
  });


  const handleSubmit = (values: { currentPassword: string; newPassword: string, confirmNewPassword: string }) => {
    updateUserPassword(
      { currentPassword: values.currentPassword, newPassword: values.newPassword, confirmNewPassword: values.confirmNewPassword },
      {
        onSuccess: () => {
          message.success("Password updated successfully!");
          setIsModalOpen(false);
        },
        onError: () => {
          message.error("Failed to update password. Please try again.");
        },
      }
    );
  };

  // Nội dung phần content
  const content = (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Login</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Password</p>
            <p className="text-sm text-gray-500">Last updated 6 days ago</p>
          </div>
          {/* Khi click update thì mở modal form lên */}
          <NavLink
            to="#"
            onClick={() => setIsModalOpen(true)}
            className="text-pinkCustom hover:underline"
          >
            Update
          </NavLink>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-5 text-5xl">Change your password</h1>
      <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-lg p-6 mb-6 lg:mb-0 hover:shadow-xl transition-shadow duration-300 ease-in-out">
        {content}
      </div>
      {/* Modal form */}
      <Modal
        title="Update Password"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <Field
                  type="password"
                  name="currentPassword"
                  className="w-full px-4 py-2 text-sm border rounded-lg shadow-sm border-gray-300 focus:ring-2 focus:ring-pinkCustom focus:border-pinkCustom outline-none transition duration-200 ease-in-out"
                />
                <ErrorMessage name="currentPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <Field
                  type="password"
                  name="newPassword"
                  className="w-full px-4 py-2 text-sm border rounded-lg shadow-sm border-gray-300 focus:ring-2 focus:ring-pinkCustom focus:border-pinkCustom outline-none transition duration-200 ease-in-out"
                />
                <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="confirmNewPassword"
                  className="w-full px-4 py-2 text-sm border rounded-lg shadow-sm border-gray-300 focus:ring-2 focus:ring-pinkCustom focus:border-pinkCustom outline-none transition duration-200 ease-in-out"
                />
                <ErrorMessage name="confirmNewPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="flex justify-end space-x-2">
                <Button onClick={() => setIsModalOpen(false)} className="border-gray-300">
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                  Update
                </Button>
              </div>
            </Form>
          )}
        </Formik>

      </Modal>
    </div>


  );
}

export default Password
