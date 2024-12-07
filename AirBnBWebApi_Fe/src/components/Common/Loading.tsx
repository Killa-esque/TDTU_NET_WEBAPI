import loading from "@/assets/images/loading.gif";

type Props = {}

const Loading = (props: Props) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white z-[999]">
      <img src={loading} className="max-w-full max-h-full w-auto h-auto" alt="Loading..." />
    </div>
  )
}

export default Loading
