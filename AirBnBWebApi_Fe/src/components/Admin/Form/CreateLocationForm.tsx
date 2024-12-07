import { useLocation } from '@/hooks';
import { LocationCreatePayload } from '@/types';
import { Button, Checkbox, Drawer, message } from 'antd';
import { ErrorMessage, Field, Formik, Form } from 'formik';
import { memo } from 'react'
import * as Yup from 'yup';

type CreateLocationFormProps = {
  visible: boolean;
  onClose: () => void;
};


const validationSchema = Yup.object({
  city: Yup.string().required('City is required'),
  country: Yup.string().required('Country is required'),

});


const CreateLocationForm = memo(({ visible, onClose }: CreateLocationFormProps) => {

  const { createLocation } = useLocation();

  const { mutate: createLocationMutation } = createLocation();


  const initialValues: LocationCreatePayload = {
    city: '',
    country: '',
  };

  const handleSubmit = (values: LocationCreatePayload) => {

    // Convert dateOfBirth to mm/dd/yyyy format using dayjs


    createLocationMutation(values, {
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
      title="Create Location"
      open={visible}
      onClose={onClose}
      footer={null}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >

        {({ isSubmitting, setFieldValue, values }) => {
          return (
            <Form className="space-y-6">
              {/* City */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">City</label>
                <Field
                  name="city"
                  className="border rounded-lg p-2"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue("city", e.target.value)}
                  value={values.city} />
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

export default CreateLocationForm
