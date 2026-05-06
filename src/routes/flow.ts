import type { UserStatus } from "../firebase/user-status";
import { ROUTE_PATHS } from "./paths";

export const getNextRouteForUserStatus = (status: UserStatus | null) => {
  if (!status?.onboardingCompleted) {
    return ROUTE_PATHS.onboarding;
  }

  if (!status.profileCompleted) {
    return ROUTE_PATHS.profile;
  }

  return ROUTE_PATHS.dashboard;
};
