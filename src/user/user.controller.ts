import { Controller } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(@inject(AuthUtil) private authUtil: AuthUtil,
              @inject(QueryUtil) private queryUtil: QueryUtil,
              @inject(FavouriteService) private favouriteService: FavouriteService,
              @inject(CheckoutService) private checkoutService: CheckoutService,
              @inject(ConsultationSessionService) private consultationSessionService: ConsultationSessionService,
              @inject(UserService) private userService: UserService) {
    this.initialize();
  }

  initialize(): void {
    this.logInUser();
    this.setConcern();
    this.getFavouritesAndCheckoutCount();
    this.mergeAccount();
  }

  logInUser(): void {
    this.authUtil.unauthenticatedCloudFunction('logInUser', async (req: Parse.Cloud.FunctionRequest) => {
      try {
        const { signupSource } = req.params;
        let { authData } = req.params;
        if (typeof authData === 'string') { authData = JSON.parse(authData); }
        const user = await this.userService.findOrCreateNewUserIfNotExistingUser(req.params) as Parse.User;
        if (!user._isLinked(signupSource)) {
          await user.linkWith(
            signupSource,
            { authData },
            { useMasterKey: true });
        }
        const loggedInUser = await Parse.User.logInWith(
          signupSource,
          { authData },
          { useMasterKey: true });
        return { sessionToken: loggedInUser.getSessionToken() };
      } catch (error) {
        SentryUtil.captureException(error);
        await Promise.reject(error);
      }
      return { status: 'failed', message: 'something went wrong while generating sessionToken' };
    });
  }

  setConcern(): void {
    this.authUtil.authenticatedCloudFunction('setConcern', async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
      let result: { [key: string]: any };
      try {
        if (!req.params.concernId) {
          await Promise.reject(new Error('Missing required params: concernId'));
        }
        const { user } = req;
        let _user = await this.queryUtil.fetchObject(user, 'username', option);
        _user = await this.userService.setConcern(req.params.concernId, _user, option);
        result = await this.consultationSessionService.startConsultationSession(req.params.concernId, _user, option);
      } catch (error) {
        SentryUtil.captureException(error);
        await Promise.reject(error);
      }
      return result;
    });
  }

  getFavouritesAndCheckoutCount(): void {
    this.authUtil.authenticatedCloudFunction('getFavouritesAndCheckoutCount',
      async (req: Parse.Cloud.FunctionRequest, option: Parse.FullOptions) => {
        try {
          const favoritesCount = await this.favouriteService.getFavouritesCount(req.user, option);
          const lineItemsCount = await this.checkoutService.getLineItemsCount(req.user, option);
          return { favoritesCount, lineItemsCount };
        } catch (error) {
          SentryUtil.captureException(error);
          await Promise.reject(error);
        }
        return undefined;
      });
  }

  mergeAccount(): any {
    this.authUtil.authenticatedCloudFunction('mergeAccount',
      async (req: Parse.Cloud.FunctionRequest) => {
        try {
          const result = await this.userService.moveDataFromOldUserToNewUser(req.params.oldUserId, req.params.newUserId);
          return result;
        } catch (error) {
          SentryUtil.captureException(error);
          await Promise.reject(error);
        }
        return undefined;
      });
  }
}