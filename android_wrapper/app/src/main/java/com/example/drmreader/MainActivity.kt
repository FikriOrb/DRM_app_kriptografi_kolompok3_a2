package com.example.drmreader

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.WindowManager
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        window.setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        )

        webView = WebView(this)
        setContentView(webView)

        WebView.setWebContentsDebuggingEnabled(false)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = false
            allowFileAccess = false
            allowContentAccess = false
            cacheMode = WebSettings.LOAD_DEFAULT
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
        }

        val appUrl = appUrl()
        val trustedHost = android.net.Uri.parse(appUrl).host

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView,
                request: WebResourceRequest
            ): Boolean {
                return request.url.host != trustedHost
            }
        }

        webView.addJavascriptInterface(AndroidDRMBridge(this), "AndroidDRM")
        webView.loadUrl(appUrl)
    }

    override fun onBackPressed() {
        if (::webView.isInitialized && webView.canGoBack()) {
            webView.goBack()
            return
        }
        super.onBackPressed()
    }

    private fun appUrl(): String {
        val info = packageManager.getActivityInfo(componentName, android.content.pm.PackageManager.GET_META_DATA)
        return info.metaData?.getString("react_app_url") ?: "http://10.0.2.2/model_aplikasi/"
    }
}
