import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const PORT = 3000;
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
