package com.factory.mouthpiece

import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.webkit.WebViewAssetLoader

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    FactoryWebView()
                }
            }
        }
    }
}

@Composable
fun FactoryWebView() {
    AndroidView(
        factory = { context ->
            val assetLoader = WebViewAssetLoader.Builder()
                .setDomain("appassets.androidplatform.net")
                .addPathHandler("/", WebViewAssetLoader.AssetsPathHandler(context))
                .build()

            WebView(context).apply {
                settings.apply {
                    javaScriptEnabled = true
                    domStorageEnabled = true
                    databaseEnabled = true
                    allowFileAccess = true
                    allowContentAccess = true
                    @Suppress("DEPRECATION")
                    allowFileAccessFromFileURLs = true
                    @Suppress("DEPRECATION")
                    allowUniversalAccessFromFileURLs = true
                    loadWithOverviewMode = true
                    useWideViewPort = true
                    mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                    mediaPlaybackRequiresUserGesture = false
                }
                webChromeClient = android.webkit.WebChromeClient()
                webViewClient = object : WebViewClient() {
                    override fun shouldInterceptRequest(
                        view: WebView,
                        request: WebResourceRequest
                    ): WebResourceResponse? {
                        val response = assetLoader.shouldInterceptRequest(request.url)
                        if (response != null) {
                            val headers = HashMap(response.responseHeaders ?: emptyMap())
                            headers["Access-Control-Allow-Origin"] = "*"
                            headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
                            headers["Access-Control-Allow-Headers"] = "*"
                            return WebResourceResponse(
                                response.mimeType,
                                response.encoding,
                                response.statusCode,
                                response.reasonPhrase,
                                headers,
                                response.data
                            )
                        }
                        return null
                    }

                    override fun onReceivedError(
                        view: WebView?,
                        errorCode: Int,
                        description: String?,
                        failingUrl: String?
                    ) {
                        super.onReceivedError(view, errorCode, description, failingUrl)
                        // Fallback to direct file loading if domain loader fails
                        if (failingUrl?.contains("appassets.androidplatform.net") == true) {
                            view?.loadUrl("file:///android_asset/index.html")
                        }
                    }
                }
                loadUrl("https://appassets.androidplatform.net/index.html")
            }
        },
        modifier = Modifier.fillMaxSize()
    )
}




