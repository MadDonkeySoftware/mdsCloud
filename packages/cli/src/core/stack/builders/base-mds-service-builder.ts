import { join } from 'path';
import { BaseBuilder } from './base-builder';

export abstract class BaseMdsServiceBuilder extends BaseBuilder {
  protected abstract packageFolderName: string;

  protected get packageDirectory(): string {
    return join(this.sourceDirectory, 'packages', this.packageFolderName);
  }
}
