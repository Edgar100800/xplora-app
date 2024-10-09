"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { User } from "@supabase/supabase-js";
import ListSection from "@/components/dashboard/ListSection";
import TaskSection from "@/components/dashboard/TaskSection";
import { List, Task } from "@/types/dashboard";

export default function Dashboard() {
  const [lists, setLists] = useState<List[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        fetchLists(user.id);
      }
    };
    checkUser();
  }, []);

  const fetchLists = async (userId: string) => {
    const response = await fetch(`/api/lists?userId=${userId}`);
    if (response.ok) {
      const listsData = await response.json();
      setLists(listsData);
    }
  };

  const fetchTasks = async (listId: string) => {
    if (!user) return;
    const response = await fetch(
      `/api/tasks?userId=${user.id}&listId=${listId}`
    );
    if (response.ok) {
      const tasksData = await response.json();
      setTasks(tasksData);
    }
  };

  const handleListSelect = (listId: string) => {
    setSelectedList(listId);
    fetchTasks(listId);
  };

  const handleListCreated = () => {
    if (user) {
      fetchLists(user.id);
    }
  };

  const handleTaskCreated = () => {
    if (selectedList) {
      fetchTasks(selectedList);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex flex-col text-black">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex">
        <ListSection
          lists={lists}
          selectedList={selectedList}
          onListSelect={handleListSelect}
          onListCreated={handleListCreated}
          userId={user?.id}
        />
        <TaskSection
          tasks={tasks}
          selectedList={selectedList}
          onTaskCreated={handleTaskCreated}
          userId={user?.id}
        />
      </main>
    </div>
  );
}
