export type Feedback = {
  id: string;
  avatar: string;
  tenNguoiBinhLuan: string;
  ngayBinhLuan: string;
  noiDung: string;
  saoBinhLuan: number;
}


export interface FeedbackRoomProps {
  feedBack: {
    id: string;
  };
}
