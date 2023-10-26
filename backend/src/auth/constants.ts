import { SetMetadata } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const configService = new ConfigService();

export const client_url = "http://" + configService.get('SERVER_HOST') + ":" + configService.get('CLIENT_PORT');
export const server_url = "http://" + configService.get('SERVER_HOST') + ":" + configService.get('SERVER_PORT');

export const jwtConstants = {
	secret: configService.get('JWT_SECRET'),
	two_factor_secret: configService.get('JWT_2FASECRET'),
	expire: configService.get('JWT_EXPIRE'),
};

export const ftConstants = {
	uid: configService.get('42_UID'),
	secret: configService.get('42_SECRET'),
	link: configService.get('42_LINK'),
	redirect_uri: 'http://' + configService.get('SERVER_HOST') + ':' + configService.get('SERVER_PORT') + '/auth/login',
}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
