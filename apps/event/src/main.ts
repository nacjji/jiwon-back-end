import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from 'apps/libs/common/interceptors/response.interceptor';
import { HttpExceptionFilter } from 'apps/libs/exceptions/http.exception';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 응답 인터셉터
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

  // 예외 필터
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Event Server SWAGGER')
    .setDescription('Event Server API 문서')
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

  await app.listen(process.env.HTTP_PORT ?? 3002);
}

bootstrap();
