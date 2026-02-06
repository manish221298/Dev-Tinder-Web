import axios from "axios";
import { baseUrl, getToken } from "../utils/constants";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Table = ({ headers, connectionData, _requestStatus }) => {
  const handleRequest = async (status, reqId) => {
    try {
      const res = await axios.post(
        `${baseUrl}/request/review/${status}/${reqId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (res?.status === 200) {
        _requestStatus(res?.data?.message);
        toast.success(res?.data?.message);
      }
    } catch (err) {
      if (err.status === 401) {
        toast.error(err?.response?.data?.message);
      }
    }
  };

  if (connectionData?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="text-xl font-semibold text-base-content/70">No {headers.includes("Actions") ? "Requests" : "Connections"} Found</h2>
        <p className="text-base-content/50 mt-2">Check back later!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr className="bg-base-200">
            {headers.map((header, index) => (
              <th key={index} className="font-bold text-base py-4 px-4">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {connectionData?.map((data, index) => (
            <tr key={index} className="hover:bg-base-200/50 transition-colors border-b border-base-300">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-[40px] h-[40px] rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                      <img
                        src={data?.photo || data?.fromUserId?.photo || "https://img.daisyui.com/images/profile/demo/2@94.webp"}
                        alt="Avatar"
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-base">
                      {data?.firstName
                        ? data?.firstName + " " + data?.lastName
                        : data?.fromUserId?.firstName +
                          " " +
                          data?.fromUserId?.lastName}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="badge badge-primary badge-lg">
                  {data?.nationality || data?.fromUserId?.nationality || "Not specified"}
                </span>
              </td>
              <td className="py-4 px-4 text-sm">{data?.email ? data?.email : data?.fromUserId?.email}</td>

              {headers.includes("Actions") && (
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRequest("accepted", data?._id)}
                      className="btn btn-success btn-sm hover:scale-105 transition-transform"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Accept
                    </button>
                    <button
                      onClick={() => handleRequest("rejected", data?._id)}
                      className="btn btn-error btn-sm hover:scale-105 transition-transform"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject
                    </button>
                  </div>
                </td>
              )}

              {headers.includes("Chat") && (
                <td className="py-4 px-4">
                  <Link to={`/chat/${data?._id}`}>
                    <button className="btn btn-primary btn-sm hover:scale-105 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Chat
                    </button>
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
