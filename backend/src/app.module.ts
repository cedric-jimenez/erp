import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ItemsModule } from './modules/items/items.module';
import { QuotesModule } from './modules/quotes/quotes.module';

@Module({
  imports: [PrismaModule, ItemsModule, QuotesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
