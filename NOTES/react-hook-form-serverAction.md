# Using Server Actions with React Hook Form and Zod (Next 15 / React 19)

There are two different form paradigms in modern Next:

## A) Client-driven forms

Using:

- React Hook Form (RHF)

- Zod (client validation)

- Manual call to a Server Action

### Pattern A — React Hook Form + Zod + Server Action

This is best when:

- You want strong client-side validation

- You want controlled inputs

- You want instant UX feedback

- You need complex forms

### Flow

1. RHF validates with Zod on the client.

2. If valid → you manually call the Server Action.

3. The Server Action:

  - Validates again (always validate on server)

  - Mutates database

  - Returns error OR redirects

Server Action
```ts
'use server'

export async function loginAction(data: LoginSchema) {
  // Validate again here (recommended)
  // Check DB
  // If error → return { error: "..." }
  // If success → redirect("/dashboard")
}
```
Client Form
```ts
const onSubmit = async (data) => {
  const result = await loginAction(data)

  if (result?.error) {
    setError("email", { message: result.error })
  }
}
<form onSubmit={handleSubmit(onSubmit)}>
```
No action= attribute.
No useActionState.

### When to Use This Pattern

Use this when:

- You need sophisticated validation

- You want maximum control

- You are building production-grade auth

- You are already using RHF in the project

This is the most flexible and scalable approach.


## B) Native Server Action forms

Using:

`<form action={serverAction}>`

`useActionState()`

`useFormStatus()`

You should not mix them blindly. Choose one architecture per form.

### Pattern B — Native Server Forms (No React Hook Form)

This is the "modern Next-native" approach.

Instead of managing submit manually, you do:

`<form action={formAction}>`

And you use:

- useActionState

- useFormStatus

- No RHF.

- useActionState

Used to receive returned values from a Server Action.

### Example:
```ts
export async function loginAction(prevState, formData) {
  const email = formData.get("email")

  if (!email) {
    return { error: "Email required" }
  }

  redirect("/dashboard")
}

Client:

const [state, formAction] = useActionState(loginAction, null)

<form action={formAction}>
  {state?.error && <p>{state.error}</p>}
</form>
```

## When to use useActionState

Use it when:

- You want simple forms

- You don’t need RHF

- You want minimal boilerplate

- You prefer server-driven validation

## useFormStatus (React 19)

This hook is used inside a form to **detect pending state**.

### Example:
```ts
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending}>
      {pending ? "Loading..." : "Submit"}
    </button>
  )
}
```
This replaces manual loading state.

## When NOT to Mix Things

Avoid this:

- RHF + <form action={...}>

- RHF + useActionState together

- Router push + redirect in Server Action

- Each pattern already solves submission and state. Mixing creates confusion.

## Decision Guide
Use React Hook Form when:

You need complex validation logic

You want immediate field-level validation

You want controlled inputs

The form is central to your UX

Use useActionState + useFormStatus when:

The form is simple

You want minimal client JS

You prefer server-driven validation

You are building smaller mutations (settings, toggles, simple login)