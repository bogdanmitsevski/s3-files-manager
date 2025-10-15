import { Column, ColumnOptions } from 'typeorm';

export const TextColumn = (options?: ColumnOptions) =>
  Column({ ...options, type: 'text' });

export const VarcharColumn = (options?: ColumnOptions) =>
  Column({ ...options, type: 'varchar' });

export const IntColumn = (options?: ColumnOptions) =>
  Column({ ...options, type: 'int' });

export const BigIntColumn = (options?: ColumnOptions) =>
  Column({ ...options, type: 'bigint' });
