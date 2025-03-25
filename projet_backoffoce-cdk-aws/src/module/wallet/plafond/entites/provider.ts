import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Provider {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'varchar' })
    code: string;
    @Column({ type: 'varchar'})
    libelle: string;
}


