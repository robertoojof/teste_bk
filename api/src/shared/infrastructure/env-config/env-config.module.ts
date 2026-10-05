import { join } from 'node:path';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { EnvConfigService } from './env-config.service';

@Module({
  imports: [ConfigModule],
  providers: [EnvConfigService],
  exports: [EnvConfigService],
})
export class EnvConfigModule extends ConfigModule {
  static async forRoot(
    options: ConfigModuleOptions = {},
  ): Promise<DynamicModule> {
    const configModule = await ConfigModule.forRoot({
      ...options,
      envFilePath: [
        join(__dirname, `../../../../.env.${process.env.NODE_ENV}`),
      ],
    });

    return {
      ...configModule,
      module: EnvConfigModule,
      providers: [...(configModule.providers ?? []), EnvConfigService],
      exports: [...(configModule.exports ?? []), EnvConfigService],
    };
  }
}
