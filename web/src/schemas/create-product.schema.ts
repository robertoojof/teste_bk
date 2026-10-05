import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Informe o nome do produto')
    .max(255, 'O nome deve ter no máximo 255 caracteres'),
  sku: z
    .string()
    .trim()
    .min(1, 'Informe o SKU')
    .max(50, 'O SKU deve ter no máximo 50 caracteres'),
  price: z.number().int().positive('Informe o preço de venda'),
});

export type CreateProductValues = z.infer<typeof CreateProductSchema>;
