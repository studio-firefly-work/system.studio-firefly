import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['Serializable']);

export const ContactScalarFieldEnumSchema = z.enum(['id','name','kana','email','message','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// CONTACT SCHEMA
/////////////////////////////////////////

export const ContactSchema = z.object({
  // omitted: id: z.number().int(),
  name: z.string().min(1),
  kana: z.string().min(1).regex(/^[\p{Script=Hiragana}\p{Script=Katakana}ー々]+$/u),
  email: z.string().email(),
  message: z.string().min(1),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
})

export type Contact = z.infer<typeof ContactSchema>
