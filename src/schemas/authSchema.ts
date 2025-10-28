import { z } from 'zod';

const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .refine(val => /[A-Z]/.test(val), "Password must contain at least one uppercase letter")
  .refine(val => /[a-z]/.test(val), "Password must contain at least one lowercase letter")
  .refine(val => /[0-9]/.test(val), "Password must contain at least one number")
  .refine(val => /[!@#$%^&*]/.test(val), "Password must contain at least one special character (!@#$%^&*)")
  .refine(val => /^\S+$/.test(val), "Password must not contain whitespace");

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: passwordSchema,
});

export const signupSchema = z.object({
  email: z.email("Enter a valid email"),
  password: passwordSchema,
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
