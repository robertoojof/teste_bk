import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './env-config.interface';

@Injectable()
export class EnvConfigService implements EnvConfig {
  constructor(private readonly config: ConfigService) {}

  getAppPort(): number {
    return Number(this.config.get<number>('PORT'));
  }

  getNodeEnv(): string {
    return this.config.get<string>('NODE_ENV') as string;
  }
}
