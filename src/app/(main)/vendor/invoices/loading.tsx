/** @format */

import EnterpriseLoading from "@/components/shared/enterprise-loading";

export default function Loading() {
  return (
    <EnterpriseLoading
      // onComplete={handleLoadingComplete}
      duration={4000}
      showProgress={true}
      title="Enterprise Dashboard"
      subtitle="Initializing your business intelligence platform"
    />
  );
}
