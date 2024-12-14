import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { Database } from '@/integrations/supabase/types/database.types'

type Subscription = Database['public']['Tables']['subscriptions']['Row']

export function useSubscription() {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  // Get current subscription with better error handling
  const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      console.log('Fetching subscription data')
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.log('No session found')
        throw new Error('No session')
      }

      console.log('Session found, fetching subscription for user:', session.user.id)
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (error) {
        console.error('Error fetching subscription:', error)
        throw error
      }
      
      console.log('Subscription data fetched:', data)
      return data as Subscription
    },
    retry: 1,
  })

  // Create subscription mutation with improved error handling
  const createSubscription = useMutation({
    mutationFn: async (planId: string) => {
      console.log('Creating subscription for plan:', planId)
      setIsLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          console.log('No session found during subscription creation')
          throw new Error('No session')
        }

        const { data, error } = await supabase.functions.invoke('subscription', {
          body: { action: 'create', planId }
        })

        if (error) {
          console.error('Error creating subscription:', error)
          throw error
        }
        
        console.log('Subscription created successfully:', data)
        return data
      } finally {
        setIsLoading(false)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
      toast.success('Subscription created successfully')
    },
    onError: (error: Error) => {
      console.error('Subscription creation error:', error)
      toast.error(`Error creating subscription: ${error.message}`)
    }
  })

  // Cancel subscription mutation with improved error handling
  const cancelSubscription = useMutation({
    mutationFn: async () => {
      console.log('Cancelling subscription')
      setIsLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          console.log('No session found during subscription cancellation')
          throw new Error('No session')
        }

        const { data, error } = await supabase.functions.invoke('subscription', {
          body: { action: 'cancel' }
        })

        if (error) {
          console.error('Error cancelling subscription:', error)
          throw error
        }
        
        console.log('Subscription cancelled successfully:', data)
        return data
      } finally {
        setIsLoading(false)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
      toast.success('Subscription cancelled successfully')
    },
    onError: (error: Error) => {
      console.error('Subscription cancellation error:', error)
      toast.error(`Error cancelling subscription: ${error.message}`)
    }
  })

  // Check usage limits with improved error handling
  const checkUsageLimits = async (featureName: string) => {
    console.log('Checking usage limits for feature:', featureName)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.log('No session found during usage check')
        throw new Error('No session')
      }

      const { data, error } = await supabase.functions.invoke('subscription', {
        body: { action: 'check_limits', featureName }
      })

      if (error) {
        console.error('Error checking usage limits:', error)
        throw error
      }

      console.log('Usage limits checked:', data)
      return data
    } catch (error) {
      console.error('Error checking usage limits:', error)
      return { canUse: false, error: error.message }
    }
  }

  return {
    subscription,
    isLoading: isLoading || isLoadingSubscription,
    createSubscription,
    cancelSubscription,
    checkUsageLimits
  }
}