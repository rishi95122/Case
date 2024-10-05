"use server";

import userSchema from "../../utils/userSchema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const getAuthStatus = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id || !user.email) {
    throw new Error("Invalid user data");
  }

  const existingUser = await userSchema.findOne({ id: user.id });

  if (!existingUser) {
    console.log("user");
    const newuser = await userSchema.create({
      id: user.id,
      email: user.email,
    });
    console.log("user", newuser);
  }

  return { success: true };
};
