/** @format */

import {
  areTenantConfigsEqual,
  buildEffectiveTenantConfig,
  getUserPrimaryRoleId,
  getUserPrimaryRoleName,
} from "@/app/(mvp)/bumdes/settings/helpers";

describe("settings helpers", () => {
  it("builds effective tenant config from defaults and tenant overrides", () => {
    const effective = buildEffectiveTenantConfig(
      {
        tenant_id: 7,
        business_name: "BUMDes Maju",
        business_type: "bumdes",
        timezone: "",
        currency: "",
        locale: "",
        feature_flags: {
          marketplace_enabled: false,
        },
        configs: {
          marketplace: {
            low_stock_threshold: 3,
          },
        },
      } as any,
      {
        timezone_default: "Asia/Makassar",
        currency_default: "IDR",
        locale_default: "id-ID",
        email_sender: "no-reply@desa.id",
        feature_flags_default: {},
      }
    );

    expect(effective.timezone).toBe("Asia/Makassar");
    expect(effective.currency).toBe("IDR");
    expect(effective.feature_flags.marketplace_enabled).toBe(false);
    expect(effective.configs.marketplace.low_stock_threshold).toBe(3);
    expect(effective.configs.accounting.invoice_prefix).toBe("");
  });

  it("treats effective config with fallback defaults as unchanged", () => {
    const effective = buildEffectiveTenantConfig(
      {
        tenant_id: 8,
        business_name: "BUMDes Sejahtera",
        business_type: "bumdes",
        timezone: "",
        currency: "",
        locale: "",
        feature_flags: {},
        configs: {},
      } as any,
      {
        timezone_default: "Asia/Jakarta",
        currency_default: "IDR",
        locale_default: "id-ID",
        email_sender: "no-reply@desa.id",
        feature_flags_default: {},
      }
    );

    expect(areTenantConfigsEqual(effective, { ...effective })).toBe(true);
    expect(
      areTenantConfigsEqual(effective, {
        ...effective,
        configs: {
          ...effective.configs,
          marketplace: {
            ...effective.configs.marketplace,
            low_stock_threshold: effective.configs.marketplace.low_stock_threshold + 1,
          },
        },
      })
    ).toBe(false);
  });

  it("reads primary role from flat backend user profile", () => {
    const user = {
      id: 11,
      full_name: "Admin Desa",
      email: "admin@desa.id",
      role: "admin",
      role_id: 5,
      status: true,
    };

    expect(getUserPrimaryRoleName(user)).toBe("admin");
    expect(getUserPrimaryRoleId(user)).toBe(5);
  });
});
