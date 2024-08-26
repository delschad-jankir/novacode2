// components/forms/user-register-form.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, firestore } from '../../firebaseConfig';
import { useRouter } from 'next/navigation'; // Import useRouter
import { doc, setDoc, Timestamp } from 'firebase/firestore'; // Import Firestore functions
import FullScreenLoader from '@/components/ui/FullScreenLoader'; // Import FullScreenLoader

const formSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  company: z.string().min(1, { message: 'Company name is required' }),
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, { message: 'Password should be at least 6 characters long' })
});

type RegisterFormValue = z.infer<typeof formSchema>;

export default function UserRegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullScreenLoader, setShowFullScreenLoader] = useState(false); // Full screen loader state
  const form = useForm<RegisterFormValue>({
    resolver: zodResolver(formSchema)
  });
  const router = useRouter(); // Initialize useRouter

  const onSubmit = async (data: RegisterFormValue) => {
    setLoading(true);
    setError(null);
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: data.fullName
      });

      // Add user data to Firestore
      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        fullName: data.fullName,
        email: data.email,
        company: data.company,
        createdAt: Timestamp.now() // Timestamp of the document creation
      });

      // Log the registered user
      console.log('User registered:', userCredential.user);

      // Show the full-screen loader
      setShowFullScreenLoader(true);

      // Redirect to the dashboard after a slight delay to ensure the loading animation is visible
      setTimeout(() => {
        router.push('/dashboard');
      }, 500); // Adjust the delay as needed
    } catch (error) {
      console.error('Error registering user:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showFullScreenLoader && <FullScreenLoader message="Registering..." />} {/* Show loader if needed */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your company name"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    disabled={loading}
                    {...field}
                  />
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
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Register
          </Button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
      </Form>
    </>
  );
}
