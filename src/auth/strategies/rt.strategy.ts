import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt';
import { Injectable} from "@nestjs/common";
import {Request} from 'express';
//passport is authentification library of nestjs
//a strategy is a specific implementation of authorization
//here we define a custom strat that extendes PassportStrategy, and indicates how we retrieve JWT tokens from HTTP auth header
@Injectable()
export class rtStrat extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(){
        super({
            //extract jwt token from http auth header
           jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
           //indicate key used for signing refresh tokens
           secretOrKey: 'rt-secret',
           //enable the strategy to receive the request object as an argument in the validate function.
           passReqToCallback: true,

        });
      

        }
    // validate method is passed req body and the payload (if and only if the verfication process was successful( signature wasn't tampered with))
    validate(req: Request, payload: any){
        //extract refresh token from auth header
        const refreshToken = req.get('authorization').replace('Bearer', '').trim();
        return {...payload,
            refreshToken,
    };
}
}

