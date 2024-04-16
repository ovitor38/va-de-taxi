import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HasherAdapter {
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  }

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
