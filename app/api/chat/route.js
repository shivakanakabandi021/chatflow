import { connectDB } from '@/lib/mongodb'
import Message from '@/models/Message'
import jwt from 'jsonwebtoken'

export const dynamic = "force-dynamic"

const responses = {
  hi: "Hey there! Welcome to ChatFlow. How can I help you today?",
  hello: "Hello! Nice to meet you.",
  "what is your name": "I am ChatFlow Bot, your personal assistant.",
  "who are you": "I am ChatFlow Bot built to answer questions and chat with you.",
  "what is chatflow": "ChatFlow is a chatbot application built using modern web technologies.",
  "who created you": "I was created by Sanju as a full-stack chatbot project.",
  "cm of telangana": "The Chief Minister of Telangana is Revanth Reddy",
  "cm of ap": "The Chief Minister of Andhra Pradesh is Nara Chandrababu Naidu",
  "pm of india": "The Prime Minister of India is Narendra Modi",
  "capital of india": "The capital of India is New Delhi.",
  "red planet": "Mars is known as the Red Planet.",
  "python used for": "Python is used for AI, automation and web development.",
  "javascript used for": "JavaScript is used to build interactive websites.",
  "what is nextjs": "Next.js is a React framework used to build fast web applications.",
  "what is mongodb": "MongoDB is a NoSQL database used to store application data.",
  "what is jwt": "JWT stands for JSON Web Token used for authentication.",
  "top software companies": "Top software companies include Microsoft, Google, Apple and Oracle.",
  "cloud services": "Amazon AWS, Microsoft Azure and Google Cloud provide cloud services.",
  "how are you": "I am doing great! Thanks for asking.",
  "what can you do": "I can chat with you and answer basic questions.",
  thanks: "You are welcome! Happy to help.",
  bye: "Goodbye! Thanks for chatting with ChatFlow."
}

function getBotReply(message) {
  const msg = message.toLowerCase()

  for (const key in responses) {
    if (msg.includes(key)) {
      return responses[key]
    }
  }

  return `You said "${message}". I am still learning but I am here to chat!`
}

export async function POST(req) {
  try {

    await connectDB()

    const token = req.headers.get("authorization")?.split(" ")[1]

    if (!token) {
      return Response.json({ error: "No token" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const { message } = await req.json()

    const cleanMessage = message?.trim()

    if (!cleanMessage) {
      return Response.json({ error: "Empty message" }, { status: 400 })
    }

    const reply = getBotReply(cleanMessage)

    // save user message
    await Message.create({
      userId: decoded.userId,
      username: decoded.username,
      role: "user",
      content: cleanMessage,
      createdAt: new Date()
    })

    // save bot message
    await Message.create({
      userId: decoded.userId,
      username: decoded.username,
      role: "bot",
      content: reply,
      createdAt: new Date()
    })

    return Response.json({ reply })

  } catch (error) {

    console.error("Chat POST error:", error)

    return Response.json({ error: "Server error" }, { status: 500 })
  }
}

export async function GET(req) {
  try {

    await connectDB()

    const token = req.headers.get("authorization")?.split(" ")[1]

    if (!token) {
      return Response.json({ error: "No token" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const messages = await Message.find({
      userId: decoded.userId
    }).sort({ createdAt: 1 })

    return Response.json({ messages })

  } catch (error) {

    return Response.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {

    await connectDB()

    const token = req.headers.get("authorization")?.split(" ")[1]

    if (!token) {
      return Response.json({ error: "No token" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    await Message.deleteMany({
      userId: decoded.userId
    })

    return Response.json({ success: true })

  } catch (error) {

    return Response.json({ error: "Server error" }, { status: 500 })
  }
}