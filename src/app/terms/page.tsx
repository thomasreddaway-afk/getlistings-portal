import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Get Listings',
  description: 'Terms of Service for Get Listings Portal',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Login
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: January 2026
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using the Get Listings platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-4">
              Get Listings provides AI-powered seller prediction tools and market insights for real estate professionals. Our platform analyzes various data signals to help identify potential property sellers in your target suburbs.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
            <p className="text-gray-600 mb-4">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Acceptable Use</h2>
            <p className="text-gray-600 mb-4">
              You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, or impair the Service. You must comply with all applicable laws and regulations when using our platform.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Data and Privacy</h2>
            <p className="text-gray-600 mb-4">
              Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to the collection and use of information as described in our Privacy Policy.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of Get Listings and its licensors.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Subscription and Billing</h2>
            <p className="text-gray-600 mb-4">
              Certain features of the Service may require a paid subscription. You agree to pay all fees associated with your subscription plan. Subscription fees are billed in advance and are non-refundable.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Termination</h2>
            <p className="text-gray-600 mb-4">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              In no event shall Get Listings, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms, please contact us at support@getlistings.com.au
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
