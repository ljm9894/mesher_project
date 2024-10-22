import { BadRequestException, ValidationPipe } from '@nestjs/common';

export const ValidationPipeSetting = new ValidationPipe({
  exceptionFactory: (error) => {
    return new BadRequestException(
      error.map((error) => ({
        property: error.property,
        message: error.constraints,
      })),
    );
  },
  stopAtFirstError: false, // 첫 번째 오류 발견시 즉시 정지 여부
  whitelist: true, //DTO에 정의 되지 않은 속성 무시 여부
  forbidNonWhitelisted: true, //DTO에 정의되지 않은 속성 있는지 확인
  transform: true, //받은 데이터 dto 형식으로 변환 여부
});
