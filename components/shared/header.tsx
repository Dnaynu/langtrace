"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SCHEDULE_CALL_LINK } from "@/lib/constants";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useQuery } from "react-query";
import { ModeToggle } from "./mode-toggle";
import Nav from "./nav";

export async function Header({
  name,
  email,
  avatar,
}: {
  name: string;
  email: string;
  avatar: string;
}) {
  const fetchAccountStats = useQuery({
    queryKey: [`fetch-account-stats-${email}`],
    queryFn: async () => {
      const response = await fetch(`/api/stats/account?email=${email}`);
      const result = await response.json();
      return result;
    },
  });

  return (
    <header className="flex flex-col gap-2 w-full px-12 z-30 sticky top-0 bg-primary-foreground">
      <div className="flex justify-between items-center w-full pt-3">
        <Link
          href="/projects"
          className="text-xl font-bold flex items-center gap-0"
        >
          Langtrace AI
        </Link>
        <div className="flex items-end gap-3">
          <div className="flex flex-col mr-4">
            <p className="text-sm text-muted-foreground">
              Total Spans Ingested
            </p>
            <p className="text-sm font-semibold">
              {fetchAccountStats.data?.totalSpans} out of 50,000 per month
            </p>
            <Link
              className="underline text-blue-600 flex items-center"
              href={SCHEDULE_CALL_LINK}
              target="_blank"
            >
              Book a call
              <ArrowTopRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt="User Avatar"
                  className="rounded-full w-10 cursor-pointer"
                />
              ) : (
                <Button
                  variant="outline"
                  className="rounded-full w-10 bg-gradient-to-tr from-slate-600 via-slate-200 to-slate-800"
                ></Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="h-full w-56 mx-12 mt-1 overflow-x-auto">
              <DropdownMenuLabel className="flex flex-col gap-1 break-all">
                <p className="font-semibold">{name}</p>
                <p className="font-normal">{email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex" onClick={() => signOut()}>
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Nav />
    </header>
  );
}
