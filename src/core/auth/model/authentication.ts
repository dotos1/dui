

import { BasicAuth } from './basicAuth';
import { Oauth2 } from './oauth2';

export interface Authentication {
    basicAuth?: BasicAuth;
    oauth2?: Oauth2;
    cookie?: string;
    type?: string;
}

export interface User {
  id?: string;
  name?: string;
  email?: string;
  locale?: string;
  admin?: boolean;
}
