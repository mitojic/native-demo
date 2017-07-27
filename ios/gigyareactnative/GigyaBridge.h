//
//  GigyaBridge.h
//  gigyareactnative
//
//  Created by Alejandro Perez on 7/25/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <GigyaSDK/Gigya.h>

@interface GigyaBridge : RCTEventEmitter <RCTBridgeModule,GSAccountsDelegate,GSPluginViewDelegate>
@end
