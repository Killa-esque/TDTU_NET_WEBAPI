import { Image } from "antd";

type Props = {
  src: string | null | undefined;
  userName?: string | null | undefined;
};

function Avatar({ src, userName }: Props) {
  return (
    <div>
      {src ? (
        <Image
          className="rounded-full"
          height={30}
          width={30}
          alt="hasImage"
          src={src}
          preview={false} // Ant Design Image có thuộc tính preview, tắt preview nếu không cần
        />
      ) : userName ? (
        <img
          className="rounded-full"
          height={30}
          width={30}
          alt="nameImage"
          src={`https://ui-avatars.com/api/?name=${userName}`}
        />
      ) : (
        <Image
          className="rounded-full"
          height={30}
          width={30}
          alt="noUser"
          src="/assets/avatar.png"
          preview={false} // Tắt preview nếu không cần
        />
      )}
    </div>
  );
}

export default Avatar;
