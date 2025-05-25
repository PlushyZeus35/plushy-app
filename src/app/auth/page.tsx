"use client"
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter as useNavigation } from "next/navigation";

type FormData = { email: string; password: string };

export default function LoginPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const navigation = useNavigation();

  const onSubmit = async (data: FormData) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password
    });
    if (result?.ok) {
      navigation.push("/protected");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" required />
      <input
        {...register("password")}
        type="password"
        placeholder="Contraseña"
        required
      />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
}
