import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";

export const options: NextAuthOptions = {
    pages: {
        signIn: '/auth/'
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "email@tu-email.com"
                },
                password: {
                    label: "Contraseña",
                    type: "password",
                    placeholder: "********"
                }
            },
            async authorize(credentials): Promise<User | null> {
                const res = await fetch("https://server.plushyzeus.com/auth", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        identifier: credentials?.email,
                        password: credentials?.password
                    })
                });
                if (!res.ok) {
                    return null;
                }
                const userData = await res.json();
                return {
                    id: userData.user.id,
                    name: userData.user.username,
                    email: userData.user.email,
                    jwt: userData.jwt
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user && user.jwt) {
                token.jwt = user.jwt;
            }
            return token;
        },
        async session({ session, token }) {
            // Agrega el JWT al objeto session
            if (token.jwt) {
                session.jwt = token.jwt as string;
            }
            return session;
        }
    }
}