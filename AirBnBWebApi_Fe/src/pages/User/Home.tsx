import Room from '@/components/User/Data/Room'
import Carousel from '@/components/User/Layout/Carousel/Carousel'
import { useRoom } from '@/hooks';

type Props = {}

const Home = (props: Props) => {
  const { getRooms } = useRoom();
  const { data: rooms = [] } = getRooms();
  return (
    <div className='container mx-auto'>

      {/* <Carousel /> */}
      <div className=''>
        <Carousel />
      </div>
      <div className='mt-10'>
        <Room rooms={rooms} />
      </div>
    </div>
  )
}

export default Home
