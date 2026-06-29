import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1782368129646_8110',
  koa: {
    port: 7001,
  },
  // TypeORM 数据库配置
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: '192.168.122.145',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'wudong_platform',
        charset: 'utf8mb4',
        timezone: '+08:00',
        synchronize: false,
        logging: true,
        entities: ['**/entity/*.entity{.ts,.js}'],
        connectTimeout: 60000,
        acquireTimeout: 60000,
        extra: {
          charset: 'utf8mb4',
          connectionLimit: 10,
          timezone: '+08:00',
        },
      },
    },
  },
  // JWT 配置
  jwt: {
    secret: 'wudong-secret-key-2026',
    expiresIn: '7d',
  },
} as MidwayConfig;
