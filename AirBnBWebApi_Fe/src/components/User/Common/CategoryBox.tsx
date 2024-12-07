import React, { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import qs from "query-string";

type Props = {
  icon: React.ReactNode;
  label: string;
  selected?: boolean;
};

function CategoryBox({ icon, label, selected }: Props) {
  const navigate = useNavigate(); // Sử dụng useNavigate từ react-router-dom
  const [params] = useSearchParams(); // Sử dụng useSearchParams từ react-router-dom

  const handleClick = useCallback(() => {
    let currentQuery = {};

    // Chuyển đổi các tham số tìm kiếm (search params) thành object
    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      category: label,
    };

    // Nếu category hiện tại đã được chọn, bỏ category khỏi query string
    if (params.get("category") === label) {
      delete updatedQuery.category;
    }

    // Tạo URL mới với các query string được cập nhật
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    navigate(url); // Sử dụng history.push để điều hướng
  }, [label, params]);

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer ${selected ? "border-b-neutral-800" : "border-transparent"
        } ${selected ? "text-neutral-800" : "text-neutral-500"}`}
    >
      {icon}
      <div className="font-medium text-xs">{label}</div>
    </div>
  );
}

export default CategoryBox;
