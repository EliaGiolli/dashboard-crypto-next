export interface UserStore {
    user: User | null,
    setUser: (u: any) => void,
    logout: () => void
}

interface User {
    id: string,
    email: string
}