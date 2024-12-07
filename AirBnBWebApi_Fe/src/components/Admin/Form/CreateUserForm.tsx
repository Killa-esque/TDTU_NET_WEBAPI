import { useUser } from '@/hooks';
import { Role, UserCreatePayload } from '@/types';
import { Button, Checkbox, Drawer, message } from 'antd';
import dayjs from 'dayjs';
import { ErrorMessage, Field, Formik, Form } from 'formik';
import { memo, useEffect, useState } from 'react'
import * as Yup from 'yup';

type CreateUserFormProps = {
  visible: boolean;
  onClose: () => void;
};


const validationSchema = Yup.object({
  id: Yup.string().notRequired(),
  fullName: Yup.string()
    .required('Full Name is required')
    .min(3, 'Full Name must be at least 3 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  phoneNumber: Yup.string().required('Phone Number is required'),
  dateOfBirth: Yup.date()
    .required('Date of Birth is required')
    .max(new Date(), 'Date of Birth cannot be in the future'),
  city: Yup.string().required('City is required'),
  country: Yup.string().required('Country is required'),
  address: Yup.string().required('Address is required'),
  roles: Yup.array()
    .of(Yup.string().required('Role is required'))
    .min(1, 'At least one role is required'),
});


const CreateUserForm = memo(({ visible, onClose }: CreateUserFormProps) => {

  const { createUser, getRoles } = useUser();

  const { mutate: createUserMutation } = createUser();
  const { data: rolesData } = getRoles();

  const [roles, setRoles] = useState<Role[]>([]);


  const initialValues: UserCreatePayload = {
    email: '',
    fullName: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
    city: '',
    country: '',
    address: '',
    gender: true,
    roles: [],
  };

  useEffect(() => {
    if (rolesData) {
      setRoles(rolesData); // Set roles fetched from API
    }
  }, [rolesData]);


  const handleSubmit = (values: UserCreatePayload) => {

    // Convert dateOfBirth to mm/dd/yyyy format using dayjs
    values.dateOfBirth = dayjs(values.dateOfBirth).format('MM/DD/YYYY');


    createUserMutation(values, {
      onSuccess: () => {
        onClose();
        message.success('User created successfully');
      },
      onError: () => {
        // Handle error
        message.error('Failed to create user. Please try again');
      },
    });
  }

  return (
    <Drawer
      title="Create User"
      open={visible}
      onClose={onClose}
      footer={null}
      size="large"

    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >

        {({ isSubmitting, setFieldValue, values }) => {
          const handleRoleChange = (roleId: string, checked: boolean) => {
            const role = roles.find((role) => role.id === roleId);

            if (role?.name === 'Admin' && checked) {
              // If Admin is checked, only allow Admin to be selected and disable others
              setFieldValue('roles', [roleId]);
            } else {
              // If Admin is not selected, allow user to select other roles
              if (checked) {
                setFieldValue('roles', [...values.roles, roleId]);
              } else {
                setFieldValue('roles', values.roles.filter((id) => id !== roleId));
              }
            }
          };
          return (
            <Form className="space-y-6">
              {/* Full Name */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Field
                  name="fullName"
                  className="border rounded-lg p-2"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue("fullName", e.target.value)}
                  value={values.fullName} />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="border rounded-lg p-2"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue("email", e.target.value)}
                  value={values.email}  // Gắn giá trị cho trường này từ Formik state
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="border rounded-lg p-2"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue("password", e.target.value)}
                  value={values.password}  // Gắn giá trị cho trường này từ Formik state
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <Field
                  name="phoneNumber"
                  className="border rounded-lg p-2"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue("phoneNumber", e.target.value)}
                  value={values.phoneNumber}  // Gắn giá trị cho trường này từ Formik state
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Date of Birth */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                <Field
                  type="date"
                  name="dateOfBirth"
                  className="border rounded-lg p-2"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue("dateOfBirth", e.target.value)}
                  value={values.dateOfBirth}  // Gắn giá trị cho trường này từ Formik state
                />
                <ErrorMessage
                  name="dateOfBirth"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* City */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">City</label>
                <Field
                  name="city"
                  className="border rounded-lg p-2"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue("city", e.target.value)}
                  value={values.city}  // Gắn giá trị cho trường này từ Formik state
                />
                <ErrorMessage
                  name="city"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Country */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Country</label>
                <Field
                  name="country"
                  className="border rounded-lg p-2"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue("country", e.target.value)}
                  value={values.country}  // Gắn giá trị cho trường này từ Formik state
                />
                <ErrorMessage
                  name="country"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Address */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <Field
                  name="address"
                  className="border rounded-lg p-2"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue("address", e.target.value)}
                  value={values.address}  // Gắn giá trị cho trường này từ Formik state
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <Field
                  as="select"
                  name="gender"
                  className="border rounded-lg p-2"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFieldValue("gender", e.target.value)}
                  value={values.gender}  // Gắn giá trị cho trường này từ Formik state
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Field>
                <ErrorMessage
                  name="gender"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Roles */}
              <div className="flex flex-col space-y-4">
                <label htmlFor="roles" className="text-sm font-medium text-gray-700">
                  Roles
                </label>
                <div className="space-y-2">
                  {roles?.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={values.roles.includes(role.id)}
                        onChange={(e) => handleRoleChange(role.id, e.target.checked)}
                        disabled={
                          (role.name === 'User' || role.name === 'Host') &&
                          values.roles.includes(roles.find((role) => role.name === 'Admin')?.id ?? '')
                        }
                      />
                      <span
                        className={`text-sm font-medium ${role.name === 'Admin'
                          ? 'font-bold text-red-500'
                          : 'text-gray-700'
                          }`}
                      >
                        {role.name}
                      </span>
                    </div>
                  ))}
                </div>
                <ErrorMessage name="roles" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-pinkCustom text-white px-4 py-2 rounded-md"
                  loading={isSubmitting}
                >
                  Create
                </Button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </Drawer >
  )
});

export default CreateUserForm
