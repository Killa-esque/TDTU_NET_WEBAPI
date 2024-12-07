import { User } from "@/types";

type PaginationProps = {
  data: User[];
  page: number;
  setPage: any;
  rowsPerPage: any;
  setRowsPerPage: any;
};

const Pagination = ({ data, page, setPage, rowsPerPage, setRowsPerPage }: any) => {
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="flex justify-between items-center mt-4">
      <span className="text-gray-600">Rows per page: {rowsPerPage}</span>
      <div className="flex items-center space-x-2">
        <button
          className="px-2 py-1 text-gray-600 hover:text-gray-800"
          onClick={() => setPage(page > 0 ? page - 1 : 0)}
          disabled={page === 0}
        >
          &lt;
        </button>
        <span className="text-gray-600">{page + 1} of {totalPages}</span>
        <button
          className="px-2 py-1 text-gray-600 hover:text-gray-800"
          onClick={() => setPage(page < totalPages - 1 ? page + 1 : page)}
          disabled={page >= totalPages - 1}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};
