import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { rpcFilter } from 'apps/libs/common/filters/rpc.filter';
import { ResponseInterceptor } from 'apps/libs/common/interceptors/response.interceptor';
import { HttpExceptionFilter } from 'apps/libs/exceptions/http.exception';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const authClient = app.get('AUTH_SERVICE');

  await authClient.connect();

  // 응답 인터셉터
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

  // 예외 필터
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new rpcFilter());

  const config = new DocumentBuilder()
    .setTitle('Gateway Server SWAGGER')
    .setDescription('Gateway Server API 문서')
    .setVersion('1.0.0')
    // swagger 토큰 헤더 인증 추가
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'access-token',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.init();

  await app.listen(+process.env.HTTP_PORT);
}
bootstrap();
