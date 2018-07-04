
#import <UIKit/UIKit.h>
#import <Cordova/CDVPlugin.h>

@interface CDVGyroscope : CDVPlugin
{
    double x;
    double y;
    double z;
    NSTimeInterval timestamp;
}

@property (readonly, assign) BOOL isRunning;
@property (nonatomic, strong) NSString* callbackId;

- (CDVGyroscope*)init;

- (void)start:(CDVInvokedUrlCommand*)command;
- (void)stop:(CDVInvokedUrlCommand*)command;

@end
