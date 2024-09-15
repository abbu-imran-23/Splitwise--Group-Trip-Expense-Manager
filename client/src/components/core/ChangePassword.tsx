import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { IChangePassword } from "@/interfaces/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "@/utils/Validations";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/Store";
import { changePassword } from "@/services/operations/authApi";

const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IChangePassword>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onChangePasswordFormSubmit = (
    changePasswordFormData: IChangePassword,
  ) => {
    dispatch(changePassword(changePasswordFormData, navigate, setValue));
  };

  return (
    <Card className="mx-auto max-w-sm md:max-w-md bg-black text-white opacity-90">
      <CardHeader className="flex flex-row gap-10">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl">Change Password</CardTitle>
          <CardDescription>
            Edit your information to Update the details
          </CardDescription>
        </div>
        <Avatar className="w-14 h-14">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={handleSubmit(onChangePasswordFormSubmit)}
        >
          <div className="grid gap-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter your old password"
              required
              className="text-black"
              {...register("currentPassword")}
            />
          </div>
          {errors.currentPassword && (
            <p className="text-red-500 text-xs">
              {errors.currentPassword.message}
            </p>
          )}
          <div className="grid gap-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              required
              className="text-black"
              {...register("newPassword")}
            />
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs">{errors.newPassword.message}</p>
          )}
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              required
              className="text-black"
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
          <div className="flex flex-row gap-4 my-2">
            <Button
              type="submit"
              className="w-full bg-green-800 hover:bg-green-700 duration-200"
            >
              Change Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;
