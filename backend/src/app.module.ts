import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {BillsModule} from "./bills/bills.module";
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                uri: config.get<string>('MONGO_URI'),
            }),
        }),
        BillsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}