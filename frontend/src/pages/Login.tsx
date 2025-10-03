import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiError } from "@/services";
import ShottyLogo from "@/components/ShottyLogo";
import { toast } from "sonner";
import { ZodError } from "zod";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    emailId: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      // Validate with Zod
      const validated = loginSchema.parse(formData);

      // Attempt login
      await login(validated);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle Zod validation errors
        const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof LoginFormData;
          if (field) {
            fieldErrors[field] = issue.message;
          }
        });
        setErrors(fieldErrors);
      } else if (error instanceof ApiError) {
        // Handle API errors
        if (error.details) {
          const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
          error.details.forEach((detail) => {
            fieldErrors[detail.field as keyof LoginFormData] = detail.message;
          });
          setErrors(fieldErrors);
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-gradient-to-bl from-accent/6 via-accent/3 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <ShottyLogo size="lg" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your Shotty account</CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailId">Email</Label>
              <Input
                id="emailId"
                name="emailId"
                type="email"
                placeholder="you@example.com"
                value={formData.emailId}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.emailId ? "border-destructive" : ""}
              />
              {errors.emailId && (
                <p className="text-sm text-destructive">{errors.emailId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
