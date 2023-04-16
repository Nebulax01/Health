import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import jwt from 'jsonwebtoken';

@Injectable()
export class CustomTokenAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
   
    try {
      // Verify the custom token
      const customToken = req.headers['authorization'];
      console.log(customToken);
      console.log(req.headers);
      jwt.verify(customToken, 'at-secret');
      
      // The custom token is valid
      return true;
    } catch (e) {
      console.log("not valid");
      // The custom token is not valid
      return false;
    }
  }
}
