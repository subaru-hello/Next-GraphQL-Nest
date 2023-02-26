import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './components/posts/posts.module';
import { PbEnvModule } from './config/environments/pb-env.module';
import { PbEnv } from '@pb-config/environments/pb-env.service';

@Module({
  imports: [
		PbEnvModule,
    GraphQLModule.forRootAsync({
      inject: [PbEnv],
       useFactory: (env: PbEnv) => env.GqlModuleOptionsFactory,
     }),
    // オプション設定はGqlModuleOptionsFactoryに任せた
    // GraphQLModule.forRoot({
    //   autoSchemaFile: path.join(
    //     process.cwd(),
    //     'src/generated/graphql/schema.gql',
    //   ),
    //   sortSchema: true,
    // }),
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
