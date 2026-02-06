import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        sendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: { type: String, required: true },
    },
    { timestamps: true }
);

const chatSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    message: [messageSchema],
});

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

export { Chat };

