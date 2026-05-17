type RazorpayResponse = { razorpay_payment_id?: string };

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadScript(src: string) {
  return new Promise<boolean>((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function payWithRazorpay(input: {
  amount: number;
  name: string;
  email?: string;
  phone?: string;
}) {
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (!key) return { ok: false, reason: "Razorpay key missing" };
  const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  if (!loaded || !window.Razorpay) return { ok: false, reason: "Razorpay checkout failed to load" };

  return new Promise<{ ok: true; paymentId: string } | { ok: false; reason: string }>((resolve) => {
    const checkout = new window.Razorpay!({
      key,
      amount: Math.round(input.amount * 100),
      currency: "INR",
      name: "CurryFlow",
      description: "Food order test payment",
      prefill: { name: input.name, email: input.email, contact: input.phone },
      theme: { color: "#f97316" },
      handler: (response: RazorpayResponse) => resolve({ ok: true, paymentId: response.razorpay_payment_id ?? `test_${Date.now()}` }),
      modal: { ondismiss: () => resolve({ ok: false, reason: "Payment cancelled" }) },
    });
    checkout.open();
  });
}
