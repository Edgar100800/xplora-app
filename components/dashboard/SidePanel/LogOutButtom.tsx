"use client";
import React, { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";

function LogOutButtom() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  if (user) {
    return (
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            signout();
            setUser(null);
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          router.push("/login");
        }}
      >
        Login
      </Button>
    </div>
  );
}

export default LogOutButtom;
