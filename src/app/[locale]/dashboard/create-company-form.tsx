"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCompany } from "./onboarding-actions";

export function CreateCompanyForm({
  countries,
}: {
  countries: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    const result = await createCompany(formData);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="max-w-sm rounded-lg border bg-white p-4">
      <h3 className="mb-3 text-sm font-medium">Set up your company</h3>
      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
      <form action={onSubmit} className="space-y-3">
        <input
          name="name"
          placeholder="Company name"
          required
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <select name="country_id" required className="w-full rounded-md border px-3 py-2 text-sm">
          <option value="">Select country</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create company"}
        </button>
      </form>
    </div>
  );
}
