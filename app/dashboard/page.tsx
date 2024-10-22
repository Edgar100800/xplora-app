
import ButtonNewMedia from "@/components/dashboard/SidePanel/ButtonNewMedia";
import UserInfo from "@/components/dashboard/SidePanel/UserInfo";
import ListMedia from "@/components/dashboard/SidePanel/ListMedia";
import LogOutButtom from "@/components/dashboard/SidePanel/LogOutButtom";

import MediaDescription from "@/components/dashboard/MainPanel/MediaDescription";
export default function Dashboard() {

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="flex flex-col h-full">
          {/* User info */}
          <UserInfo />

          {/* Create new button */}
          <ButtonNewMedia />

          {/* List of items */}
          <ListMedia />

          {/* Logout button */}
          <LogOutButtom/>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-8 overflow-auto ">
        <MediaDescription />
        
        
      </div>
    </div>
  );
}
