import { Provide } from '@midwayjs/core'; import { InjectEntityModel } from '@midwayjs/typeorm'; import { Repository } from 'typeorm'; import { CommissionConfig } from '../entity/commission-config.entity';
@Provide() export class CommissionConfigService {
  @InjectEntityModel(CommissionConfig) model: Repository<CommissionConfig>;
  async list(): Promise<CommissionConfig[]> { return this.model.createQueryBuilder('c').orderBy('c.module_name','ASC').getMany(); }
  async update(moduleName: string, rate: number): Promise<CommissionConfig | null> {
    let c = await this.model.findOne({ where: { moduleName } });
    if (!c) { c = new CommissionConfig(); c.moduleName = moduleName; }
    c.rate = rate;
    return this.model.save(c);
  }
}
