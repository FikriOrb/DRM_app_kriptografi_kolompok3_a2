# Android DRM WebView Wrapper

This folder contains the native wrapper source needed for TASK 4.

Required Gradle dependencies:

```gradle
implementation "androidx.appcompat:appcompat:1.7.0"
implementation "androidx.security:security-crypto:1.1.0-alpha06"
```

Set the WebView URL in `AndroidManifest.xml` metadata key `react_app_url`.
Use `http://10.0.2.2/...` for an Android emulator that talks to XAMPP on the host PC.

Release builds should keep WebView debugging disabled and should use HTTPS outside local development.
