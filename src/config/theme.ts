import { baseTheme } from "./theme.base";
import { eesad } from "./tenants/eesad";
import { consortium } from "./tenants/consortium";

const TENANTS = {
  eesad,
  consortium,
} as const;

type TenantId = keyof typeof TENANTS;

const fallback: TenantId = "eesad";

function getTenant() {
  const id = import.meta.env.PUBLIC_TENANT as TenantId | undefined;
  return TENANTS[id ?? fallback] ?? TENANTS[fallback];
}

const tenant = getTenant();

export const theme = {
  tenant: {
    id: tenant.id,
    name: tenant.name,
    logo: tenant.logo,
  },
  colors: {
    ...baseTheme.colors,
    ...tenant.colors,
  },
} as const;