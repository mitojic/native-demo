package com.gigyareactnative;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.gigya.socialize.android.GSAPI;

import java.util.Arrays;
import java.util.List;

import com.facebook.FacebookSdk;

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
            new VectorIconsPackage(),
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

    GSAPI.getInstance().initialize(this, "3_L7xm_by92yHMggImKfw4wjX5znV51SSSZ8am6bj7HZGRYUilfMfshATkdBma_wxR", "au1.gigya.com");

    SoLoader.init(this, /* native exopackage */ false);
  }
}
