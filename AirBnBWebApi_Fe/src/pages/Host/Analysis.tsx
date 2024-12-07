import { Table, Tag } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useRoom } from '@/hooks';
import { Review, ReviewAnalytics } from '@/types';
import { ColumnType } from 'antd/es/table';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Analysis = () => {

  const { getAllReviewsByHostId, getAnalyticsReviews } = useRoom();

  const { data: reviews, isLoading: isLoadingReviews, isError: isErrorReviews } = getAllReviewsByHostId();
  const { data: analytics, isLoading: isLoadingAnalytics, isError: isErrorAnalytics } = getAnalyticsReviews();

  console.log(reviews, analytics);

  const columns: ColumnType<Review>[] = [
    {
      title: 'User',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: 'Review',
      dataIndex: 'comment',
      key: 'comment',
      render: (text: string) => <span className="text-gray-600" dangerouslySetInnerHTML={{ __html: text }} />,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <div>
          {Array.from({ length: 5 }, (_, index) => (
            <Tag key={index} color={index < rating ? 'gold' : 'gray'}>
              ★
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const chartDataConfig = {
    labels: analytics?.map((data: ReviewAnalytics) => data.date), // Dùng ngày từ dữ liệu phân tích
    datasets: [
      {
        label: 'Average Rating',
        data: analytics?.map((data: ReviewAnalytics) => data.averageRating),
        borderColor: '#000',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        fill: true,
      },
      {
        label: 'Reviews Count',
        data: analytics?.map((data: ReviewAnalytics) => data.reviewsCount),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6 md:p-10 lg:p-12">
      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Analysis</h1>
        <p className="text-xl md:text-2xl font-bold text-gray-800">Analytics and User Reviews</p>
      </section>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold">User Reviews</h2>
        <Table<Review>
          dataSource={reviews}
          columns={columns}
          pagination={false}
          rowKey="reviewId"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Review Analytics</h2>
        <Line data={chartDataConfig} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default Analysis;
