import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FacebookAuthGuard extends AuthGuard('facebook') {}
