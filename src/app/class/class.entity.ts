import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  Admin,
} from 'typeorm';
import { Admins } from '../auth/auth.entity';
import { Tugas } from '../tugas/tugas.entity';

@Entity()
export class Class extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nama_kelas: string;

  @Column({ type: 'text', nullable: false })
  subject: string;

  @Column({ unique: true, nullable: false })
  code: string;

  @ManyToOne(() => Admins)
  @JoinColumn({ name: 'created_by' })
  created_by: Admins;

  @ManyToOne(() => Admins)
  @JoinColumn({ name: 'updated_by' })
  updated_by: Admins;

  @OneToMany(() => Tugas, (v) => v.class_by)
  tugas_by: Tugas;

  @ManyToMany(() => Admins, (siswa) => siswa.class)
  join_by: Admins[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
