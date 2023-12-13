import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class UtilsService {
  sha256(str: string): string {
    return createHash('sha-256').update(str).digest('hex');
  }
}
