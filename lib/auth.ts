import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                await connectToDatabase();

                // For initial setup: Check if any user exists, if not, create default admin
                // This is a "seed on demand" strategy for the first login
                let user = await User.findOne({ email: credentials.email });

                if (!user && credentials.email === process.env.ADMIN_EMAIL && credentials.password === process.env.ADMIN_PASSWORD) {
                    // Fallback to legacy env var login if user not in DB yet, OR script manual seed
                    // For now, let's keep simple: Only verify against DB or Fail.
                    // But to allow migration, let's support:
                    // If user is Env Admin -> Create him in DB securely?
                    // No, let's keep it strictly DB but adding a "secret backdoor" for first time setup is complex.
                    // BETTER: If no users exist in DB at all, allow the ENV admin and create the user.
                }

                if (!user) {
                    // Temporary Fallback to allow first login to create the DB entry
                    const adminEmail = process.env.ADMIN_EMAIL || "admin@grapeyear.com";
                    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

                    if (credentials.email === adminEmail && credentials.password === adminPassword) {
                        const hashedPassword = await bcrypt.hash(adminPassword, 10);
                        user = await User.create({
                            email: adminEmail,
                            password: hashedPassword,
                            name: "Admin"
                        });
                        return { id: user._id.toString(), name: user.name, email: user.email };
                    }
                    return null;
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    return null;
                }

                return { id: user._id.toString(), name: user.name, email: user.email };
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
