import { z } from "zod";

export const SignUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8)
})

export const AddressSchema = z.object({
    lineOne: z.string(),
    lineTwo: z.string().nullable(),
    city: z.string(),
    pincode: z.string().length(6),
    country: z.string()
})

export const UpdateUserSchema = z.object({
    name: z.string().optional(),
    defaultShippingAddress: z.number().optional(),
    defaultBillingAddress: z.number().optional()
})

const RoleEnum = z.enum(["ADMIN", "USER"]);

export const ChangeUserRoleSchema = z.object({
    role: RoleEnum
});