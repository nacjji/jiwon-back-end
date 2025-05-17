import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'apps/libs/exceptions/http.exception';
import { ResponseInterceptor } from 'apps/libs/common/interceptors/response.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역 유효성 검사 파이프
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 응답 인터셉터
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

  // 예외 필터
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('swagger')
    .setDescription('API 문서')
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

  await app.listen(process.env.HTTP_PORT || 3000);
}
bootstrap();
