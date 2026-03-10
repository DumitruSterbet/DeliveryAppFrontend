/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useMemo, useState } from "react";
import { json, Link, useLocation, useNavigate } from "react-router-dom";

import { classNames } from "@/lib/utils";
import { useAppUtil, useAppModal, useCurrentUser } from "@/lib/store";
import { useNotificationsStore } from "@/lib/stores/notifications.store";
import { useLogout } from "@/lib/actions";

import { useTheme } from "@/hooks";
import { themeConfig, defaultThemeConfig } from "@/configs";

import { Icon, Overlay, Title, Tooltip, Button, Skeletons } from "@/components";

const User = () => {
  const { currentUser } = useCurrentUser();

  const { user } = currentUser || {};
  const { email, username, imageUrl } = user || {};

  return (
    <Link
      className="gap-2 p-2 rounded flex_justify_between bg-main"
      to="/profile"
    >
      <div className="w-10 h-10 rounded-full flex_justify_center bg-sidebar">
        {imageUrl ? (
          <img src={imageUrl} className="w-full h-full rounded-full" />
        ) : (
          <Icon name="FaRegUser" size={16} />
        )}
      </div>

      {email && (
        <div className="flex flex-col flex-1 text-sm">
          <span className="">@{username}</span>
          <span className="break-all text-secondary">{email}</span>
        </div>
      )}
    </Link>
  );
};

const CreatePlaylistTooltipContent = ({ hideTooltip }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 rounded bg-card">
      <Title
        name="Create a Playlist?"
        desc="Log in to create and share playlists."
        type="small"
      />
      <div className="flex justify-end gap-2 item-center">
        <Button
          label="Not now"
          variant="outlined"
          className="border-0"
          onClick={hideTooltip}
        />
        <Button
          label="Sign In"
          variant="contained"
          onClick={() => navigate("/login")}
        />
      </div>
    </div>
  );
};

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [toggleNav, setToggleNav] = useState(false);

  const { logout: signOut } = useLogout();
  const { currentUser } = useCurrentUser();
  const store = useNotificationsStore();
  const unreadCount = store?.unreadCount;

  const { isLoaded: isLoadedUser, user } = currentUser || {};

  const { getToggleMenu, toggleMenu, searchRef, getToggleSearch } =
    useAppUtil();

  const [theme] = useTheme();

  const { close: modalClose } = useAppModal();

  const { sidebar, orientation, isMobile } = theme || defaultThemeConfig;
  const isHorizontal = orientation === "horizontal" && !isMobile;

  const isFolded = sidebar === "folded";

  useEffect(() => {
    getToggleMenu && getToggleMenu(false);
  }, [pathname]);

  const getMenuLinks = () => {
    const userRole = user?.role;
    console.log("User Role in Sidebar:", userRole);
    // Merchant navigation
    if (userRole === "Merchant") {
      return [
        {
          id: "dashboard",
          name: "Dashboard",
          to: "/merchant/dashboard",
          icon: "BiPlayCircle",
          tooltip: "hover",
        },
        {
          id: "products",
          name: "Products",
          to: "/merchant/products",
          icon: "RiListIndefinite",
          tooltip: "hover",
        },
        {
          id: "orders",
          name: "Orders",
          to: "/merchant/orders",
          icon: "FaSearchengin",
          tooltip: "hover",
        },
        {
          id: "inventory",
          name: "Inventory",
          to: "/merchant/inventory",
          icon: "RiListIndefinite",
          tooltip: "hover",
        },
        {
          id: "customers",
          name: "Customers",
          to: "/merchant/customers",
          icon: "BiUser",
          tooltip: "hover",
        },
        {
          id: "payouts",
          name: "Payouts",
          to: "/merchant/payouts",
          icon: "BsBasket",
          tooltip: "hover",
        },
        {
          id: "shop",
          name: "Couriers Availability",
          to: "/shop",
          icon: "MdLocalShipping",
          tooltip: "hover",
        },
        {
          id: "coupons",
          name: "Coupons",
          to: "/merchant/coupons",
          icon: "PiCategoryDuotone",
          tooltip: "hover",
        },
        {
          id: "settings",
          name: "Settings",
          to: "/merchant/settings",
          icon: "BiUser",
          tooltip: "hover",
        },
      ];
    }

    // Courier navigation
    if (userRole === "Courier") {
      return [
        {
          id: "courier_dashboard",
          name: "Dashboard",
          to: "/courier/dashboard",
          icon: "BiPlayCircle",
          tooltip: "hover",
        },
        {
          id: "deliveries",
          name: "Deliveries",
          to: "/courier/deliveries",
          icon: "BiPlayCircle",
          tooltip: "hover",
        },
        {
          id: "schedule",
          name: "Schedule",
          to: "/courier/schedule",
          icon: "RiListIndefinite",
          tooltip: "hover",
        },
        {
          id: "history",
          name: "History",
          to: "/courier/history",
          icon: "FaSearchengin",
          tooltip: "hover",
        },
        {
          id: "availability",
          name: "Availability",
          to: "/courier/availability",
          icon: "MdLocalShipping",
          tooltip: "hover",
        },
        {
          id: "earnings",
          name: "Earnings",
          to: "/courier/earnings",
          icon: "BsBasket",
          tooltip: "hover",
        },
      ];
    }

    // Admin navigation
    if (userRole === "Administrator") {
      return [
        {
          id: "admin_dashboard",
          name: "Admin Dashboard",
          to: "/admin/dashboard",
          icon: "BiPlayCircle",
          tooltip: "hover",
        },
        {
          id: "users",
          name: "Users",
          to: "/admin/users",
          icon: "BiUser",
          tooltip: "hover",
        },
        {
          id: "merchants",
          name: "Merchants",
          to: "/admin/merchants",
          icon: "RiListIndefinite",
          tooltip: "hover",
        },
        {
          id: "couriers",
          name: "Couriers",
          to: "/admin/couriers",
          icon: "BiUserVoice",
          tooltip: "hover",
        },
        {
          id: "orders",
          name: "Orders",
          to: "/admin/orders",
          icon: "BsCart3",
          tooltip: "hover",
        },
        {
          id: "finance",
          name: "Finance",
          to: "/admin/finance",
          icon: "MdLocalOffer",
          tooltip: "hover",
        },
        {
          id: "categories",
          name: "Categories",
          to: "/admin/categories",
          icon: "PiCategoryDuotone",
          tooltip: "hover",
        },
        {
          id: "analytics",
          name: "Analytics",
          to: "/admin/analytics",
          icon: "FaSearchengin",
          tooltip: "hover",
        },
      ];
    }

    // Customer (User) or Not Logged In - Default navigation
    return [
      {
        id: "discover",
        name: "Discover",
        to: "/discover",
        icon: "BiPlayCircle",
        tooltip: "hover",
      },
      {
        id: "browse",
        name: "Browse",
        to: "/browse",
        icon: "RiListIndefinite",
        tooltip: "hover",
      },
    ];
  };

  const getLibraryLinks = () => {
    const userRole = user?.role;

    // Customer (User) - has library features
    if (user && (userRole === "Customer" || !userRole)) {
      return [
        {
          id: "favourite_playlists",
          name: "Favourite Products",
          to: "/favourite-playlists",
          icon: "AiFillHeart",
          tooltip: "hover",
        },
        {
          id: "my_orders",
          name: "My Orders",
          to: "/my-orders",
          icon: "BsBasket",
          tooltip: "hover",
        },
        {
          id: "cart",
          name: "Cart",
          to: "/cart",
          icon: "BsCart3",
          tooltip: "hover",
        },
        {
          id: "checkout",
          name: "Checkout",
          to: "/checkout",
          icon: "MdAddShoppingCart",
          tooltip: "hover",
        },
        {
          id: "order_tracking",
          name: "Order Tracking",
          to: "/order-tracking",
          icon: "MdLocalShipping",
          tooltip: "hover",
        },
        {
          id: "addresses",
          name: "Addresses",
          to: "/addresses",
          icon: "BiUser",
          tooltip: "hover",
        },
        {
          id: "payment_methods",
          name: "Payment Methods",
          to: "/payment-methods",
          icon: "BsBasket",
          tooltip: "hover",
        },
        {
          id: "support",
          name: "Support",
          to: "/support",
          icon: "BiUser",
          tooltip: "hover",
        },
      ];
    }

    // Not logged in - show create playlist prompt
    if (!user) {
      return [
        {
          id: "create_playlists",
          name: "Create Playlists",
          icon: "PiPlaylistBold",
          dialog: true,
          tooltip: "click",
          tooltipContent: CreatePlaylistTooltipContent,
          arrowPos: "left-top",
          arrowClassName: "text-card",
        },
      ];
    }

    // Other roles (Merchant, Courier, Admin) - no library section
    return [];
  };

  const getMerchantSections = () => {
    return [
      {
        name: "Overview",
        subLinks: [
          {
            id: "dashboard",
            name: "Dashboard",
            to: "/merchant/dashboard",
            icon: "BiPlayCircle",
            tooltip: "hover",
          },
        ],
      },
      {
        name: "Catalog",
        subLinks: [
          {
            id: "products",
            name: "Products",
            to: "/merchant/products",
            icon: "RiListIndefinite",
            tooltip: "hover",
          },
          {
            id: "inventory",
            name: "Inventory",
            to: "/merchant/inventory",
            icon: "RiListIndefinite",
            tooltip: "hover",
          },
          {
            id: "coupons",
            name: "Coupons",
            to: "/merchant/coupons",
            icon: "PiCategoryDuotone",
            tooltip: "hover",
          },
        ],
      },
      {
        name: "Sales",
        subLinks: [
          {
            id: "orders",
            name: "Orders",
            to: "/merchant/orders",
            icon: "FaSearchengin",
            tooltip: "hover",
          },
          {
            id: "customers",
            name: "Customers",
            to: "/merchant/customers",
            icon: "BiUser",
            tooltip: "hover",
          },
          {
            id: "payouts",
            name: "Payouts",
            to: "/merchant/payouts",
            icon: "BsBasket",
            tooltip: "hover",
          },
        ],
      },
      {
        name: "Delivery",
        subLinks: [
          {
            id: "shop",
            name: "Couriers Availability",
            to: "/shop",
            icon: "MdLocalShipping",
            tooltip: "hover",
          },
        ],
      },
      {
        name: "Store",
        subLinks: [
          {
            id: "settings",
            name: "Settings",
            to: "/merchant/settings",
            icon: "BiUser",
            tooltip: "hover",
          },
        ],
      },
    ];
  };

  const getCustomerSections = () => {
    return [
      {
        name: "Explore",
        subLinks: [
          {
            id: "discover",
            name: "Discover",
            to: "/discover",
            icon: "BiPlayCircle",
            tooltip: "hover",
          },
          {
            id: "browse",
            name: "Browse",
            to: "/browse",
            icon: "RiListIndefinite",
            tooltip: "hover",
          },
          {
            id: "search",
            name: "Search",
            to: "/search",
            icon: "FaSearchengin",
            tooltip: "hover",
          },
        ],
      },
      {
        name: "Shopping",
        subLinks: [
          {
            id: "favourite_playlists",
            name: "Favourite Products",
            to: "/favourite-playlists",
            icon: "AiFillHeart",
            tooltip: "hover",
          },
          {
            id: "cart",
            name: "Cart",
            to: "/cart",
            icon: "BsCart3",
            tooltip: "hover",
          },
          {
            id: "checkout",
            name: "Checkout",
            to: "/checkout",
            icon: "MdAddShoppingCart",
            tooltip: "hover",
          },
        ],
      },
      {
        name: "Orders",
        subLinks: [
          {
            id: "my_orders",
            name: "My Orders",
            to: "/my-orders",
            icon: "BsBasket",
            tooltip: "hover",
          },
          {
            id: "order_tracking",
            name: "Order Tracking",
            to: "/order-tracking",
            icon: "MdLocalShipping",
            tooltip: "hover",
          },
        ],
      },
      {
        name: "Preferences",
        subLinks: [
          {
            id: "addresses",
            name: "Addresses",
            to: "/addresses",
            icon: "BiUser",
            tooltip: "hover",
          },
          {
            id: "payment_methods",
            name: "Payment Methods",
            to: "/payment-methods",
            icon: "BsBasket",
            tooltip: "hover",
          },
        ],
      },
      {
        name: "Help",
        subLinks: [
          {
            id: "support",
            name: "Support",
            to: "/support",
            icon: "BiUser",
            tooltip: "hover",
          },
        ],
      },
    ];
  };

  const getCourierSections = () => {
    return [
      {
        name: "Operations",
        subLinks: [
          {
            id: "courier_dashboard",
            name: "Dashboard",
            to: "/courier/dashboard",
            icon: "BiPlayCircle",
            tooltip: "hover",
          },
          {
            id: "deliveries",
            name: "Deliveries",
            to: "/courier/deliveries",
            icon: "BiPlayCircle",
            tooltip: "hover",
          },
          {
            id: "availability",
            name: "Availability",
            to: "/courier/availability",
            icon: "MdLocalShipping",
            tooltip: "hover",
          },
        ],
      },
      {
        name: "Planning",
        subLinks: [
          {
            id: "schedule",
            name: "Schedule",
            to: "/courier/schedule",
            icon: "RiListIndefinite",
            tooltip: "hover",
          },
        ],
      },
      {
        name: "Performance",
        subLinks: [
          {
            id: "history",
            name: "History",
            to: "/courier/history",
            icon: "FaSearchengin",
            tooltip: "hover",
          },
          {
            id: "earnings",
            name: "Earnings",
            to: "/courier/earnings",
            icon: "BsBasket",
            tooltip: "hover",
          },
        ],
      },
    ];
  };

  const getAdminSections = () => {
    return [
      {
        name: "Overview",
        subLinks: [
          {
            id: "admin_dashboard",
            name: "Admin Dashboard",
            to: "/admin/dashboard",
            icon: "BiPlayCircle",
            tooltip: "hover",
          },
          {
            id: "analytics",
            name: "Analytics",
            to: "/admin/analytics",
            icon: "FaSearchengin",
            tooltip: "hover",
          },
        ],
      },
      {
        name: "Management",
        subLinks: [
          {
            id: "users",
            name: "Users",
            to: "/admin/users",
            icon: "BiUser",
            tooltip: "hover",
          },
          {
            id: "merchants",
            name: "Merchants",
            to: "/admin/merchants",
            icon: "RiListIndefinite",
            tooltip: "hover",
          },
          {
            id: "couriers",
            name: "Couriers",
            to: "/admin/couriers",
            icon: "BiUserVoice",
            tooltip: "hover",
          },
        ],
      },
      {
        name: "Operations",
        subLinks: [
          {
            id: "orders",
            name: "Orders",
            to: "/admin/orders",
            icon: "BsCart3",
            tooltip: "hover",
          },
          {
            id: "finance",
            name: "Finance",
            to: "/admin/finance",
            icon: "MdLocalOffer",
            tooltip: "hover",
          },
          {
            id: "categories",
            name: "Categories",
            to: "/admin/categories",
            icon: "PiCategoryDuotone",
            tooltip: "hover",
          },
        ],
      },
    ];
  };

  const navlinks = useMemo(() => {
    const userRole = user?.role;
    const menuLinks = getMenuLinks();
    const libraryLinks = getLibraryLinks();
    const accountSection = {
      name: "Account",
      subLinks: [
        ...(user
          ? [
              {
                id: "profile",
                name: "Profile",
                to: "/profile",
                icon: "BiUser",
                tooltip: "hover",
              },
              {
                id: "notifications",
                name: "Notifications",
                to: "/notifications",
                icon: "IoMdNotificationsOutline",
                badgeCount: unreadCount,
                tooltip: "hover",
              },
              {
                id: "logout",
                name: "Logout",
                to: "/logout",
                onClick: signOut,
                icon: "MdLogout",
                tooltip: "hover",
              },
            ]
          : [
              {
                id: "sign_up",
                name: "Sign Up",
                to: "/register",
                icon: "BiUser",
                tooltip: "hover",
              },
              {
                id: "sign_in",
                name: "Sign In",
                to: "/login",
                icon: "MdLogin",
                tooltip: "hover",
              },
            ]),
      ],
    };

    if (userRole === "Merchant") {
      return [...getMerchantSections(), accountSection];
    }

    if (userRole === "Courier") {
      return [...getCourierSections(), accountSection];
    }

    if (userRole === "Administrator") {
      return [...getAdminSections(), accountSection];
    }

    if (user && (userRole === "Customer" || !userRole)) {
      return [...getCustomerSections(), accountSection];
    }

    return [
      {
        name: "Menu",
        subLinks: menuLinks,
      },
      ...(libraryLinks.length > 0
        ? [
            {
              name: "Library",
              subLinks: libraryLinks,
            },
          ]
        : []),
      accountSection,
    ];
  }, [user, unreadCount, signOut]);

  const hideTooltip = (hideFunc) => {
    setToggleNav(false);
    if (hideFunc) hideFunc();
  };

  const hoverWidth = themeConfig.sidebars.full;

  return (
    <section
      className={classNames(
        "sidebar_section z-[1100] fixed top-0",
        isMobile &&
          classNames(
            "transition-all duration-500",
            toggleMenu && !isHorizontal ? "left-0" : "-left-sidebar"
          ),

        isHorizontal
          ? "top-navbar sidebar_horizontal_width bg-sidebar-0 shadow-dialog"
          : "h-full"
      )}
    >
      <Overlay isOpen={toggleMenu} handleIsOpen={getToggleMenu} />

      <div
        {...(!isHorizontal && {
          onMouseOver: () => setToggleNav(true),
          onMouseOut: () => setToggleNav(false),
        })}
        {...(toggleNav &&
          !isHorizontal && { style: { width: `${hoverWidth}px` } })}
        className={classNames(
          "nav-list overflow-auto hide_scrollbar relative",
          isHorizontal
            ? "h-navbar bg-card-skeleton"
            : "top-navbar sidebar_height w-sidebar duration-500 transition-all pb-[100px] bg-sidebar"
        )}
      >
        <div
          className={classNames(
            "relative text-white text-base",
            isHorizontal && "flex h-full border-t border-divider"
          )}
        >
          {isLoadedUser ? (
            <>
              {navlinks.map((item) => (
                <div
                  key={item.name}
                  className={classNames("mt-4", isHorizontal && "flex gap-3")}
                >
                  {((!isFolded && !isHorizontal) || toggleNav) && (
                    <span
                      className={classNames(
                        "block p-3 mx-3 text-gray-400 text-sm uppercase"
                      )}
                    >
                      {item.name}
                    </span>
                  )}

                  <ul className={classNames(isHorizontal && "flex")}>
                    {item.subLinks.map((link) => (
                      <Fragment key={link.name}>
                        <li
                          key={link.name}
                          className={classNames(
                            `dropdown_${link.id}`,
                            "relative px-[10px] group",
                            isHorizontal && "flex_justify_center"
                          )}
                        >
                          <Tooltip
                            id={link.id}
                            tooltipType={link.tooltip}
                            arrowPos={link?.arrowPos}
                            arrowClassName={link?.arrowClassName}
                            TooltipComp={link?.tooltipContent}
                            disabled={link.tooltip === "hover"}
                            hideTooltipFunc={hideTooltip}
                          >
                            <button
                              onClick={() => {
                                if (link?.onClick) {
                                  link?.onClick();
                                } else if (link?.dialog) {
                                  return null;
                                } else if (link?.refFocus) {
                                  link?.refFocus?.current?.focus();
                                  getToggleSearch(true);
                                } else {
                                  navigate(link.to);
                                }
                                modalClose();
                              }}
                              className={classNames(
                                "flex flex-row items-center gap-2 h-12 w-full outline-0 border-none",
                                isHorizontal ? "items-center p-3" : "pl-[20px]",
                                pathname.includes(link.to) &&
                                  "rounded bg-primary-opacity"
                              )}
                            >
                              <Icon
                                name={link.icon}
                                className={classNames(
                                  "group-hover:!text-primary",
                                  pathname.includes(link.to) && "!text-primary"
                                )}
                                size={20}
                              />

                              <div
                                className={classNames(
                                  "group-hover:text-primary text-sm flex items-center gap-3 whitespace-nowrap",
                                  pathname.includes(link.to)
                                    ? "text-primary"
                                    : "text-onNeutralBg",
                                  !(isFolded && !isHorizontal && !isMobile) ||
                                    toggleNav
                                    ? "opacity-100 transition-opacity duration-1000"
                                    : "invisible w-0 opacity-0"
                                )}
                              >
                                {link.name}
                                {link.badgeCount && (
                                  <div className="flex items-center justify-center w-4 h-4 rounded-full right-2 bg-primary animate-bounce group-hover:bg-white">
                                    <span className="text-xs text-white group-hover:text-primary">
                                      {unreadCount}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </button>
                          </Tooltip>
                        </li>
                      </Fragment>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          ) : (
            <Skeletons.NavlistSkeleton />
          )}
          {isLoadedUser && user && isMobile && isLoadedUser && (
            <div className="fixed bottom-0 p-2 bg-sidebar w-sidebar max-h-[100px]">
              <User />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Sidebar;
