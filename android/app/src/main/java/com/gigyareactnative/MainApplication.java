package com.gigyareactnative;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.gigya.socialize.android.GSAPI;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
              new GigyaBridgePackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    GSAPI.getInstance().initialize(this, "3_n6HDyxNJWZ9C6j1JcQrexeRptHoiCayyzLQ0pXGd05WwXoYNaZAC83wQ2F7kCLWN", "eu1.gigya.com");

    SoLoader.init(this, /* native exopackage */ false);
  }
}
