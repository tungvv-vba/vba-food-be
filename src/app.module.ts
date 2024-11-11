import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { OrderModule } from "./order/order.module";
import { MenuImageModule } from "./menu-image/menu-image.module";
import { AuthModule } from "./auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user/entities/user.entity";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./guards/auth.guard";
import { OrderEntity } from "./order/entities/order.entity";
import { MenuImageEntity } from "./menu-image/entities/menu-image.entity";
import { NotifyModule } from "./notify/notify.module";
import { BotTeleModule } from "./bot_tele/bot_tele.module";
import { GlobalExceptionFilter } from "./shared/filter/global-exception.filter";
import { RolesGuard } from "./guards/roles.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [UserEntity, OrderEntity, MenuImageEntity],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRES_IN },
    }),
    UserModule,
    OrderModule,
    MenuImageModule,
    AuthModule,
    NotifyModule,
    BotTeleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
