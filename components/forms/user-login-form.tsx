// components/forms/user-login-form.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { useRouter } from 'next/navigation';
import FullScreenLoader from '../ui/fullScreenLoader';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, { message: 'Password should be at least 6 characters long' }),
});

type LoginFormValue = z.infer<typeof formSchema>;

export default function UserLoginForm() {
  const [loading, setLoading] = useState(false);
  const [showFullScreenLoader, setShowFullScreenLoader] = useState(false); // Full screen loader state
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginFormValue>({ resolver: zodResolver(formSchema) });
  const router = useRouter();

  const onSubmit = async (data: LoginFormValue) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log('User logged in:', userCredential.user);

      // Show the full-screen loader
      setShowFullScreenLoader(true);

      // Redirect to the dashboard after a slight delay to ensure the loading animation is visible
      setTimeout(() => {
        router.push('/dashboard');
      }, 500); // Adjust the delay as needed
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showFullScreenLoader && <FullScreenLoader />} {/* Show loader if needed */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Login
          </Button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
      </Form>
    </>
  );
}
