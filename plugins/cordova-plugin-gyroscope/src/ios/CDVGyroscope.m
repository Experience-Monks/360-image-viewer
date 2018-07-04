
#import <CoreMotion/CoreMotion.h>
#import "CDVGyroscope.h"

@interface CDVGyroscope () {}
@property (readwrite, assign) BOOL isRunning;
@property (readwrite, assign) BOOL haveReturnedResult;
@property (readwrite, strong) CMMotionManager* motionManager;
@property (readwrite, assign) double x;
@property (readwrite, assign) double y;
@property (readwrite, assign) double z;
@property (readwrite, assign) NSTimeInterval timestamp;
@end

@implementation CDVGyroscope

@synthesize callbackId, isRunning, x, y, z, timestamp;

// defaults to 10 msec
#define kAccelerometerInterval 10

- (CDVGyroscope*)init
{
    self = [super init];
    if (self) {
        self.x = 0;
        self.y = 0;
        self.z = 0;
        self.timestamp = 0;
        self.callbackId = nil;
        self.isRunning = NO;
        self.haveReturnedResult = YES;
        self.motionManager = nil;
    }
    return self;
}

- (void)dealloc
{
    [self stop:nil];
}

- (void)start:(CDVInvokedUrlCommand*)command
{
    self.haveReturnedResult = NO;
    self.callbackId = command.callbackId;

    if (!self.motionManager)
    {
        self.motionManager = [[CMMotionManager alloc] init];
    }

    if ([self.motionManager isGyroAvailable] == YES) {
        // Assign the update interval to the motion manager and start updates
        [self.motionManager setGyroUpdateInterval:kAccelerometerInterval/1000];
        __weak CDVGyroscope* weakSelf = self;
        [self.motionManager startGyroUpdatesToQueue:[NSOperationQueue mainQueue] withHandler:^(CMGyroData *gyroData, NSError *error) {
            weakSelf.x = gyroData.rotationRate.x;
            weakSelf.y = gyroData.rotationRate.y;
            weakSelf.z = gyroData.rotationRate.z;
            weakSelf.timestamp = ([[NSDate date] timeIntervalSince1970] * 1000);
            [weakSelf returnGyroInfo];
        }];

        if (!self.isRunning) {
            self.isRunning = YES;
        }
    } else {

        NSLog(@"Running in Simulator? All gyro tests will fail.");
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_INVALID_ACTION messageAsString:@"Error. Gyroscope Not Available."];

        [self.commandDelegate sendPluginResult:result callbackId:self.callbackId];
    }

}

- (void)onReset
{
    [self stop:nil];
}

- (void)stop:(CDVInvokedUrlCommand*)command
{
    if ([self.motionManager isGyroAvailable] == YES) {
        if (self.haveReturnedResult == NO) {
            // block has not fired before stop was called, return whatever result we currently have
            [self returnGyroInfo];
        }
        [self.motionManager stopGyroUpdates];
    }
    self.isRunning = NO;
}

- (void)returnGyroInfo
{
    // Create an orientation object
    NSMutableDictionary* orientationProps = [NSMutableDictionary dictionaryWithCapacity:4];

    [orientationProps setValue:[NSNumber numberWithDouble:x] forKey:@"x"];
    [orientationProps setValue:[NSNumber numberWithDouble:y] forKey:@"y"];
    [orientationProps setValue:[NSNumber numberWithDouble:z] forKey:@"z"];
    [orientationProps setValue:[NSNumber numberWithDouble:timestamp] forKey:@"timestamp"];

    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:orientationProps];
    [result setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:result callbackId:self.callbackId];
    self.haveReturnedResult = YES;
}

@end
