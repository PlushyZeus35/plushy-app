'use client'
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div>
      <h1>Iniciar sesión</h1>
        <form
            onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const email = formData.get("email");
            const password = formData.get("password");
    
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });
    
            if (result?.ok) {
                window.location.href = "/";
            } else {
                alert("Usuario o contraseña incorrectos");
            }
            }}
        >
            <input name="email" type="email" placeholder="Email" required />
            <input
                name="password"
                type="password"
                placeholder="Contraseña"
                required
            />
            <button type="submit">Iniciar sesión</button>
        </form>
        <p>
            ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </p>
        <p>¿Olvidaste tu contraseña? <a href="/forgot-password">Recuperar aquí</a></p>
            
    </div>
  );
}