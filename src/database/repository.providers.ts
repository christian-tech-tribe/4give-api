import { DataSource, Transaction } from 'typeorm';
import { Donor } from '../donors/entity/donor.entity';
import { Communication } from '../donors/entity/communication.entity';
import { Donation } from '../donations/entity/donation.entity';
import { Campaign } from '../campaign/entity/campaign.entity';
import { Note } from 'src/note/entity/note.entity';
import { Expense } from 'src/expenses/entity/expense.entity';
import { BankingToken } from 'src/banking/entity/banking-token';
import { Action } from 'rxjs/internal/scheduler/Action';

export const repositoryProviders = [
  {
    provide: 'DONOR_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Donor),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'DONATION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Donation),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'COMMUNICATION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Communication),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'CAMPAIGN_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Campaign),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'NOTE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Note),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ACTION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Action),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'EXPENSE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Expense),
    inject: ['DATA_SOURCE'],
  },

  {
    provide: 'TRANSACTION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Transaction),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'BANKING_TOKEN_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(BankingToken),
    inject: ['DATA_SOURCE'],
  }  
];