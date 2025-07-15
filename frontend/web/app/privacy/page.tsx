export default function PrivacyPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        At HandyWriterz, we are committed to protecting your privacy. This policy
        outlines how we handle your personal data and documents.
      </p>
      <h2 className="text-2xl font-bold mb-2">Data We Collect</h2>
      <ul className="list-disc pl-5 mb-4">
        <li>
          **Account Information:** When you create an account, we collect your
          wallet address and may ask for an email address for communication.
        </li>
        <li>
          **Writing Fingerprints:** We analyze your writing to create a
          "fingerprint" of your style. This data is used to generate content
          that matches your voice and is not shared with third parties.
        </li>
        <li>
          **Documents:** You have full control over the privacy of your
          documents. You can choose to make them public or private.
        </li>
      </ul>
      <h2 className="text-2xl font-bold mb-2">Data Storage and Deletion</h2>
      <p className="mb-4">
        **Private Documents:** If you mark a document as private, it will be
        stored in a separate, secure vector space and will only be accessible
        to you. We will automatically delete private documents that have not
        been accessed for more than 90 days.
      </p>
      <p>
        **Public Documents:** Public documents may be used to improve our
        services, but we will never share your personal information without
        your consent.
      </p>
    </div>
  );
}