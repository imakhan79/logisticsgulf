"use client";

import { useState } from "react";
import { updateCompany } from "./actions";

type Company = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  currency: string;
  timezone: string;
};

export function SettingsForm({ company }: { company: Company }) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setSaved(false);
    setError(null);
    const result = await updateCompany(company.id, formData);
    if (result?.error) setError(result.error);
    else setSaved(true);
  }

  return (
    <form action={onSubmit} className="max-w-md space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-600">Saved.</p>}

      <div>
        <label className="block text-sm font-medium">Company name</label>
        <input
          name="name"
          defaultValue={company.name}
          required
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          defaultValue={company.email ?? ""}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input
          name="phone"
          defaultValue={company.phone ?? ""}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Currency</label>
          <input
            name="currency"
            defaultValue={company.currency}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Timezone</label>
          <input
            name="timezone"
            defaultValue={company.timezone}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>
      <button
        type="submit"
        className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white"
      >
        Save changes
      </button>
    </form>
  );
}
