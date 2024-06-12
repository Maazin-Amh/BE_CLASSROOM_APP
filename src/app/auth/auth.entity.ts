import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Class } from '../class/class.entity';
import { Pengumpulan } from '../pengumpulan/pengumpulan.entity';
import { ResetPassword } from '../mail/reset_password.entity';

export enum UserRole {
  Guru = 'guru',
  Siswa = 'siswa',
}

@Entity()
export class Admins extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  nama: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Guru,
  })
  role: string;

  @OneToMany(() => Class, (v) => v.created_at)
  class_create_by: Class[];

  @OneToMany(() => Class, (v) => v.updated_at)
  class_update_by: Class[];

  @ManyToMany(() => Class, (classEntity) => classEntity.join_by, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  class: Class[];

  @OneToMany(() => Pengumpulan, (v) => v.created_at)
  pengumpulan_create_by: Pengumpulan[];

  @OneToMany(() => ResetPassword, (reset) => reset.admins)
  reset_password: ResetPassword;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
