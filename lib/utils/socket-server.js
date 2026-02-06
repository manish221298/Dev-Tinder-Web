const crypto = require('crypto');

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash('sha256')
    .update([userId, targetUserId].sort().join('$'))
    .digest('hex');
};

const initializeSocket = (io) => {
  io.on('connection', async (socket) => {
    socket.on('joinChat', ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
    });

    socket.on('sendMessage', async ({ firstName, userId, targetUserId, text }) => {
      try {
        // Dynamically import ES modules
        const { Chat } = await import('../models/Chat.js');
        const connectDB = (await import('../db/connect.js')).default;

        await connectDB();
        const roomId = getSecretRoomId(userId, targetUserId);

        // check if chat exist between ids
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (!chat) {
          // if not then create
          chat = new Chat({
            participants: [userId, targetUserId],
            message: [],
          });
        }

        //add new chats
        chat.message.push({
          sendorId: userId,
          text,
        });

        await chat.save(); // save chats
        io.to(roomId).emit('messageReceived', { firstName, text });
      } catch (err) {
        console.log('Socket error:', err);
      }
    });

    socket.on('disconnect', () => { });
  });
};

module.exports = initializeSocket;
