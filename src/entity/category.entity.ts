import { ProductCategory } from './product_category.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  category_no: number;

  @Column({ type: 'varchar', length: 20 })
  category_parent_name: string;

  @Column({ type: 'varchar', length: 20 })
  category_child_name: string;

  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.category,
  )
  productCategories: ProductCategory[];
}
