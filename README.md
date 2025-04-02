# Customer Support System

## Overview
Build a basic real-time customer support system using Node.js, Express, and Socket.io. It allows:
- Customers to start a new chat session.
- Support agents to receive and respond to customer messages in real-time.
- All chat messages to be stored in a MongoDB database.

## Features
### 1. Socket-based Real-time Messaging
- When a customer opens the chat, they connect to the server using Socket.io.
- Support agents also connect via Socket.io.
- Messages are exchanged in real-time via sockets.
- One support agent can handle multiple customers.

### 2. Backend API
- **POST** `/start-chat` → Initiate a chat session (returns a session ID).
- **GET** `/messages/:sessionId` → Retrieve all previous messages of a session.
- **POST** `/messages` → Save a message to MongoDB. Required fields: `sender`, `sessionId`, `message`.

### 3. Socket Events
- **join** → Join a session room (by session ID).
- **message** → Send a message.
- **receive** → Receive a real-time message.

### 4. Bonus Features
- Show active sessions to the support agent (**GET API** to fetch all active sessions).
- Add support for "agent typing..." status.

---

## Local Setup Guide
### 1. Clone the Repository
```sh
git clone https://github.com/Hero-debug-cloud/Customer_Support.git
cd Customer_Support
```

### 2. Backend Setup
```sh
npm install
```
- Create a `.env` file and add the following variable:
```sh
MONGO_URI=<your_mongodb_connection_string>
```
- Start the backend server:
```sh
npm start
```

### 3. Frontend Setup
```sh
cd frontend
npm install
npm start
```
- Access the system:
  - **Customer Role:** [http://localhost:3000/?role=customer](http://localhost:3000/?role=customer)
  - **Support Agent Role:** [http://localhost:3000/?role=support_agent](http://localhost:3000/?role=support_agent)

---

## API Documentation
Postman Collection: [Click here](https://universal-astronaut-810279.postman.co/workspace/Team-Workspace~c7fd442f-a330-43a0-8be4-e735a7542fc8/collection/30915968-887194c2-54e7-42c4-945e-201e8b79f715?action=share&creator=30915968)

---

