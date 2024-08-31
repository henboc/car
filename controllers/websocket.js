const { Server } = require('socket.io');
const crypto = require('crypto');
const Message = require('../models/MessageModel'); // Ensure this path is correct
const User = require('../models/UserModel'); // Ensure this path is correct

// Replace these with your actual key and IV
const ENCRYPTION_KEY = '3f98c456c00aa7031ed53ab1204d0f7d'; // Must be 256 bits (32 characters)
const IV = '40c1242d5038e951'; // Must be 128 bits (16 characters)

const encrypt = (text) => {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(IV));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

const decrypt = (text) => {
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(IV));
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

function setupWebSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: 'https://app.craddule.com', // Allow requests from this origin
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
            credentials: true
        }
    });

    io.on('connection', socket => {
        console.log('New client connected');

        // Handle initial chat load
        socket.on('loadChat', async (projectId) => {
            try {
                const messages = await Message.find({ projectId }).populate('userId', 'first_name last_name');
                
                // Decrypt messages
                const decryptedMessages = messages.map(message => ({
                    ...message._doc,
                    content: decrypt(message.content)
                }));

                socket.emit('initialChat', decryptedMessages);
            } catch (error) {
                console.error('Error loading chat history:', error);
                socket.emit('error', { error: 'Internal Server Error' });
            }
        });

        // Handle real-time message sending and receiving
        socket.on('message', async message => {
            const { projectId, content, userId } = message;

            // Encrypt the message
            const encryptedMessage = encrypt(content);

            // Save the message to MongoDB
            const newMessage = new Message({ projectId, content: encryptedMessage, userId });
            await newMessage.save();

            // Fetch user details
            const user = await User.findById(userId);

            // Decrypt the message for broadcast
            const decryptedMessage = decrypt(encryptedMessage);

            // Broadcast the message to all connected clients
            io.emit('message', {
                projectId,
                content: decryptedMessage,
                userId: {_id :userId},
                createdAt: newMessage.createdAt
            });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
}

module.exports = { setupWebSocket };
