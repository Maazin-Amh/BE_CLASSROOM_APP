import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Admins } from '../auth/auth.entity';
import { Tugas } from '../tugas/tugas.entity';

@Entity()
export class Pengumpulan extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  files: string;

  @ManyToOne(() => Admins)
  @JoinColumn({ name: 'created_by' })
  created_by: Admins;

  @ManyToOne(() => Tugas)
  @JoinColumn({ name: 'tugas_by' })
  tugas_by: Tugas;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
