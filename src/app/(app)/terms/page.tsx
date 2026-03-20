"use client";

export default function TermsOfServicePage() {
    return (
        <div className="mx-auto p-8 text-[var(--accent)]">
            <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
            <p className="mb-4">
                Welcome to <strong>Habit Rhythm</strong>! By using our app, you agree to the following terms:
            </p>
            <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Service</h2>
            <p className="mb-4">
                You may use Habit Rhythm to track your personal habits. You are responsible for your account and all
                activity under it.
            </p>
            <h2 className="text-xl font-semibold mt-6 mb-2">2. User Content</h2>
            <p className="mb-4">
                You retain ownership of your data. We do not claim any rights to your habits or completion data.
            </p>
            <h2 className="text-xl font-semibold mt-6 mb-2">3. Account Security</h2>
            <p className="mb-4">
                You are responsible for maintaining the security of your account. Do not share your login credentials.
            </p>
            <h2 className="text-xl font-semibold mt-6 mb-2">4. Prohibited Use</h2>
            <ul className="list-disc pl-6 mb-4">
                <li>Do not use the app for illegal activities.</li>
                <li>Do not attempt to disrupt or hack the service.</li>
                <li>Do not upload harmful or offensive content.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">5. Termination</h2>
            <p className="mb-4">
                We reserve the right to suspend or terminate your account if you violate these terms.
            </p>
            <h2 className="text-xl font-semibold mt-6 mb-2">6. Changes to Terms</h2>
            <p className="mb-4">
                We may update these Terms of Service at any time. Changes will be posted on this page.
            </p>
            <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact</h2>
            <p>
                For questions about these terms, contact us at <a href="mailto:support@jakub-urbanski.me"
                                                                  className="underline">support@jakub-urbanski.me</a>.
            </p>
        </div>
    );
}
