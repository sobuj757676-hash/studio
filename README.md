# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Setup

This project uses Firebase for authentication and database services. You will need to create a Firebase project and set up the environment variables.

1.  **Create a `.env.local` file** in the root of the project.

2.  **Add your Firebase configuration** to the `.env.local` file. You can find these values in your Firebase project settings.

    ```bash
    # Firebase client-side configuration
    NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_auth_domain"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
    NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"

    # Firebase server-side (admin) configuration
    FIREBASE_SERVICE_ACCOUNT_KEY='{"type": "service_account", "project_id": "your_project_id", "private_key_id": "your_private_key_id", "private_key": "your_private_key", "client_email": "your_client_email", "client_id": "your_client_id", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token", "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", "client_x509_cert_url": "your_client_x509_cert_url"}'
    ```

3.  **Enable Authentication:** In your Firebase project, enable the "Email/Password" sign-in provider.

4.  **Create an admin user:** Create a user in the Firebase Authentication console that you can use to log in to the admin panel.
