import React, { useEffect, useState } from "react";
import { createSocketConnection } from "../utils/socket";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseUrl, getToken } from "../utils/constants";
import { messageSendTime } from "../utils/datetime";

const Chat = () => {
  const { targetUserId } = useParams();
  const loggedInUser = useSelector((store) => store.user);
  const userId = loggedInUser?._id;
  const [newMessage, setNewMessage] = useState("");
  const [message, setMessage] = useState([]);

  const fetchChat = async () => {
    try {
      const res = await axios.get(`${baseUrl}/chat/${targetUserId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setMessage(res?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchChat();
  }, [targetUserId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const socket = createSocketConnection();
    socket.emit("joinChat", { userId, targetUserId });

    socket.on("messageReceived", ({ firstName, text }) => {
      setMessage((prevState) => [...prevState, { firstName, text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: loggedInUser.firstName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <>
      <div className="flex justify-center m-2">
        <div className="text-white border rounded-xl bg-gray-800 border-gray-700 w-full sm:w-2/3 p-5 shadow-lg">
          <h1 className="border-b border-gray-600 pb-2 mb-4 text-lg font-semibold">
            Chat Room
          </h1>

          <div className="h-[30vh] sm:h-[50vh] overflow-y-auto space-y-4 p-2">
            {message?.map((message, index) => {
              return (
                <div
                  key={index}
                  className={`chat   ${
                    message?.firstName === loggedInUser?.firstName
                      ? "chat-end "
                      : "chat-start"
                  }`}
                >
                  <div className="chat-header ">
                    {message?.firstName}
                    <time className="text-xs opacity-50">
                      {messageSendTime(message.createdAt)}
                    </time>
                  </div>
                  <div
                    className={`chat-bubble ${
                      message?.firstName === loggedInUser?.firstName
                        ? " bg-primary"
                        : ""
                    }`}
                  >
                    {message?.text}
                  </div>
                  <div className="chat-footer opacity-50">Seen</div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center rounded-xl bg-gray-700 p-2 sm:p-3 mt-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="h-[38px] sm:h-[50px] rounded-lg sm:rounded-full w-10/12 px-4 bg-gray-600 text-white outline-none"
            />
            <button
              onClick={sendMessage}
              className=" h-[38px] sm:h-[50px]  rounded-lg sm:rounded-full w-2/12 bg-primary text-white font-bold ml-3"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
