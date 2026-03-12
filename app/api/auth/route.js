import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    await connectDB();

    const { action, username, email, password } = await req.json();

    if (action === 'signup') {
      const existing = await User.findOne({ email });
      if (existing)
        return Response.json({ error: 'Email already registered' }, { status: 400 });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: hashedPassword
      });

      return Response.json({ success: true, userId: user._id });
    }

    if (action === 'login') {
      const user = await User.findOne({ email });

      if (!user)
        return Response.json({ error: 'User not found' }, { status: 404 });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return Response.json({ error: 'Wrong password' }, { status: 401 });

      const token = jwt.sign(
{
userId: user._id,
username: user.username
},
process.env.JWT_SECRET
)

      return Response.json({
        success: true,
        token,
        username: user.username
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Auth error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}