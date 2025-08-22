/** @format */

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { listVendorPlansAction } from "@/actions/billing";

export default async function PlansPage() {
  const plans = await listVendorPlansAction();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-4">
            {plans.map((plan) => (
              <li key={plan.id}>
                {plan.name} - Rp {plan.price}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

