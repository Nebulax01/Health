import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { UserRole } from "@prisma/client";
import {ExtractJwt, Strategy} from 'passport-jwt';
//a JWT token contains 3 parts : header, payload and signature
//payload : contains relevant user data such as id which is encoded(base64 to format data to a convenient one for it to be easily parsed and passed through the server)
//so the JWT is basically a way to encapsulate relevant user data and move it around the app in a secure manner 
//header contains 2 fields : type (in this cases JWT) and alg(hashing algo used)
//signature part = paylaod + header hashed together produce a signature
//server would remove the encoding on the header and payload and then use the hashing algo on them and compare the result to the signature



type JwtPayload = {
    sub: string;
  
    email : string;
}




//passport is authentification library of nestjs
//a strategy is a specific implementation of authorization
//here we define a custom strat that extendes PassportStrategy, and indicates how we retrieve JWT tokens from HTTP auth header
@Injectable()
export class atStrat extends PassportStrategy(Strategy, 'jwt'){
    constructor(){
        super({
            //extract jwt token from http auth header
           jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
           //indicate the key used for signing jwt tokens
           secretOrKey: 'at-secret',

        })
        }
    
    validate(payload: JwtPayload){
        console.log(payload);
        return payload;
    }
}

// Overall, this code sets up a basic access token strategy using Passport and passport-jwt. 
// It extracts the JWT from the Authorization header and verifies its signature using a hardcoded secret key.
//  When the JWT is successfully verified, the entire decoded payload is returned as the user object.