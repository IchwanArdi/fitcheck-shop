export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-12 md:py-20">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-invert max-w-none space-y-8 text-gray-400">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
          <p>By accesssing and using "Fitcheck" (the "Site"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Site.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. Product Descriptions</h2>
          <p>We strive for accuracy in our product descriptions and images. However, we do not warrant that product descriptions or other content are error-free or complete. Color accuracy depends on your monitor settings.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Orders and Payments</h2>
          <p>All orders are subject to acceptance. We reserve the right to refuse or cancel any order for any reason. Payments must be made through our authorized payment methods.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. Shipping and Delivery</h2>
          <p>Shipping times are estimates. We are not responsible for delays caused by shipping carriers or customs. Risk of loss passes to you upon delivery to the carrier.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">5. Intellectual Property</h2>
          <p>All content on this Site, including text, graphics, logos, and images, is the property of Fitcheck and protected by international copyright laws.</p>
        </section>

        <section className="pt-8 border-t border-white/10">
          <p className="text-sm">Last updated: February 5, 2026</p>
        </section>
      </div>
    </div>
  );
}
