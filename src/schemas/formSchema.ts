import { z } from 'zod';

export const formSchema = z.object({
    email: z.string().email('Inserisci una mail valida'),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "La password deve contenere almeno una lettera maiuscola")
        .regex(/[0-9]/, "La password deve contenere almeno un numero"),
});

export type FormSchema = z.infer<typeof formSchema>