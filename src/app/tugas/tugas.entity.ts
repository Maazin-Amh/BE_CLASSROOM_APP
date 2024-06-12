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
import { Class } from '../class/class.entity';
import { Pengumpulan } from '../pengumpulan/pengumpulan.entity';

@Entity()
export class Tugas extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  judul: string;

  @Column({ nullable: true })
  files: string;

  @Column({ type: 'text', nullable: false })
  subject: string;

  @ManyToOne(() => Admins)
  @JoinColumn({ name: 'created_by' })
  created_by: Admins;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'class_by' })
  class_by: Class;

  @ManyToMany(() => Pengumpulan, (tugas) => tugas.tugas)
  submites: Pengumpulan[];

  @ManyToOne(() => Admins)
  @JoinColumn({ name: 'updated_by' })
  updated_by: Admins;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
