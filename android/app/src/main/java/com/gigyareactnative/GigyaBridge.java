package com.gigyareactnative;

import android.support.v4.app.FragmentTransaction;
import android.util.Log;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.module.annotations.ReactModule;

import com.gigya.socialize.GSKeyNotFoundException;
import com.gigya.socialize.GSObject;
import com.gigya.socialize.GSResponse;
import com.gigya.socialize.GSResponseListener;
import com.gigya.socialize.android.GSAPI;
import com.gigya.socialize.android.event.GSAccountsEventListener;
import com.gigya.socialize.android.GSPluginFragment;

import java.util.Map;

/**
 * Created by gheerish bansoodeb on 16/08/2017.
 */

public class GigyaBridge extends ReactContextBaseJavaModule {

    ReactApplicationContext thisReactContext;

    public GigyaBridge(ReactApplicationContext reactContext) {
        super(reactContext);
        thisReactContext = reactContext;
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable String params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @Override
    public String getName() {
        return "GigyaBridge";
    }

    @ReactMethod
    public void initBridge() {
        GSAPI.getInstance().setAccountsEventListener(new GSAccountsEventListener() {
            @Override
            public void onLogin(GSObject user, Object context) {
                sendEvent(thisReactContext, "AccountDidLogin", user.toJsonString());
            }

            @Override
            public void onLogout(Object context) {
                sendEvent(thisReactContext, "AccountDidLogout", "AccountDidLogout");
            }
        });
    }

    @ReactMethod
    public void isSessionValid(Callback callback) {
        boolean isValid = false;

        if(GSAPI.getInstance().getSession() != null){
            isValid = GSAPI.getInstance().getSession().isValid();
        }
        callback.invoke(isValid);
    }

    @ReactMethod
    public void login(String loginId, String password, final Callback callback){
        GSObject params = new GSObject();
        params.put("loginID", loginId);
        params.put("password",password);

        GSResponseListener resListener = new GSResponseListener() {
            @Override
            public void onGSResponse(String method, GSResponse response, Object context) {
                try {
                    if (response.getErrorCode()!=0) {
                        callback.invoke(response.getErrorMessage());
                    }
                }
                catch (Exception ex) {
                    callback.invoke(ex.getLocalizedMessage());
                }
            }
        };

        String methodName = "accounts.login";
        GSAPI.getInstance().sendRequest(methodName, params, resListener, null);
    }

    @ReactMethod
    public void getAccountInfo(final Callback callback){
        GSResponseListener resListener = new GSResponseListener() {
            @Override
            public void onGSResponse(String method, GSResponse response, Object context) {
                try {
                    if (response.getErrorCode()!=0) {
                        callback.invoke(response.getData().toJsonString());
                    }
                }
                catch (Exception ex) {
                    callback.invoke(ex.getLocalizedMessage());
                }
            }
        };

        String methodName = "accounts.getAccountInfo";
        GSAPI.getInstance().sendRequest(methodName, null, resListener, null);
    }

    @ReactMethod
    public void socialLogin(String provider, final Callback callback){
        GSObject params = new GSObject();
        params.put("provider", provider);

        GSResponseListener resListener = new GSResponseListener() {
            @Override
            public void onGSResponse(String method, GSResponse response, Object context) {
                try {
                    if (response.getErrorCode()!=0) {
                        callback.invoke(response.getData().toJsonString());
                    }
                }
                catch (Exception ex) {
                    callback.invoke(ex.getLocalizedMessage());
                }
            }
        };

        try {
        GSAPI.getInstance().login(thisReactContext.getCurrentActivity(), params, resListener , false, null);
        }
        catch (Exception ex) {
            callback.invoke(ex.getLocalizedMessage());
        }
    }

    @ReactMethod
    public void logout(){
        GSAPI.getInstance().logout();
    }

    @ReactMethod
    public void showScreenSet(String screensetName, Callback callback){
        GSObject params = new GSObject();
        params.put("screenSet", screensetName);

        GSAPI.getInstance().showPluginDialog("accounts.screenSet", params, null, null);

    }
}