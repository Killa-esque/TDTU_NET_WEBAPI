const mockData = {
  upcoming: [
    {
      id: 1,
      guestName: 'Nguyễn Văn A',
      checkIn: '2024-11-01',
      checkOut: '2024-11-05',
      roomName: 'Phòng 101',
      status: 'upcoming',
    },
    {
      id: 2,
      guestName: 'Trần Thị B',
      checkIn: '2024-11-10',
      checkOut: '2024-11-15',
      roomName: 'Phòng 202',
      status: 'upcoming',
    },
  ],
  current: [
    {
      id: 3,
      guestName: 'Phạm Văn C',
      checkIn: '2024-10-25',
      checkOut: '2024-10-30',
      roomName: 'Phòng 303',
      status: 'current',
    },
  ],
  checkout: [
    {
      id: 4,
      guestName: 'Lê Thị D',
      checkIn: '2024-10-01',
      checkOut: '2024-10-05',
      roomName: 'Phòng 404',
      status: 'checkout',
    },
  ],
  pendingReviews: [
    {
      id: 5,
      guestName: 'Đặng Văn E',
      checkIn: '2024-09-20',
      checkOut: '2024-09-25',
      roomName: 'Phòng 505',
      status: 'pendingReviews',
    },
  ],
};

const mockListings = [
  {
    id: 1,
    name: "Cozy Studio in Central City",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: 50,
    imageUrl: "https://airbnbnew.cybersoft.edu.vn/images/phong1.jpg",
    status: "active",
  },
  {
    id: 2,
    name: "Luxury Apartment with Sea View",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    pricePerNight: 120,
    imageUrl: "https://airbnbnew.cybersoft.edu.vn/images/phong2.png",
    status: "booked",
  },
  {
    id: 3,
    name: "Charming Cottage near Nature",
    guests: 3,
    bedrooms: 2,
    bathrooms: 1,
    pricePerNight: 85,
    imageUrl: "https://airbnbnew.cybersoft.edu.vn/images/phong3.png",
    status: "active",
  },
  // Thêm nhiều mục mẫu hơn nếu cần
];

const revenueData = {
  currentMonthIncome: 0,
  totalIncome: 0,
  adjustments: 0,
  serviceFees: 0,
  taxes: 0,
  upcomingBookings: [],
  completedBookings: [],
};

const chartData = [
  { month: 'Thg 4', income: 10 },
  { month: 'Thg 5', income: 5 },
  { month: 'Thg 6', income: 15 },
  { month: 'Thg 7', income: 7 },
  { month: 'Thg 8', income: 12 },
  { month: 'Thg 9', income: 8 },
  { month: 'Thg 10', income: 0 }, // Tháng hiện tại
];



export { mockData, mockListings, revenueData, chartData };
