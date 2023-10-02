import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export const handleDBExceptions = (error: any): never => {
  if (error?.code === 11000)
    throw new BadRequestException(`Duplicated data in database`);
  if (error?.name === 'CastError')
    throw new BadRequestException(`Cast error. ${error?.message}`);
  throw new InternalServerErrorException(
    `Unexpected error. Error code: ${error?.code}`,
  );
};
