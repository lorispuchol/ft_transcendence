import { SetMetadata } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const configService = new ConfigService();

export const jwtConstants = {
	secret: configService.get('JWT_SECRET'),
	expire: configService.get('JWT_EXPIRE'),
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
