"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

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
    const response = await fetch(`/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        id: userData.user.id,
        full_name: `${firstName + " " + lastName}`, 
        email: formData.get("email") as string, 
        // avatar_url: userData.user?.user_metadata?.avatar_url,
        // password: formData.get("password") as string,
      }),
    })

    if (response.ok) {
      console.log('User created in database')
      // router.push('/dashboard')
    } else {
      console.error('Failed to create user in database')
      // setError('Failed to create user in database')
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
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
