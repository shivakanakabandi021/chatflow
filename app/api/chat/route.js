import { connectDB } from '@/lib/mongodb'
import Message from '@/models/Message'
import jwt from 'jsonwebtoken'

const responses = {
  hi: "Hey there! Welcome to ChatFlow. How can I help you today?",
  hello: "Hello! Nice to meet you.",
  "what is your name": "I am ChatFlow Bot, your personal assistant.",
  "who are you": "I am ChatFlow Bot built to answer questions and chat with you.",
  "what is chatflow": "ChatFlow is a chatbot application built using modern web technologies.",
  "who created you": "I was created by Sanju as a full-stack chatbot project.",
  "cm of telangana": "The Chief Minister of Telangana is Revanth Reddy",
  "cm of ap": "The Chief Minister of AndhraPradesh is Nara Chandrababu Naidu",
  "pm of india": "The Prime Minister of INDIA is Narendra Modi",
  "capital of india": "The capital of India is New Delhi.",
  "red planet": "Mars is known as the Red Planet.",
  "python used for": "Python is used for AI, automation and web development.",
  "javascript used for": "JavaScript is used to build interactive websites.",
  "what is nextjs": "Next.js is a React framework used to build fast web applications.",
  "what is mongodb": "MongoDB is a NoSQL database used to store application data.",
  "what is jwt": "JWT stands for JSON Web Token used for authentication.",
  "top software companies": "Top software companies include Microsoft, Google, Apple and Oracle.",
  "top finance companies": "Top finance companies include JPMorgan Chase, Goldman Sachs and Morgan Stanley.",
  "top investment companies": "Top investment companies include BlackRock, Vanguard and Fidelity.",
  "cloud services": "Amazon AWS, Microsoft Azure and Google Cloud provide cloud services.",
  "ai technology companies": "OpenAI, Google and Microsoft are leading AI companies.",
  "how are you": "I am doing great! Thanks for asking.",
  "what can you do": "I can chat with you and answer basic questions.",
  thanks: "You are welcome! Happy to help.",
  bye: "Goodbye! Thanks for chatting with ChatFlow."
}

function getBotReply(message) {
  const msg = message.toLowerCase()
  for (const key in responses) {
    if (msg.includes(key)) return responses[key]
  }
  return `You said "${message}". I am still learning but I am here to chat!`
}

export async function POST(req) {
  try {
    await connectDB()

    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) return Response.json({ error: 'No token' }, { status: 401 })

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      return Response.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { message } = await req.json()
    if (!message?.trim()) {
      return Response.json({ error: 'Empty message' }, { status: 400 })
    }

    const reply = getBotReply(message)

    // ✅ FIXED: using decoded.username directly from JWT!
    await Message.create({
      userId: decoded.userId,
      username: decoded.username,
      role: 'user',
      content: message
    })

    await Message.create({
      userId: decoded.userId,
      username: decoded.username,
      role: 'bot',
      content: reply
    })

    return Response.json({ reply })

  } catch (err) {
    console.error('Chat POST error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(req) {
  try {
    await connectDB()

    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) return Response.json({ error: 'No token' }, { status: 401 })

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      return Response.json({ error: 'Invalid token' }, { status: 401 })
    }

    const messages = await Message.find({
      userId: decoded.userId
    }).sort({ createdAt: 1 })

    return Response.json({ messages })

  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    await connectDB()

    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) return Response.json({ error: 'No token' }, { status: 401 })

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      return Response.json({ error: 'Invalid token' }, { status: 401 })
    }

    await Message.deleteMany({ userId: decoded.userId })
    return Response.json({ success: true })

  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}