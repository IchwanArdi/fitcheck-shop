export default function FAQPage() {
  const faqs = [
    {
      q: "What is your shipping policy?",
      a: "We offer worldwide shipping. Orders are typically processed within 2-3 business days. Domestic shipping takes 3-5 days, while international shipping can take 10-14 days."
    },
    {
      q: "Can I return my order?",
      a: "Yes, we accept returns within 14 days of delivery. Items must be in their original, unused condition with all tags attached."
    },
    {
      q: "How do I choose the right size?",
      a: "We provide detailed size guides on every product page. If you're between sizes, we recommend sizing up for a relaxed fit or sizing down for a more tailored look."
    },
    {
      q: "How can I track my order?",
      a: "Once your order ships, you will receive an email with a tracking number and a link to the carrier's website."
    },
    {
      q: "Is my payment secure?",
      a: "Absolutely. We use industry-standard encryption and secure payment processors to ensure your data is always protected."
    }
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-12 md:py-20">
      <h1 className="text-3xl font-bold mb-4">FAQ</h1>
      <p className="text-gray-500 mb-12">Frequently asked questions about Fitcheck products and services.</p>
      
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 p-8 bg-blue-500/5 border border-blue-500/20 rounded-2xl text-center">
        <h3 className="font-bold mb-2">Still have questions?</h3>
        <p className="text-sm text-gray-500 mb-6">Contact our support team and we'll get back to you as soon as possible.</p>
        <button className="bg-white text-black font-bold py-2 px-6 rounded-full text-sm">
          Contact Support
        </button>
      </div>
    </div>
  );
}
