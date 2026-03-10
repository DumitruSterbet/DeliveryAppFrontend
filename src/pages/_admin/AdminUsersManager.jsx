import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Button, Icon, Title } from "@/components";
import {
  useCreateAdminUser,
  useDeleteAdminUser,
  useFetchAdminUserDetails,
  useFetchAdminUsers,
  useToggleAdminUserLock,
  useUpdateAdminUserRole,
} from "@/lib/actions";
import { useCurrentUser } from "@/lib/store";

const ALL_ROLES = ["Customer", "Merchant", "Courier", "Administrator"];

const normalizeRole = (value) => String(value || "").trim().toLowerCase();

const asArray = (payload, fallbackKey) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.[fallbackKey])) return payload[fallbackKey];
  if (Array.isArray(payload?.users)) return payload.users;
  return [];
};

const getUserId = (item) => item?.id || item?.userId || item?.uid || item?._id;

const getUserEmail = (item) => item?.email || "No email";

const getUserRole = (item) => item?.role || "Customer";

const isUserLocked = (item) => Boolean(item?.isLocked ?? item?.locked ?? item?.isDisabled);

const getUserName = (item) => {
  const directName = item?.username || item?.name || item?.fullName;
  if (directName) return directName;

  const email = getUserEmail(item);
  if (!email || !email.includes("@")) return "Unknown";

  const localPart = email.split("@")[0] || "";
  if (!localPart) return "Unknown";

  return localPart.charAt(0).toUpperCase() + localPart.slice(1);
};

export default function AdminUsersManager({
  pageClassName,
  title,
  description,
  roleFilter,
  lockCreateRole = true,
  overviewVariant = "users",
  integrationTitle,
  integrationDescription,
  integrationActions = [],
}) {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const { user, isLoaded } = currentUser || {};

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: roleFilter || "Customer",
  });

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isUsersError,
    refetch: refetchUsers,
  } = useFetchAdminUsers();

  const {
    data: selectedUserData,
    isLoading: isLoadingUserDetails,
    isError: isUserDetailsError,
    refetch: refetchUserDetails,
  } = useFetchAdminUserDetails({
    userId: selectedUserId,
    enabled: Boolean(selectedUserId),
  });

  const { mutate: createAdminUser, isPending: isCreatingUser } = useCreateAdminUser();
  const { mutate: deleteAdminUser, isPending: isDeletingUser } = useDeleteAdminUser();
  const { mutate: updateAdminUserRole, isPending: isUpdatingRole } = useUpdateAdminUserRole();
  const { mutate: toggleAdminUserLock, isPending: isTogglingLock } = useToggleAdminUserLock();

  const users = useMemo(() => asArray(usersData, "users"), [usersData]);

  const filteredUsers = useMemo(() => {
    if (!roleFilter) return users;
    const targetRole = normalizeRole(roleFilter);
    return users.filter((item) => normalizeRole(getUserRole(item)) === targetRole);
  }, [users, roleFilter]);

  const selectedUser =
    selectedUserData?.user ||
    (selectedUserData && !Array.isArray(selectedUserData) ? selectedUserData : null);

  const selectedRole = getUserRole(selectedUser);
  const selectedLocked = isUserLocked(selectedUser);

  const createRoles = lockCreateRole && roleFilter ? [roleFilter] : ALL_ROLES;

  const listLabel = roleFilter ? `${roleFilter} List` : "Users List";

  const isOnlineUser = (item) => {
    if (item?.isOnline === true || item?.online === true) return true;
    const status = normalizeRole(item?.status || item?.availabilityStatus || item?.onlineStatus);
    return status === "online" || status === "active";
  };

  const isPendingUser = (item) => {
    if (item?.isPending === true) return true;
    const status = normalizeRole(item?.status || item?.approvalStatus);
    return status === "pending" || status === "awaiting" || status === "awaiting_approval";
  };

  const isFlaggedUser = (item) => {
    if (item?.isFlagged === true) return true;
    const status = normalizeRole(item?.status || item?.riskStatus);
    return status === "flagged" || status === "review" || status === "manual_review";
  };

  const isSuspendedUser = (item) => {
    if (item?.isSuspended === true) return true;
    const status = normalizeRole(item?.status || item?.accountStatus);
    return status === "suspended" || status === "blocked" || isUserLocked(item);
  };

  const overviewCards = useMemo(() => {
    const total = filteredUsers.length;
    const locked = filteredUsers.filter((item) => isUserLocked(item)).length;
    const active = total - locked;

    if (overviewVariant === "couriers") {
      const online = filteredUsers.filter((item) => isOnlineUser(item)).length;
      const pending = filteredUsers.filter((item) => isPendingUser(item)).length;
      const flagged = filteredUsers.filter((item) => isFlaggedUser(item)).length;

      return [
        { label: "Total", value: total, hint: "All courier accounts" },
        { label: "Online", value: online, hint: "Active right now" },
        { label: "Pending", value: pending, hint: "Awaiting approval" },
        { label: "Flagged", value: flagged, hint: "Needs manual review" },
      ];
    }

    if (overviewVariant === "merchants") {
      const pending = filteredUsers.filter((item) => isPendingUser(item)).length;
      const suspended = filteredUsers.filter((item) => isSuspendedUser(item)).length;

      return [
        { label: "Total", value: total, hint: "All merchant accounts" },
        { label: "Pending", value: pending, hint: "Waiting for review" },
        { label: "Active", value: active, hint: "Currently approved" },
        { label: "Suspended", value: suspended, hint: "Temporarily disabled" },
      ];
    }

    return [
      { label: "Total", value: total, hint: "All customer accounts" },
      { label: "Active", value: active, hint: "Can access platform" },
      { label: "Locked", value: locked, hint: "Login blocked" },
      {
        label: "Pending",
        value: filteredUsers.filter((item) => isPendingUser(item)).length,
        hint: "Awaiting verification",
      },
    ];
  }, [filteredUsers, overviewVariant]);

  useEffect(() => {
    if (!selectedUserId) return;

    const stillVisible = filteredUsers.some((item) => getUserId(item) === selectedUserId);
    if (!stillVisible) {
      setSelectedUserId(null);
    }
  }, [filteredUsers, selectedUserId]);

  if (!isLoaded) {
    return (
      <section className={pageClassName}>
        <div className="py-12 text-center text-secondary">Loading users...</div>
      </section>
    );
  }

  if (!user || user.role !== "Administrator") {
    return <Navigate to="/" replace={true} />;
  }

  const handleRefresh = () => {
    refetchUsers();
    if (selectedUserId) {
      refetchUserDetails();
    }
  };

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.email || !newUser.password || !newUser.role) {
      return;
    }

    createAdminUser(newUser, {
      onSuccess: () => {
        setNewUser({
          username: "",
          email: "",
          password: "",
          role: roleFilter || "Customer",
        });
      },
    });
  };

  const handleUpdateRole = (role) => {
    if (!selectedUserId || !role) {
      return;
    }

    updateAdminUserRole({ userId: selectedUserId, role });
  };

  const handleToggleLock = () => {
    if (!selectedUserId) {
      return;
    }

    toggleAdminUserLock(selectedUserId);
  };

  const handleDeleteUser = () => {
    if (!selectedUserId) {
      return;
    }

    deleteAdminUser(selectedUserId, {
      onSuccess: () => {
        setSelectedUserId(null);
      },
    });
  };

  return (
    <section className={pageClassName}>
      <Title name={title} desc={description} type="large" />

      <div className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((item) => (
            <div key={item.label} className="rounded-xl border border-divider/30 bg-card p-4">
              <p className="text-xs uppercase tracking-wider text-secondary">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-onNeutralBg">{item.value}</p>
              <p className="mt-1 text-xs text-secondary">{item.hint}</p>
            </div>
          ))}
        </div>

        {(integrationTitle || integrationDescription || integrationActions.length > 0) && (
          <div className="rounded-xl border border-divider/30 bg-main/20 p-5">
            {integrationTitle ? (
              <h3 className="text-lg font-semibold text-onNeutralBg">{integrationTitle}</h3>
            ) : null}
            {integrationDescription ? (
              <p className="mt-1 text-sm text-secondary">{integrationDescription}</p>
            ) : null}
            {integrationActions.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {integrationActions.map((action) => (
                  <Button
                    key={`${action.label}-${action.to || "action"}`}
                    variant="outlined"
                    className="rounded-lg"
                    onClick={() => action?.to && navigate(action.to)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
        )}

        <div className="rounded-xl border border-divider/30 bg-main/20 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-onNeutralBg">Create User</h3>
            <Button
              variant="outlined"
              className="rounded-lg border-divider/50"
              onClick={handleRefresh}
            >
              <div className="flex items-center gap-2">
                <Icon name="IoSync" size={16} />
                <span>Refresh</span>
              </div>
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <input
              type="text"
              value={newUser.username}
              onChange={(event) =>
                setNewUser((prev) => ({ ...prev, username: event.target.value }))
              }
              placeholder="Username"
              className="w-full rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
            />
            <input
              type="email"
              value={newUser.email}
              onChange={(event) =>
                setNewUser((prev) => ({ ...prev, email: event.target.value }))
              }
              placeholder="Email"
              className="w-full rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
            />
            <input
              type="password"
              value={newUser.password}
              onChange={(event) =>
                setNewUser((prev) => ({ ...prev, password: event.target.value }))
              }
              placeholder="Password"
              className="w-full rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
            />

            {lockCreateRole && roleFilter ? (
              <div className="flex items-center rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg">
                {roleFilter}
              </div>
            ) : (
              <select
                value={newUser.role}
                onChange={(event) => setNewUser((prev) => ({ ...prev, role: event.target.value }))}
                className="w-full rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
              >
                {createRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mt-3">
            <Button
              label={isCreatingUser ? "Creating..." : `Create ${roleFilter || "User"}`}
              variant="contained"
              className="rounded-lg"
              onClick={handleCreateUser}
              disabled={isCreatingUser}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
            <h3 className="text-lg font-semibold text-onNeutralBg">{listLabel}</h3>
            <p className="mt-1 text-sm text-secondary">
              {isLoadingUsers ? "Loading users..." : `${filteredUsers.length} users found`}
            </p>

            {isUsersError ? (
              <p className="mt-3 text-sm text-red-500">Could not load users.</p>
            ) : filteredUsers.length === 0 && !isLoadingUsers ? (
              <p className="mt-3 text-sm text-secondary">No users available.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {filteredUsers.map((item) => {
                  const itemId = getUserId(item);
                  const active = itemId === selectedUserId;
                  const locked = isUserLocked(item);

                  return (
                    <button
                      key={itemId}
                      type="button"
                      className={`w-full rounded-lg border p-3 text-left transition-all ${
                        active
                          ? "border-primary/40 bg-primary/5"
                          : "border-divider/30 bg-card hover:border-primary/20"
                      }`}
                      onClick={() => setSelectedUserId(itemId)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-onNeutralBg">{getUserName(item)}</p>
                          <p className="text-xs text-secondary">{getUserEmail(item)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-secondary">{getUserRole(item)}</p>
                          <p className={`text-xs ${locked ? "text-red-500" : "text-green-500"}`}>
                            {locked ? "Locked" : "Active"}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-divider/30 bg-main/20 p-4">
            <h3 className="text-lg font-semibold text-onNeutralBg">User Detail</h3>

            {!selectedUserId ? (
              <p className="mt-2 text-sm text-secondary">Select a user to manage role and status.</p>
            ) : isLoadingUserDetails ? (
              <p className="mt-2 text-sm text-secondary">Loading user details...</p>
            ) : isUserDetailsError ? (
              <p className="mt-2 text-sm text-red-500">Could not load user details.</p>
            ) : (
              <div className="mt-3 space-y-4">
                <div className="rounded-lg border border-divider/30 bg-card p-3">
                  <p className="text-sm font-medium text-onNeutralBg">{getUserName(selectedUser)}</p>
                  <p className="text-xs text-secondary">{getUserEmail(selectedUser)}</p>
                  <p className="mt-2 text-xs text-secondary">Role: {selectedRole}</p>
                  <p className={`text-xs ${selectedLocked ? "text-red-500" : "text-green-500"}`}>
                    {selectedLocked ? "Account is locked" : "Account is active"}
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-secondary">
                    Change Role
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedRole}
                      onChange={(event) => handleUpdateRole(event.target.value)}
                      className="w-full rounded-lg border border-divider/40 bg-card px-3 py-2 text-sm text-onNeutralBg outline-none"
                      disabled={isUpdatingRole}
                    >
                      {ALL_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    label={isTogglingLock ? "Updating..." : selectedLocked ? "Unlock Account" : "Lock Account"}
                    variant="outlined"
                    className="rounded-lg border-divider/50"
                    onClick={handleToggleLock}
                    disabled={isTogglingLock}
                  />
                  <Button
                    label={isDeletingUser ? "Deleting..." : "Delete User"}
                    variant="outlined"
                    className="rounded-lg border-red-500/50 text-red-500"
                    onClick={handleDeleteUser}
                    disabled={isDeletingUser}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}