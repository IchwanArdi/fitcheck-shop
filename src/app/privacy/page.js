export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-12 md:py-20">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-invert max-w-none space-y-8 text-gray-400">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you make a purchase, sign up for our newsletter, or contact us. This may include your name, email address, shipping address, and payment information.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Information</h2>
          <p>We use your information to process orders, communicate with you about your purchase, improve our services, and send marketing communications if you have opted in.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Data Security</h2>
          <p>We take reasonable measures to protect your personal information from unauthorized access or disclosure. However, no data transmission over the internet is 100% secure.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. Sharing Your Information</h2>
          <p>We do not sell your personal information. We may share it with third-party service providers (like shipping carriers and payment processors) to fulfill our services.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">5. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. Please contact us if you wish to exercise these rights.</p>
        </section>

        <section className="pt-8 border-t border-white/10">
          <p className="text-sm">Last updated: February 5, 2026</p>
        </section>
      </div>
    </div>
  );
}
