"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserType } from "@prisma/client";

import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";


export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = createClient();
  const prisma = new PrismaClient();
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: `${firstName + " " + lastName}`,
        email: formData.get("email") as string,
      },
    },
  };

  const { data: userData, error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  } else if (userData.user) {
    try {
      const customerRole = await prisma.role.findUnique({ where: { type: UserType.CUSTOMER } })
      if (!customerRole) {
        throw new Error('Customer role not found')
      }
      console.log('Customer role found in database:', customerRole)
      const userBasic = await prisma.userBasic.create({
        data: {
          id: userData.user.id,
          role_id: customerRole.id,
          email: formData.get("email") as string,
          full_name: `${firstName} ${lastName}`,
          // avatar_url: userData.user?.user_metadata?.avatar_url,
        },
      })
      console.log('UserBasic created in database:', userBasic)

      const customer = await prisma.customer.create({
        data: {
          user_id: userBasic.id,
          payment_method: "Cash",
          address: "123 Main St, Anytown, USA",
        },
      })
      console.log('Customer created in database:', customer)

      console.log('User created in database:', userBasic)
    } catch (prismaError) {
      console.error('Failed to create user in database:', prismaError)
      redirect("/error")
    } finally {
      await prisma.$disconnect()
    }
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/logout");
}

export async function signInWithGoogle() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  // Wait for the OAuth process to complete
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log(authError);
    redirect("/error");
  }

  // Create user in the database
  try {
    const response = await fetch(`/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: user.id,
        full_name: user.user_metadata.full_name,
        email: user.email,
        avatar_url: user.user_metadata.avatar_url,
      }),
    });

    if (response.ok) {
      console.log('User created in database after Google sign-in');
    } else {
      console.error('Failed to create user in database after Google sign-in');
      // You might want to handle this error, perhaps by redirecting to an error page
    }
  } catch (error) {
    console.error('Error creating user in database:', error);
    // Handle the error as needed
  }

  redirect(data.url);
}
