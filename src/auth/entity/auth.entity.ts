//src/auth/entity/auth.entity.ts
import { ApiProperty } from '@nestjs/swagger';

export class Auth {
  @ApiProperty()
  accessToken: string;
}
