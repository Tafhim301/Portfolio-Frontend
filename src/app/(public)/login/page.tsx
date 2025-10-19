"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import {Eye,EyeOff} from 'lucide-react'



const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [seePassword,setSeePassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (data: LoginSchema) => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", 
      });

      const json = await res.json();
      
      if (!res.ok) {
        toast.error(json?.message || "Invalid credentials");
        setLoading(false);
        return;
      }
      
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Image / Branding */}
      <div className="relative hidden lg:flex items-center justify-center bg-gradient-to-br from-black to-[#2b0707]">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1920"
            alt="Login background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 text-white text-center px-10 max-w-md">
          <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
          <p className="text-lg text-gray-200">
            Manage your blogs, projects, and portfolio content from one place.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-sm p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-semibold">
              Sign in to Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <Input
                  placeholder="Email"
                  type="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <Input
                  placeholder="Password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full flex justify-center"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Login"}
              </Button>

              <p className="text-center text-sm text-gray-500 mt-2">
                This page is restricted to the <span className="font-medium text-black">admin only</span>.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
