package io.zeechung.nnchat;

import android.os.Bundle;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 初始化 WebView
        WebView webView = getBridge().getWebView();

        // 注入 JavaScript 代码
        webView.post(() -> {
            webView.evaluateJavascript(
                    """
                        window["nnchat"] = {originalFetch: undefined, capacitorFetch:undefined, useNativeOrCapacitorHTTP: undefined};
                        
                        window.nnchat.useNativeOrCapacitorHTTP = (url) => {
                            const whiteList = [
                                "api.deepseek.com/v1",
                                "platform.moonshot.cn/console/api-keys",
                                "qianfan.baidubce.com/v2",
                                "dashscope.aliyuncs.com/compatible-mode/v1"
                            ]
                            for(let whiteUrl of whiteList){
                                if(url.includes(whiteUrl)) return true;
                            }
                            return false;
                        }
                        
                        window.nnchat.originalFetch = window.fetch;
                        window.fetch = null;
                        function cb() {
                            if(window.fetch == null) {
                                setTimeout(cb, 100);
                            }
                            window.nnchat.capacitorFetch = window.fetch;
                            window.fetch = function(input, init) {
                                const url = typeof input === 'string' ? input : input.url;
                                if (window.nnchat.useNativeOrCapacitorHTTP(url)){
                                    const polyfilledFetch = window.fetch
                                    try{
                                        window.fetch = window.nnchat.originalFetch
                                        const resp = window.fetch(input, init)
                                        window.fetch = polyfilledFetch
                                        return resp
                                    }catch{
                                        window.fetch = polyfilledFetch
                                    }
                                }else{
                                    return window.nnchat.capacitorFetch(input, init)
                                }
                            };
                        };
                        cb();
                    """,
                    null
            );
        });
    }
}
