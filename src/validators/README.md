# Validators

Centralized Zod schemas for forms. Create one file per domain or form.

## Files

- `auth.ts`: `loginSchema` for the login form
- `tenant.ts`: `createTenantSchema` for the tenant create form

## Usage

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { mySchema, type MySchema } from "@/validators/my";

const form = useForm<MySchema>({ resolver: zodResolver(mySchema) });

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit((values) => {/* ... */})}>
      <FormField name="field" control={form.control} render={({ field }) => (
        <FormItem>
          <FormLabel>Field</FormLabel>
          <FormControl>
            <input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </form>
  </Form>
);
```

