"use client";

export default function PrivacyPolicyPage() {
    return (
        <div className="mx-auto p-8 text-[var(--accent)]">
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <p className="mb-4">
                <strong>Habit Rhythm</strong> (&#34;we&#34;, &#34;us&#34;, or &#34;our&#34;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, and safeguard your information when you use our app.
            </p>
            <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
            <ul className="list-disc pl-6 mb-4">
                <li>
                    <strong>Account Information:</strong> When you sign in with Google or GitHub, we collect your name,
                    email, and profile image.
                </li>
                <li>
                    <strong>Habit Data:</strong> We store your habits and completion data to provide the habit tracking
                    service.
                </li>
                <li>
                    <strong>Usage Data:</strong> We may collect anonymized usage data to improve our service.
                </li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4">
                <li>To provide and maintain the habit tracking service.</li>
                <li>To personalize your experience.</li>
                <li>To improve our app and user experience.</li>
                <li>To communicate with you about updates or issues.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">How We Protect Your Information</h2>
            <p className="mb-4">
                We use industry-standard security measures to protect your data. Your data is never sold or shared with
                third parties except as required by law.
            </p>
            <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights</h2>
            <p className="mb-4">
                You can request deletion of your account and data at any time by contacting us at <a
                href="mailto:support@jakub-urbanski.me" className="underline">support@jakub-urbanski.me</a>.
            </p>
            <h2 className="text-xl font-semibold mt-6 mb-2">Changes to This Policy</h2>
            <p className="mb-4">
                We may update this Privacy Policy from time to time. Changes will be posted on this page.
            </p>
            <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
            <p>
                If you have any questions about this Privacy Policy, contact us at <a
                href="mailto:support@jakub-urbanski.me" className="underline">support@jakub-urbanski.me</a>.
            </p>
        </div>
    );
}
