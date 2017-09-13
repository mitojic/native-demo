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
GSPluginView *pluginView, *commentView;
bool pluginShowing;

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

RCT_EXPORT_METHOD(resetPassword:(NSString *)emailAddress callback:(RCTResponseSenderBlock)callback) {
  NSMutableDictionary *userAction = [NSMutableDictionary dictionary];
  [userAction setObject:emailAddress forKey:@"loginID"];
  [userAction setObject:emailAddress forKey:@"email"];
  
  GSRequest *request = [GSRequest requestForMethod:@"accounts.resetPassword" parameters:userAction];
  [request sendWithResponseHandler:^(GSResponse *response, NSError *error) {
    if (!error) {
      callback(@[[NSNull null], response.JSONString]);
    } else {
      callback(@[error.localizedDescription, [NSNull null]]);
    }
  }];
}

RCT_EXPORT_METHOD(registerFlow:(NSString *)firstName lastName:(NSString *)lastName email:(NSString *)email password:(NSString *)password tnc:(NSString *)tnc callback:(RCTResponseSenderBlock)callback) {
  GSRequest *request = [GSRequest requestForMethod:@"accounts.initRegistration" parameters:nil];
  [request sendWithResponseHandler:^(GSResponse *response, NSError *error) {
    if (!error) {
      NSString *regToken = response[@"regToken"];

      NSMutableDictionary *userAction = [NSMutableDictionary dictionary];
      [userAction setObject:email forKey:@"email"];
      [userAction setObject:password forKey:@"password"];
      [userAction setObject:regToken forKey:@"regToken"];
      
      
      GSRequest *request = [GSRequest requestForMethod:@"accounts.register" parameters:userAction];
      [request sendWithResponseHandler:^(GSResponse *response, NSError *error) {
        if (error.code == GSErrorAccountPendingRegistration) {
          
          //Get new regToken from response as an error was thrown
          NSString *regToken2 = response[@"regToken"];
          
          NSString *profileData = [NSString stringWithFormat: @"{ 'firstName' : '%@' , 'lastName' : '%@' }", firstName, lastName];
          NSString *dataData = [NSString stringWithFormat: @"{ 'terms' : '%@' }", tnc] ;
          
          NSMutableDictionary *userAction2 = [NSMutableDictionary dictionary];
          [userAction2 setObject:profileData forKey:@"profile"];
          [userAction2 setObject:dataData forKey:@"data"];
          [userAction2 setObject:regToken2 forKey:@"regToken"];
          
          GSRequest *request = [GSRequest requestForMethod:@"accounts.setAccountInfo" parameters:userAction2];
          [request sendWithResponseHandler:^(GSResponse *response, NSError *error) {
            if (!error) {
              
              NSMutableDictionary *userAction3 = [NSMutableDictionary dictionary];
              [userAction3 setObject:regToken2 forKey:@"regToken"];
              
              GSRequest *request = [GSRequest requestForMethod:@"accounts.finalizeRegistration" parameters:userAction3];
              [request sendWithResponseHandler:^(GSResponse *response, NSError *error) {
                if (!error) {
                  
                  //Login the user
                  NSMutableDictionary *userAction4 = [NSMutableDictionary dictionary];
                  [userAction4 setObject:email forKey:@"loginID"];
                  [userAction4 setObject:password forKey:@"password"];
                  
                  GSRequest *request = [GSRequest requestForMethod:@"accounts.login" parameters:userAction4];
                  [request sendWithResponseHandler:^(GSResponse *response, NSError *error) {
                    if (error) {
                      callback(@[error.localizedDescription, [NSNull null]]);
                    }
                  }];
                }
                else {
                  callback(@[error.localizedDescription, [NSNull null]]);
                }
              }];
            }
            else {
              callback(@[error.localizedDescription, [NSNull null]]);
            }
          }];
        }
        else {
          callback(@[error.localizedDescription, [NSNull null]]);
        }
      }];
    }
    else {
      callback(@[error.localizedDescription, [NSNull null]]);
    }
  }];
}

RCT_EXPORT_METHOD(showComments:(NSString *)categoryID streamID:(NSString *)streamID dimensions:(NSDictionary *)dimensions callback:(RCTResponseSenderBlock)callback) {
    
    //Parse params
    NSNumber* x = [dimensions objectForKey:@"x"];
    NSNumber* y = [dimensions objectForKey:@"y"];
    NSNumber* w = [dimensions objectForKey:@"w"];
    NSNumber* h = [dimensions objectForKey:@"h"];

    UIView *currentView = [[[[UIApplication sharedApplication] keyWindow] subviews] lastObject].superview;
    CGRect region = CGRectMake([x intValue],[y intValue],[w intValue],[h intValue]);
  
    NSInteger version = 2;
    NSMutableDictionary *pluginParams = [NSMutableDictionary dictionary];
    [pluginParams setObject:categoryID forKey:@"categoryID"];
    [pluginParams setObject:streamID forKey:@"streamID"];
    [pluginParams setObject:[NSNumber numberWithInteger:version] forKey:@"version"];
    pluginView = [[GSPluginView alloc] initWithFrame:region];
    pluginView.delegate = self;
    [pluginView loadPlugin:@"comments.commentsUI" parameters:pluginParams];
  
    [currentView addSubview:pluginView];
    pluginShowing = YES;
    callback(@[[NSNull null], @"Plugin loaded"]);
}

RCT_EXPORT_METHOD(hidePluginView) {
  if(pluginShowing){
    [pluginView removeFromSuperview];
  }
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
  callback(@[[NSNull null], @"Plugin loaded"]);
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
