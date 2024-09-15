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
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/Store";
import {
  deleteUser,
  fetchUser,
  updateUserDetails,
} from "@/services/operations/userApi";
import { useForm } from "react-hook-form";
import { IProfileDetails } from "@/interfaces/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileDetailsSchema } from "@/utils/Validations";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProfileDetails>({
    resolver: zodResolver(profileDetailsSchema),
  });

  const onProfileDetailsUpdateFormSubmit = (
    profileDetailsUpdateFormData: IProfileDetails,
  ) => {
    dispatch(updateUserDetails(profileDetailsUpdateFormData));
  };

  const userDetails = useSelector((state: RootState) => state.profile.user);
  console.log("User Details After setting in Redux", userDetails);

  console.log("Profile Component Rendered");

  return (
    <Card className="mx-auto max-w-sm md:max-w-md bg-black text-white opacity-90">
      <CardHeader className="flex flex-row gap-10">
        <div>
          <CardTitle className="text-xl">Profile</CardTitle>
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
          onSubmit={handleSubmit(onProfileDetailsUpdateFormSubmit)}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                placeholder="Max"
                defaultValue={userDetails.firstname}
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
                defaultValue={userDetails.lastname}
                required
                className="text-black"
                {...register("lastname")}
              />
            </div>
          </div>
          {(errors.firstname || errors.lastname) && (
            <p className="text-red-500 text-xs">
              {errors.firstname
                ? errors.firstname.message
                : errors.lastname?.message}
            </p>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              defaultValue={userDetails.email}
              className="text-black"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="text"
              placeholder="Phone"
              defaultValue={userDetails.phone}
              required
              className="text-black"
              {...register("phone")}
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone.message}</p>
          )}
          <Button
            type="submit"
            className="w-full bg-sky-800 hover:bg-sky-700 duration-200"
          >
            Update Details
          </Button>
          <div className="flex flex-row gap-4 my-4">
            <Link to="/profile/change-password" className="w-full">
              <Button
                type="submit"
                className="w-full bg-green-800 hover:bg-green-700 duration-200"
              >
                Change Password
              </Button>
            </Link>
            <Button
              type="submit"
              className="w-full bg-red-900 hover:bg-red-800 duration-200"
              onClick={() => dispatch(deleteUser(navigate))}
            >
              Delete Account
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Profile;
