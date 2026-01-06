import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const adminEmail = process.env.ADMIN_EMAIL || "admin@grapeyear.com";
                const adminPassword = process.env.ADMIN_PASSWORD || "admin123"; // Fallback for dev only

                if (
                    credentials?.email === adminEmail &&
                    credentials?.password === adminPassword
                ) {
                    return { id: "1", name: "Admin", email: adminEmail };
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: "/auth/signin", // We'll create a custom sign-in page later or use default for now
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = "admin";
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                // @ts-ignore
                session.user.role = token.role;
            }
            return session;
        }
    }
};
