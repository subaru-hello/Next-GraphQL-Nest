import { PbEnv } from '../../config/environments/pb-env.service';
import { PrismaService } from './../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { PostModel } from './interfaces/post.model';
import { GetPostsArgs } from './interfaces/get-posts-connection.args';
@Resolver((of) => PostModel)
export class PostsResolver {
  constructor(
    private configService: ConfigService,
    private pbEnv: PbEnv,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => [PostModel], { name: 'testPosts', nullable: true })
  async getFixedPosts() {
    return [
      {
        id: '1',
        title: 'NestJS is so good.',
      },
      {
        id: '2',
        title: 'GraphQL is so good.',
      },
    ];
  }

  @Query(() => [PostModel], { name: 'posts', nullable: true })
  async getPosts(@Args() args: GetPostsArgs) {
    return this.prisma.post.findMany({
      where: {
        type: args.type
          ? {
              in: args.type,
            }
          : undefined,
        published: true,
      },
      orderBy: {
        publishDate: 'desc',
      },
    });
  }

  @Query(() => String)
  testConfiguration(): any {
    const nodeEnv = this.configService.get<string>('NODE_ENV'); // development （.env.development.localのもの）
    const databaseUrl = this.configService.get<string>('DATABASW_URL');
    const microCmsKey = this.configService.get<string>('MICRO_CMS_KEY');
    return databaseUrl || nodeEnv || microCmsKey || '何にも入ってない';
  }

  @Query(() => Number)
  testPort(): number {
    return this.configService.get<number>('PORT'); // 3333 (number型になります)
  }

  @Query(() => String)
  databaseUrl(): string {
    return this.pbEnv.DatabaseUrl; // かなり直感的
  }

  @Query(() => [PostModel], { name: 'prismaPosts', nullable: true })
  async getPostsByPrisma() {
    return this.prisma.post.findMany();
  }
}
