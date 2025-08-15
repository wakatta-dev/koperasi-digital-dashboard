import type { UserRole } from "./types"

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  organizationId: string
}

export interface AuthSession {
  user: AuthUser
  token: string
  expiresAt: Date
}

// Mock authentication - replace with real implementation
const MOCK_USERS = [
  {
    id: "1",
    email: "vendor@test.com",
    password: "password",
    name: "Vendor User",
    role: "vendor" as UserRole,
    organizationId: "org1",
  },
  {
    id: "2",
    email: "koperasi@test.com",
    password: "password",
    name: "Koperasi User",
    role: "koperasi" as UserRole,
    organizationId: "org2",
  },
  {
    id: "3",
    email: "umkm@test.com",
    password: "password",
    name: "UMKM User",
    role: "umkm" as UserRole,
    organizationId: "org3",
  },
  {
    id: "4",
    email: "bumdes@test.com",
    password: "password",
    name: "BUMDes User",
    role: "bumdes" as UserRole,
    organizationId: "org4",
  },
]

export function getServerSession(request: Request): AuthSession | null {
  try {
    const cookieHeader = request.headers.get("cookie")
    if (!cookieHeader) return null

    const cookies = cookieHeader.split(";").reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split("=")
        acc[key] = value
        return acc
      },
      {} as Record<string, string>,
    )

    const sessionCookie = cookies["auth-session"]
    if (!sessionCookie) return null

    const session: AuthSession = JSON.parse(decodeURIComponent(sessionCookie))

    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      return null
    }

    return session
  } catch {
    return null
  }
}

export async function signIn(email: string, password: string, role: UserRole): Promise<AuthSession | null> {
  // Mock authentication logic
  const user = MOCK_USERS.find((u) => u.email === email && u.password === password && u.role === role)

  if (!user) {
    return null
  }

  const session: AuthSession = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
    },
    token: `mock-token-${user.id}`,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  }

  // Store session in localStorage and cookie
  if (typeof window !== "undefined") {
    localStorage.setItem("auth-session", JSON.stringify(session))
    // Set cookie for server-side access
    document.cookie = `auth-session=${encodeURIComponent(JSON.stringify(session))}; path=/; max-age=86400`
  }

  return session
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem("auth-session")
    if (!stored) return null

    const session: AuthSession = JSON.parse(stored)

    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      localStorage.removeItem("auth-session")
      return null
    }

    return session
  } catch {
    return null
  }
}

export function getUser(): AuthUser | null {
  const session = getSession()
  return session?.user || null
}

export function isAuthenticated(): boolean {
  return getSession() !== null
}

export function hasRole(role: UserRole): boolean {
  const user = getUser()
  return user?.role === role
}

export function signOut(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth-session")
    // Clear cookie
    document.cookie = "auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  }
  window.location.href = "/login"
}

export function requireAuth(): AuthUser {
  const user = getUser()
  if (!user) {
    window.location.href = "/login"
    throw new Error("Authentication required")
  }
  return user
}

export function requireRole(role: UserRole): AuthUser {
  const user = requireAuth()
  if (user.role !== role) {
    throw new Error(`Role ${role} required`)
  }
  return user
}
