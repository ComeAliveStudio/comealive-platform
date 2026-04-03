'use client';

import { useState } from 'react';

type Member = {
  email?: string;
  plan?: 'explorer' | 'professional' | 'mastery' | string | null;
  plan_status?: 'active' | 'trialing' | 'past_due' | 'canceled' | string | null;
  stripe_customer_id?: string | null;
  plan_expires_at?: string | null;
  trial_ends_at?: string | null;
  cancel_at_period_end?: boolean | null;
};

function formatDate(value?: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString();
}

function StatusBadge({ status }: { status?: string | null }) {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    trialing: 'bg-blue-100 text-blue-700',
    past_due: 'bg-red-100 text-red-700',
    canceled: 'bg-gray-200 text-gray-600',
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[status || ''] || 'bg-gray-100 text-gray-700'}`}>
      {status || 'inactive'}
    </span>
  );
}

export default function BillingPage() {
  const [loadingPortal, setLoadingPortal] = useState(false);

  // TODO: rimpiazza questo con il tuo fetch reale da Supabase / loader / hook già esistente
  const member: Member = {
    plan: 'professional',
    plan_status: 'active',
    stripe_customer_id: 'temp',
    plan_expires_at: '2026-05-01T00:00:00.000Z',
    trial_ends_at: null,
    cancel_at_period_end: false,
  };

  async function openPortal() {
    try {
      setLoadingPortal(true);

      const res = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok || !data?.url) {
        throw new Error(data?.error || 'Unable to open portal');
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert('Unable to open billing portal');
    } finally {
      setLoadingPortal(false);
    }
  }

  const planLabel =
    member.plan === 'mastery'
      ? 'Mastery'
      : member.plan === 'professional'
      ? 'Professional'
      : 'Explorer';

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your subscription and billing settings.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">Current plan</p>
            <h2 className="mt-1 text-xl font-semibold">{planLabel}</h2>
          </div>
          <StatusBadge status={member.plan_status} />
        </div>

        <div className="mt-5 space-y-2 text-sm text-gray-600">
          {member.plan_status === 'active' && member.plan_expires_at && (
            <p>Renews on {formatDate(member.plan_expires_at)}</p>
          )}

          {member.plan_status === 'trialing' && member.trial_ends_at && (
            <p>Trial ends on {formatDate(member.trial_ends_at)}</p>
          )}

          {member.plan_status === 'past_due' && (
            <p className="text-red-600">Payment failed. Update your payment method.</p>
          )}

          {member.cancel_at_period_end && member.plan_expires_at && (
            <p className="text-red-600">Subscription will cancel on {formatDate(member.plan_expires_at)}</p>
          )}

          {!member.plan_status && <p>No active subscription.</p>}
        </div>
      </div>

      <div className="space-y-3">
        {member.plan !== 'mastery' && (
          <a
            href="https://buy.stripe.com/REPLACE_MASTERY_LINK"
            className="block rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-medium transition hover:bg-gray-50"
          >
            Upgrade to Mastery
          </a>
        )}

        {member.plan === 'explorer' && (
          <a
            href="https://buy.stripe.com/REPLACE_PROFESSIONAL_LINK"
            className="block rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-medium transition hover:bg-gray-50"
          >
            Upgrade to Professional
          </a>
        )}

        {!!member.stripe_customer_id && (
          <button
            onClick={openPortal}
            disabled={loadingPortal}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingPortal ? 'Opening...' : 'Manage subscription'}
          </button>
        )}

        {!member.stripe_customer_id && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            No billing account yet. Choose a plan to get started.
          </div>
        )}
      </div>
    </div>
  );
}
