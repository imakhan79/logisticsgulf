"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, type CustomerInput } from "./schema";
import { createCustomer } from "./actions";

export function CustomerForm({ locale }: { locale: string }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerInput>({ resolver: zodResolver(customerSchema) });

  async function onSubmit(values: CustomerInput) {
    setServerError(null);
    const result = await createCustomer(locale, values);
    if (result?.error) setServerError(result.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-3">
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <div>
        <label className="block text-sm font-medium">Name</label>
        <input {...register("name")} className="w-full rounded-md border px-3 py-2 text-sm" />
        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input type="email" {...register("email")} className="w-full rounded-md border px-3 py-2 text-sm" />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input {...register("phone")} className="w-full rounded-md border px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">Address</label>
        <input {...register("address")} className="w-full rounded-md border px-3 py-2 text-sm" />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Create customer"}
      </button>
    </form>
  );
}
