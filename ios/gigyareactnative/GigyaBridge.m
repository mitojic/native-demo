//
//  GigyaBridge.m
//  gigyareactnative
//
//  Created by Alejandro Perez on 7/25/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "GigyaBridge.h"
#import "AppDelegate.h"
#import <GigyaSDK/Gigya.h>

@implementation GigyaBridge
GSPluginView *pluginView;

RCT_EXPORT_MODULE();

// Gigya React Native custom events
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"AccountDidLogin", @"AccountDidLogout"];
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
  AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];

  NSMutableDictionary *parameters = [NSMutableDictionary dictionary];
  [parameters setObject:@"saveProfileAndFail" forKey:@"x_conflictHandling"];

  [Gigya loginToProvider:provider
              parameters:parameters
                    over:delegate.rootViewController
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

RCT_EXPORT_METHOD(logout) {
  [Gigya logout];
}

//Gigya Plugin View support

RCT_EXPORT_METHOD(showScreenSet:(NSString *)screensetName callback:(RCTResponseSenderBlock)callback) {
  AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  NSMutableDictionary *params = [NSMutableDictionary dictionary];
  [params setObject:screensetName forKey:@"screenSet"];
  
  UIView *rootView = delegate.rootViewController.view;
  CGRect region = CGRectMake(0, 0, rootView.frame.size.width, rootView.frame.size.height);
  
  pluginView = [[GSPluginView alloc] initWithFrame:region];
  pluginView.delegate = self;
  pluginView.showLoginProgress = YES;
  [pluginView loadPlugin:@"accounts.screenSet" parameters:params];
  
  [delegate.rootViewController.view addSubview:pluginView];
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
}

- (void)pluginView:(GSPluginView *)pluginView finishedLoadingPluginWithEvent:(NSDictionary *)event
{
  NSLog(@"Finished loading plugin: %@", pluginView.plugin);
}

- (void)pluginView:(GSPluginView *)pluginView didFailWithError:(NSError *)error
{
  NSLog(@"Plugin error: %@", [error localizedDescription]);
  [pluginView removeFromSuperview];
}


@end
