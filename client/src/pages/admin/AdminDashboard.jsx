import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminDashboard() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-6">
        <Outlet />
      </div>
    </div>
  );
}
