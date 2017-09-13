package com.gigyareactnative;

import android.support.v4.app.FragmentTransaction;
import android.util.Log;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
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
import com.gigya.socialize.android.event.GSPluginListener;

import org.json.JSONException;
import org.json.JSONObject;
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
        callback.invoke(null, isValid);
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
    public void resetPassword(String emailAddress, final Callback callback) {
        GSObject params = new GSObject();
        params.put("loginID", emailAddress);
        params.put("email",emailAddress);

        GSResponseListener resListener = new GSResponseListener() {
            @Override
            public void onGSResponse(String method, GSResponse response, Object context) {
                try {
                    if (response.getErrorCode()!=0) {
                        callback.invoke(response.getErrorMessage());
                    } else {
                        callback.invoke(null, response.getData().toJsonString());
                    }
                }
                catch (Exception ex) {
                    callback.invoke(ex.getLocalizedMessage());
                }
            }
        };

        String methodName = "accounts.resetPassword";
        GSAPI.getInstance().sendRequest(methodName, params, resListener, null);
    }

    @ReactMethod
    public void registerFlow(final String firstName, final String lastName, final String email, final String password, final String tnc, final Callback callback) {
        GSResponseListener resListener = new GSResponseListener() {
            @Override
            public void onGSResponse(String method, GSResponse response, Object context) {
                try {
                    if (response.getErrorCode()==0) {
                        String regToken = response.getData().getString("regToken");

                        // Step 1 - Defining request parameters
                        GSObject params = new GSObject();
                        params.put("regToken", regToken);
                        params.put("email", email);
                        params.put("password", password);
                        params.put("finalizeRegistration", true);

                        GSObject profile = new GSObject();
                        profile.put("firstName", firstName);
                        profile.put("lastName", lastName);
                        params.put("profile", profile);

                        GSObject data = new GSObject();
                        data.put("terms", tnc);
                        params.put("data", data);

                        // Step 2 - Defining response listener. The response listener will handle the request's response.
                        GSResponseListener resListener = new GSResponseListener() {
                            @Override
                            public void onGSResponse(String method, GSResponse response, Object context) {
                                try {
                                    if (response.getErrorCode()==0) {
                                        callback.invoke(null, response.getData().toJsonString());
                                    } else {
                                        callback.invoke(response.getErrorMessage());
                                    }
                                }
                                catch (Exception ex) {  ex.printStackTrace();  }
                            }
                        };

                        // Step 3 - Sending the request
                        String methodName = "accounts.register";
                        GSAPI.getInstance().sendRequest(methodName, params, resListener, null);

                    } else {
                        callback.invoke(response.getErrorMessage());
                    }
                }
                catch (Exception ex) {  ex.printStackTrace();  }
            }
        };

        // Step 3 - Sending the request
        String methodName = "accounts.initRegistration";
        GSAPI.getInstance().sendRequest(methodName, null, resListener, null);
    }

    @ReactMethod
    public void getAccountInfo(final Callback callback){
        GSResponseListener resListener = new GSResponseListener() {
            @Override
            public void onGSResponse(String method, GSResponse response, Object context) {
                try {
                    if (response.getErrorCode()!=0) {
                        callback.invoke(response.getData().toJsonString());
                    } else {
                        callback.invoke(null, response.getData().toJsonString());
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
    public void showScreenSet(String screensetName, ReadableMap screensetParams, final Callback callback){
        GSObject params = new GSObject();

        Map<String,Object> reactMap = JsonConvert.reactToMap(screensetParams);
        Map<String,Object> screensetMap = (Map<String,Object>)reactMap.get("screenSetParams");

        for (Map.Entry<String, Object> entry : screensetMap.entrySet())
        {
            params.put("entry.getKey()", entry.getValue());
        }
        params.put("screenSet", screensetName);

        GSAPI.getInstance().showPluginDialog("accounts.screenSet", params, new GSPluginListener() {
            @Override
            public void onLoad(GSPluginFragment gsPluginFragment, GSObject gsObject) {
                callback.invoke(null, "Plugin loaded");
            }

            @Override
            public void onError(GSPluginFragment gsPluginFragment, GSObject error) {
                callback.invoke(error.toJsonString());
            }

            @Override
            public void onEvent(GSPluginFragment gsPluginFragment, GSObject gsObject) {
            }
        }, null);
    }

    @ReactMethod
    public void showComments(String categoryID, String streamID, ReadableMap dimensions, final Callback callback){
        GSObject params = new GSObject();
        params.put("categoryID", categoryID);
        params.put("streamID", streamID);
        params.put("version", 2);

        GSAPI.getInstance().showPluginDialog("comments.commentsUI", params, new GSPluginListener() {
            @Override
            public void onLoad(GSPluginFragment gsPluginFragment, GSObject gsObject) {
                callback.invoke(null, "Plugin loaded");
            }

            @Override
            public void onError(GSPluginFragment gsPluginFragment, GSObject error) {
                callback.invoke(error.toJsonString());
            }

            @Override
            public void onEvent(GSPluginFragment gsPluginFragment, GSObject gsObject) {
            }
        }, null);
    }

    @ReactMethod
    public void hidePluginView(){
    }
}