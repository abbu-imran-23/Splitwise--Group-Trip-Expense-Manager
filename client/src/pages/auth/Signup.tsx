import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ISignUpFormData } from "@/interfaces/Auth";
import { signup } from "@/services/operations/authApi";
import { signupSchema } from "@/utils/Validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "@/redux/Store";

export const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSignUpFormSubmit = (signupFormData: ISignUpFormData) => {
    dispatch(signup(signupFormData, navigate));
  };

  return (
    <Card className="mx-auto max-w-sm bg-black text-white">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSignUpFormSubmit)}
          className="grid gap-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                placeholder="Max"
                required
                className="text-black"
                {...register("firstname")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                placeholder="Robinson"
                required
                className="text-black"
                {...register("lastname")}
              />
            </div>
            {(errors.firstname || errors.lastname) && (
              <p className="text-red-500 text-xs">
                {errors.firstname
                  ? errors.firstname.message
                  : errors.lastname?.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="robinson@example.com"
              required
              className="text-black"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              className="text-black"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full bg-green-700">
            Create an account
          </Button>
          <Button className="w-full flex gap-2 bg-slate-800 duration-200">
            <FaGoogle />
            <span>Sign up with Google</span>
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
