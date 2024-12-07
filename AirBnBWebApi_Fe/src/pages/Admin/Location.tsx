import { useState } from "react";
import { Button, Image, Input, message, Modal, Space, Upload } from "antd";
import { useLocation } from "@/hooks";
import { Location as LocationType } from "@/types";
import Table, { ColumnsType } from "antd/es/table";
import { CONFIG } from "@/config/appConfig";
import { UploadOutlined } from "@ant-design/icons";
import EditLocationForm from "@/components/Admin/Form/EditLocationForm";
import CreateLocationForm from "@/components/Admin/Form/CreateLocationForm";
import { formatString } from "@/utils";

type Props = {}

const Location = (props: Props) => {
  const { getLocations, uploadLocationImage, deleteLocation } = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditDrawerVisible, setIsEditDrawerVisible] = useState(false);
  const [isCreateDrawerVisible, setIsCreateDrawerVisible] = useState(false);
  const [editingLocation, setEditingLocation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");



  const { data: locations, isLoading } = getLocations();
  const { mutate: uploadLocation } = uploadLocationImage();
  const { mutate: deleteLocationById } = deleteLocation();



  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pageSize = 15;

  const paginationConfig = {
    current: currentPage,
    pageSize,
    total: locations?.length,
    onChange: handlePageChange,
  };

  // Hàm lọc dữ liệu theo searchTerm
  const filteredData = locations?.filter((location) => {
    const city = formatString(location.city).includes(formatString(searchTerm));
    const country = formatString(location.country).includes(formatString(searchTerm));
    return city || country; // Lọc theo city hoặc country
  }).slice((currentPage - 1) * pageSize, currentPage * pageSize); // Phân trang


  const columns: ColumnsType<LocationType> = [
    {
      title: 'Id',
      key: 'id',
      render: (_: any, __: any, index: number) => (currentPage - 1) * pageSize + index + 1, // Calculate row index based on page
      sorter: (a, b) => (a.id ?? "").localeCompare(b.id ?? ""),
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      sorter: (a, b) => a.city.localeCompare(b.city),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      sorter: (a, b) => a.country.localeCompare(b.country),
    },
    // Image
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string, record: LocationType) => {
        console.log(imageUrl);
        return (
          <Space size="middle">
            <Image
              src={`${CONFIG.SERVER_URL}${imageUrl}` || "/default-avatar.png"}
              alt="Avatar"
              className="w-16 h-16 rounded-full border"
              preview={true}
              height={100}
              width={100}
            />
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                if (record.id) {
                  handleAvatarUpload(record.id, file);
                }
                return false;
              }}
            >
              <button
                className="text-pinkCustom hover:underline flex items-center gap-2"
                disabled={isUploading}
              >
                <UploadOutlined /> {isUploading ? "Uploading..." : "Change Image"}
              </button>
            </Upload>

          </Space>
        )
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: LocationType) => (
        <Space size="middle">
          <button
            type="submit"
            className="w-full py-3 bg-pinkCustom text-white font-semibold rounded-lg hover:bg-pink-700 transition p-3"
            onClick={() => record.id && handleEditLocation(record.id)}
          >
            <i className='fa-regular fa-edit'></i>
          </button>
          <button
            type="submit"
            className="w-full py-3 bg-yellow-800 text-white font-semibold rounded-lg hover:bg-yellow-900 transition p-3"
            onClick={() => record.id && handleDeleteLocation(record.id, record.city, record.country)}
          >
            <i className='fa-regular fa-trash'></i>
          </button>
        </Space>
      ),
    },
  ];

  const handleAvatarUpload = (locationId: string, file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    uploadLocation({
      image: formData,
      locationId
    }
      ,
      {
        onSuccess: () => {
          message.success("Avatar uploaded successfully!");
          setIsUploading(false);
        },
        onError: () => {
          message.error("Failed to upload avatar. Please try again.");
          setIsUploading(false);
        },
      }
    );
  };

  // Handle edit user
  const handleEditLocation = (locationId: string) => {
    setEditingLocation(locationId);
    setIsEditDrawerVisible(true);
  };

  // Handle delete user
  const handleDeleteLocation = (locationId: string, city: string, country: string) => {
    Modal.confirm({
      title: 'Bạn có chắc là muốn xóa user này không?',
      onOk: () => {
        deleteLocationById(locationId,
          {
            onSuccess: () => {
              message.success(`Delete ${city}, ${country} successfully!`);
            },
            onError: () => {
              message.error("Không thể xóa vị trí này. Vì vị trí này đang được sử dụng.");
            },
          })
      },
    });
  };

  return (
    <>
      <button
        className="py-3 bg-pinkCustom text-white font-semibold rounded-lg hover:bg-pink-700 transition p-3 my-3"
        onClick={() => {
          setIsCreateDrawerVisible(true);
        }}
      >
        <i className='fa-regular fa-plus'></i>
        <span className='ml-2'>Tạo vị trí</span>
      </button>

      <Input.Search
        placeholder="Search by City or Country"
        onSearch={(value) => setSearchTerm(value)}
        enterButton
        style={{ marginBottom: 20 }}
      />
      <Table<LocationType>
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={isLoading}
        pagination={paginationConfig}
      />

      {isEditDrawerVisible && (
        <EditLocationForm
          visible={isEditDrawerVisible}
          onClose={() => setIsEditDrawerVisible(false)}
          locationId={editingLocation}
        />
      )}

      {isCreateDrawerVisible && (
        <CreateLocationForm
          visible={isCreateDrawerVisible}
          onClose={() => setIsCreateDrawerVisible(false)}
        />
      )}
    </>
  );
}

export default Location
