"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Breadcrumbs from "@/components/Breadcrumbs";

const Header = () => {
  const { user } = useUser();

  return (
    <div className="flex min-h-20 items-center justify-between p-5">
      {user && (
        <h1 className="text-2xl font-semibold leading-tight">
          {user?.firstName} {`'s`} Space
        </h1>
      )}

      {/*  BREADCRUMBS */}
      <Breadcrumbs />

      <div>
        <SignedOut>
          <SignInButton></SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Header;
