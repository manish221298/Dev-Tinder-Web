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
    return <h1 className="text-center text-primary">Request Not Exist</h1>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="text-left">
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {connectionData?.map((data, index) => (
            <tr key={index}>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">
                      {data?.firstName
                        ? data?.firstName + " " + data?.lastName
                        : data?.fromUserId?.firstName +
                          " " +
                          data?.fromUserId?.lastName}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span className="badge badge-ghost badge-sm">
                  {data?.nationality || "Indian"}
                </span>
              </td>
              <td>{data?.email ? data?.email : data?.fromUserId?.email}</td>

              {headers.includes("Actions") && (
                <td className="flex gap-2 justify-between">
                  <button
                    onClick={() => handleRequest("accepted", data?._id)}
                    className="btn btn-success"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequest("rejected", data?._id)}
                    className="btn btn-error"
                  >
                    Reject
                  </button>
                </td>
              )}

              {headers.includes("Chat") && (
                <td className="">
                  <Link to={`/chat/${data?._id}`}>
                    {" "}
                    <button className="btn btn-success">Chat</button>
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
