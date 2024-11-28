'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { CalendarIcon, PersonStandingIcon } from 'lucide-react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ACCOUNT_TYPE_ENUM } from '@/lib/enums'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'

const formSchema = z
  .object({
    email: z.string().email(),
    accountType: z.enum([ACCOUNT_TYPE_ENUM.PERSONAL, ACCOUNT_TYPE_ENUM.COMPANY]),
    companyName: z.string().optional(),
    employeesCount: z.coerce.number().optional(),
    birthDate: z.date().refine((val) => {
      const eightteenYearsAgo = new Date()
      eightteenYearsAgo.setFullYear(eightteenYearsAgo.getFullYear() - 18)
      return val <= eightteenYearsAgo
    }, 'You must be at least 18 years old'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .refine((val) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(val)
      }, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    passwordConfirm: z.string()
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['passwordConfirm'],
        message: 'Passwords do not match'
      })
    }

    if (data.accountType === ACCOUNT_TYPE_ENUM.COMPANY) {
      if (!data.companyName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['companyName'],
          message: 'Company name is required'
        })
      }

      if (!data.employeesCount || data.employeesCount < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['employeesCount'],
          message: 'The count of employees is required and must be greater than 0'
        })
      }
    }
  })

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      accountType: ACCOUNT_TYPE_ENUM.PERSONAL
    }
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
  }

  const localAccountType = form.watch('accountType')
  const CompanyPartialForm = () => {
    return localAccountType === ACCOUNT_TYPE_ENUM.COMPANY ? (
      <>
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Company Name" {...field}></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="employeesCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employees</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Employees Count" {...field}></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
      </>
    ) : (
      <></>
    )
  }

  const fromDateOfBirth = new Date()
  fromDateOfBirth.setFullYear(fromDateOfBirth.getFullYear() - 150)

  return (
    <>
      <PersonStandingIcon size={50} className="text-pink-500" />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Sign up for a new SupportMe account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="flex flex-col gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              {/* email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="chengminglong@digital-engine.com" {...field}></Input>
                    </FormControl>
                    <FormDescription>
                      This is the email address you signed up to SupportMe Dashboard
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              {/* account type */}
              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an account type"></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ACCOUNT_TYPE_ENUM.PERSONAL}>Personal</SelectItem>
                        <SelectItem value={ACCOUNT_TYPE_ENUM.COMPANY}>Company</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <CompanyPartialForm />
              {/* birth date */}
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn('w-full pr-2', 'flex justify-between')}
                          >
                            {!!field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          defaultMonth={field.value}
                          selected={field.value}
                          onSelect={field.onChange}
                          fixedWeeks
                          weekStartsOn={1}
                          fromDate={fromDateOfBirth}
                          toDate={new Date()}
                        ></Calendar>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      This is the email address you signed up to SupportMe Dashboard
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              {/* password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Please input your password"
                        type="password"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              {/* password */}
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Please input your password"
                        type="password"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              {/* submit */}
              <Button type="submit">Sign up</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-between">
          <small>Already have a account?</small>
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
