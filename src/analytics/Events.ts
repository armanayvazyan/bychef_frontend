import analyticManager from "./AnalyticsManager";

export const logPageOpenEvent = (additionalProperties?: Record<string, any>): void => {
  const properties: Record<string, string | null> = {
    page: sessionStorage.getItem("currentPage"),
    origin:  sessionStorage.getItem("previousPage"),
    ...additionalProperties
  };

  if (properties.origin === "direct") {
    properties.referrer_url = document.referrer;
  }
  analyticManager.logEvent("page_open", properties);
};

export const logLanguageApplyEvent = (language: string): void => {
  const properties: Record<string, string | null> = {
    language: language,
    page:  sessionStorage.getItem("currentPage")
  };
  analyticManager.logEvent("language_apply", properties);
};

export const logChefClickEvent = (chefId: number): void => {
  const properties: Record<string, string | null> = {
    chef_id: chefId.toString(),
    page:  sessionStorage.getItem("currentPage"),
  };
  analyticManager.logEvent("chef_click", properties);
}

export const logCartAddEvent = (dishId: number, count: number, source: string, spiceLevelChanged: boolean): void => {
  const properties: Record<string, any> = {
    chef_id: sessionStorage.getItem("currentChefId"),
    count: count,
    dish_id: dishId,
    source: source,
    spice_level_change: spiceLevelChanged,
    page:  sessionStorage.getItem("currentPage"),
  };
  analyticManager.logEvent("cart_add", properties);
}