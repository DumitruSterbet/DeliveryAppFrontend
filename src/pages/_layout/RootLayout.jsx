import { Outlet } from "react-router-dom";
import { classNames } from "@/lib/utils";
import { useCurrentUser } from "@/lib/store";

import { ScrollProvider } from "@/providers";

import { Modal, Navbar, Sidebar, TrackPlayer, TopPlay, ShoppingCartModal } from "@/components";

const RootLayout = () => {
  const { currentUser } = useCurrentUser();
  const { isLoaded, user } = currentUser || {};
  const role = user?.role;

  const showTopProducts = isLoaded
    ? !user || role === "Customer" || !role
    : false;

  return (
    <>
      <ScrollProvider>
        <div
          className="flex flex-col max-w-full m-auto xl:flex-row app bg-main"
          style={
            !showTopProducts
              ? {
                  "--main-width": "calc(100% - var(--sidebar-horizontal-width))",
                  "--nav-width": "100vw",
                }
              : undefined
          }
          id="main_app"
        >
          <Sidebar />
          <main className="relative w-full mx-auto overflow-hidden main_section">
            <Navbar />
            <div
              className={classNames(
                "relative mb-6 xl:mb-[100px] overflow-y-scroll hide_scrollbar p-3 sm:p-6 main_width page_content mt-main-top",
                showTopProducts ? "max-w-7xl" : "max-w-none"
              )}
            >
              <Outlet />
            </div>
            <Modal />
            <ShoppingCartModal />
          </main>
          <TopPlay />
        </div>
      </ScrollProvider>
      <TrackPlayer />
    </>
  );
};

export default RootLayout;
