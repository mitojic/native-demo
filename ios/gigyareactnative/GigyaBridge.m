//
//  GigyaBridge.m
//  gigyareactnative
//
//  Created by Gheerish Bansooodeb on 7/25/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "GigyaBridge.h"
#import "AppDelegate.h"
#import <GigyaSDK/Gigya.h>
#import "UIViewController+Utils.h"

@implementation GigyaBridge
GSPluginView *pluginView;

RCT_EXPORT_MODULE();

// Gigya React Native custom events
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"AccountDidLogin", @"AccountDidLogout",@"PluginViewFiredEvent",@"PluginViewDidFailWithError"];
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

// Gigya Accounts Delegates
- (void)accountDidLogin:(GSAccount *)account{
  [self sendEventWithName:@"AccountDidLogin" body:account.JSONString];
  if(pluginView != nil){
    [pluginView removeFromSuperview];
  }
}

- (void)accountDidLogout{
  [self sendEventWithName:@"AccountDidLogout" body:@"AccountDidLogout"];
}

// Gigya React Native Bridge methods
RCT_EXPORT_METHOD(initBridge) {
  [Gigya setAccountsDelegate:self];
}

RCT_EXPORT_METHOD(login:(NSString *)loginId password:(NSString *)password callback:(RCTResponseSenderBlock)callback) {
  NSMutableDictionary *userAction = [NSMutableDictionary dictionary];
  [userAction setObject:loginId forKey:@"loginID"];
  [userAction setObject:password forKey:@"password"];

  GSRequest *request = [GSRequest requestForMethod:@"accounts.login" parameters:userAction];
  [request sendWithResponseHandler:^(GSResponse *response, NSError *error) {
    if (error) {
      callback(@[error.localizedDescription, [NSNull null]]);
    }
  }];
}

RCT_EXPORT_METHOD(socialLogin:(NSString *)provider callback:(RCTResponseSenderBlock)callback) {
   NSMutableDictionary *parameters = [NSMutableDictionary dictionary];
  [parameters setObject:@"saveProfileAndFail" forKey:@"x_conflictHandling"];

  [Gigya loginToProvider:provider
              parameters:parameters
                    over:[UIViewController currentViewController]
       completionHandler:^(GSUser *user, NSError *error) {

         if (error) {
           callback(@[error.localizedDescription, [NSNull null]]);
         }
       }
   ];
}

RCT_EXPORT_METHOD(isSessionValid:(RCTResponseSenderBlock)callback) {
  BOOL isValid = [Gigya isSessionValid];
  callback(@[[NSNull null], @(isValid)]);
}

RCT_EXPORT_METHOD(getAccountInfo:(RCTResponseSenderBlock)callback) {
  GSRequest *request = [GSRequest requestForMethod:@"accounts.getAccountInfo"];
  
  [request sendWithResponseHandler:^(GSResponse *response, NSError *error) {
    if (!error) {
      callback(@[[NSNull null], response.JSONString]);
    } else {
      callback(@[error.localizedDescription, [NSNull null]]);
    }
  }];
}

RCT_EXPORT_METHOD(setAccountInfo:(NSDictionary*)params callback:(RCTResponseSenderBlock)callback) {
  GSRequest *request = [GSRequest requestForMethod:@"accounts.setAccountInfo" parameters:params];
  [request sendWithResponseHandler:^(GSResponse *response, NSError *error) {
    if (!error) {
      callback(@[[NSNull null], response.JSONString]);
    } else {
      callback(@[error.localizedDescription, [NSNull null]]);
    }
  }];
}


RCT_EXPORT_METHOD(logout) {
  [Gigya logout];
}

//Gigya Plugin View support
RCT_EXPORT_METHOD(showScreenSet:(NSString *)screensetName parameters:(NSDictionary *)params callback:(RCTResponseSenderBlock)callback) {
  
  //Parse params
  NSNumber* x = [params objectForKey:@"x"];
  NSNumber* y = [params objectForKey:@"y"];
  NSNumber* w = [params objectForKey:@"w"];
  NSNumber* h = [params objectForKey:@"h"];
  
  NSDictionary* screenSetDictionaryFromReact = [params objectForKey:@"screenSetParams"];
  NSMutableDictionary *screenSetParams = [screenSetDictionaryFromReact mutableCopy];
  [screenSetParams setObject:screensetName forKey:@"screenSet"];

  UIView *currentView = [[[[UIApplication sharedApplication] keyWindow] subviews] lastObject].superview;
  CGRect region = CGRectMake([x intValue],[y intValue],[w intValue],[h intValue]);
  
  pluginView = [[GSPluginView alloc] initWithFrame:region];
  pluginView.delegate = self;
  pluginView.showLoginProgress = YES;
  [pluginView loadPlugin:@"accounts.screenSet" parameters:screenSetParams];
  
  [currentView addSubview:pluginView];
  
//  [Gigya showPluginDialogOver:[UIViewController currentViewController] plugin:@"accounts.screenSet" parameters:params
//            completionHandler:nil delegate:self];
  callback(@[@"Plugin loaded", [NSNull null]]);
}

//Plugin Delegates
- (void)pluginView:(GSPluginView *)pluginView2 firedEvent:(NSDictionary *)event
{
    NSLog(@"Plugin event from %@ - %@", pluginView2.plugin, [event objectForKey:@"eventName"]);
  
    //detect afterSubmit event of screenset - and close screen natively
    if([pluginView2.plugin  isEqual: @"accounts.screenSet"] &&  [[event objectForKey:@"eventName"]  isEqual: @"afterSubmit"]){
      [pluginView removeFromSuperview];
      pluginView = nil;
    }
  
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:event
                                                     options:NSJSONWritingPrettyPrinted
                                                       error:&error];
    if (! jsonData) {
      NSLog(@"Got an error: %@", error);
      [self sendEventWithName:@"PluginViewFiredEvent" body:error];
    } else {
      NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
      [self sendEventWithName:@"PluginViewFiredEvent" body:jsonString];
    }
}

- (void)pluginView:(GSPluginView *)pluginView finishedLoadingPluginWithEvent:(NSDictionary *)event
{
  NSLog(@"Finished loading plugin: %@", pluginView.plugin);
}

- (void)pluginView:(GSPluginView *)pluginView didFailWithError:(NSError *)error
{
  NSLog(@"Plugin error: %@", [error localizedDescription]);
  [self sendEventWithName:@"PluginViewFiredEvent" body:[error localizedDescription]];
  [pluginView removeFromSuperview];
}


@end
