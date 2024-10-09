import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  return (
    <div className="sticky z-[100] h-14 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper className="flex">
        <div className="flex items-center h-full w-full">
          <Link href="/" className="font-bold text-lg">
            Phone<span className="text-green-600">CaseCom</span>
          </Link>
        </div>
        <div className="flex items-center">
          {" "}
          {user ? (
            <>
              <Link
                href="/api/auth/logout"
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                Sign out
              </Link>
              {isAdmin ? (
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Dashboard ✨
                </Link>
              ) : null}
              <Link
                href="/configure/upload"
                className={buttonVariants({
                  size: "sm",
                  className: "hidden sm:flex items-center gap-1",
                })}
              >
                Create case
                <ArrowRight className="ml-1.5 h-5 w-5" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/api/auth/register"
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                Sign up
              </Link>

              <Link
                href="/api/auth/login"
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                Login
              </Link>

              <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

              <Link
                href="/configure/upload"
                className={buttonVariants({
                  size: "sm",
                  className: "hidden sm:flex items-center gap-1",
                })}
              >
                Create case
                <ArrowRight className="ml-1.5 h-5 w-5" />
              </Link>
            </>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Navbar;
