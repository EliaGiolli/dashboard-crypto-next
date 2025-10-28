import dbConnect from '@/lib/dbConnection';
import AuthService from '@/services/authService';
import { signupSchema, loginSchema } from '@/schemas/authSchema';

const authService = new AuthService();

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();

  if (body.action === 'signup') {
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ errors: parsed.error.issues }), { status: 400 });
    }
    const { email, password } = parsed.data;
    const user = await authService.signup(email, password);
    return new Response(JSON.stringify({ message: 'User created', user }), { status: 201 });
  }

  if (body.action === 'login') {
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ errors: parsed.error.issues }), { status: 400 });
    }
    const { email, password } = parsed.data;
    const token = await authService.login(email, password);
    return new Response(JSON.stringify({ token }), { status: 200 });
  }

  return new Response('Invalid action', { status: 400 });
}
