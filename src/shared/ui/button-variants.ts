import { cva, type VariantProps } from "class-variance-authority"

/**
 * The button's class definition, deliberately NOT in `button.tsx`.
 *
 * That file is `'use client'`, and everything a client module exports is a
 * client reference — calling `buttonVariants()` from a Server Component
 * fails with "Attempted to call buttonVariants() from the server but
 * buttonVariants is on the client".
 *
 * Keeping the variants here lets a server-rendered <Link> be styled as a
 * button without dragging the client component in with it.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-violet-500 text-slate-200 hover:bg-violet-700 focus:border-2 focus:border-violet-800 focus:outline-4 focus:outline-violet-700",
        hamburger:
          "bg-transparent text-white hover:bg-violet-300 focus:border-4 focus:border-violet-800 outline-2 outline-violet-700 border-2 border-violet-500",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        error:
          "bg-red-600 hover:bg-red-800 text-white focus:border-4 focus:border-red-900 outline-2 outline-red-900 border-2 border-red-900",
        favorites: "bg-blue-500 hover:bg-blue-600 text-slate-200 hover:text-slate-200 focus:border-4 focus:border-blue-900 outline-2 outline-blue-900 border-2 border--900",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>

export { buttonVariants }
